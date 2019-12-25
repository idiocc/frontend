import read from '@wrote/read'
import transpileJSX from '@a-la/jsx'
import resolveDependency from 'resolve-dependency'
import makePromise from 'makepromise'
import { lstat, existsSync } from 'fs'
import { join, relative } from 'path'
import { patchSource } from './lib'

/**
 * @type {!_idio.frontEnd}
 */
function FrontEnd(config = {}) {
  const {
    directory = 'frontend',
    pragma = 'import { h } from \'preact\'',
    mount = '.',
    override = {},
  } = config
  let { log } = config
  if (log === true) log = console.log
  const dirs = Array.isArray(directory) ? directory : [directory]

  dirs.forEach((current) => {
    const dir = join(mount, current)
    const e = existsSync(dir)
    if (!e)
      throw new Error(`Frontend directory ${current} does not exist.`)
  })

  /**
   * @type {!_goa.Middleware}
   */
  const m = async (ctx, next) => {
    let p = ctx.path.replace('/', '')
    const canServe = dirs.includes(p)
      || dirs.some(d => p.startsWith(`${d}/`))
      || ctx.path.startsWith('/node_modules/')
    if (!canServe) {
      return await next()
    }
    p = join(mount, p)
    const { path, isDir } = await resolveDependency(p)
    if (isDir && !p.endsWith('/')) {
      const mountPath = mount ? relative(mount, path) : path
      ctx.redirect(`/${mountPath}`)
      return
    }
    /** @type {!fs.Stats} */
    let ls
    try {
      ls = /** @type {!fs.Stats} */ (await makePromise(lstat, path))
    } catch (err) {
      ctx.status = 404
      return
    }
    ctx.status = 200
    ctx.etag = `${ls.mtime.getTime()}`
    if (ctx.fresh) {
      ctx.status = 304
      return await next()
    }
    let body = await read(path)
    let start = new Date().getTime()
    body = await patch(path, body, pragma, { mount, override })
    let end = new Date().getTime()
    if (log) /** @type {!Function} */ (log)('%s patched in %sms', path, end - start)
    ctx.type = 'application/javascript'
    ctx.body = body
  }
  return m
}

export default FrontEnd

/**
 * Patches the source code to map node_modules and transpile JSX.
 * @param {string} path Path to the file.
 * @param {string} body The source code to patch.
 * @param {string} pragma Add this import to the body.
 */
const patch = async (path, body, pragma, { mount, override }) => {
  if (/\.jsx$/.test(path)) {
    body = transpileJSX(body)
    if (pragma) body = `${pragma}\n${body}`
  }
  if (/\.css$/.test(path)) {
    body = wrapCss(body)
  } else {
    body = await patchSource(path, body, { mount, override } )
  }
  return body
}

/**
 * Adds JS wrapper to add CSS dynamically.
 * @param {string} style
 */
const wrapCss = (style) => {
  return `function __$styleInject(css = '') {
  const head = document.head
  const style = document.createElement('style')
  style.type = 'text/css'
  if (style.styleSheet){
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
  head.appendChild(style)
}
const style = \`${style}\`
__$styleInject(style)`
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').frontEnd} _idio.frontEnd
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@typedefs/goa').Middleware} _goa.Middleware
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('fs').Stats} fs.Stats
 */