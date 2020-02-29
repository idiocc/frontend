/* eslint-disable quote-props */
import read from '@wrote/read'
import transpileJSX from '@a-la/jsx'
import resolveDependency from 'resolve-dependency'
import makePromise from 'makepromise'
import { lstat, existsSync, readFileSync } from 'fs'
import { join, relative } from 'path'
import mismatch from 'mismatch'
import websocket from '@idio/websocket'
import { EOL } from 'os'
import { patchSource } from './lib'
import __$styleInject from './inject-css'
import { HR, getClasses } from './lib/hr'

const watch = require(/* dpck */ 'node-watch')

const listener = readFileSync(join(__dirname, 'listener.js'))

/**
 * @type {!_idio.frontEnd}
 */
function FrontEnd(config = {}) {
  const {
    directory = 'frontend',
    pragma = 'import { h } from \'preact\'',
    mount = '.',
    override = {},
    jsxOptions,
    exportClasses = true,
    hotReload,
  } = config
  let { log } = config
  if (log === true) log = console.log
  const dirs = Array.isArray(directory) ? directory : [directory]

  // check if all dirs exist
  dirs.forEach((current) => {
    const dir = join(mount, current)
    const e = existsSync(dir)
    if (!e)
      throw new Error(`Frontend directory ${current} does not exist.`)
  })

  let CLIENTS = {}, WATCHING
  if (hotReload) {
    ({ watchers: WATCHING = {} } = hotReload)
  }

  let upgraded = false
  /**
   * @type {!_goa.Middleware}
   */
  const m = async (ctx, next) => {
    if (hotReload && ctx.path == (hotReload.path || '/hot-reload.js')) {
      ctx.type = 'js'
      ctx.body = listener
      if (!upgraded) {
        const server = hotReload.getServer()
        CLIENTS = websocket(server)
        upgraded = true
      }
      return
    }
    let p = ctx.path.replace('/', '')
    const canServe = dirs.includes(p)
      || dirs.some(d => p.startsWith(`${d}/`))
      || ctx.path.startsWith('/node_modules/')
    if (!canServe) {
      return next()
    }
    p = join(mount, p).replace(/\\/g, '/')
    const { path, isDir } = await resolveDependency(p)
    if (isDir && !p.endsWith('/')) {
      const mountPath = mount ? relative(mount, path).replace(/\\/g, '/') : path
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
    body = await patch(path, body, pragma, {
      mount, override, jsxOptions, exportClasses,
    })
    let end = new Date().getTime()
    if (log) /** @type {!Function} */ (log)('%s patched in %sms', path, end - start)
    ctx.type = 'application/javascript'

    if (hotReload && !ctx.query.ihr) {
      if (path.startsWith('node_modules') && hotReload.ignoreNodeModules) {
        // continue
      } else {
        if (!(path in WATCHING)) {
          const watcher = watch(path, (type, filename) => {
            console.log('File %s changed', filename)
            Object.values(CLIENTS).forEach((v) => {
              v('update', { filename })
            })
          })
          WATCHING[path] = watcher
        }
        if (path.endsWith('jsx')) {
          const classes = getClasses(body)
          const hr = HR(path, classes)
          body += `\n\n${hr}`
        }
      }
    }

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
const patch = async (path, body, pragma, config) => {
  const { jsxOptions, exportClasses } = config
  if (/\.jsx$/.test(path)) {
    body = transpileJSX(body, jsxOptions)
    if (pragma) body = `${pragma}\n${body}`
  }
  if (/\.css$/.test(path)) {
    body = wrapCss(body, exportClasses)
  } else {
    body = await patchSource(path, body, config)
  }
  return body
}

/**
 * Adds JS wrapper to add CSS dynamically.
 * @param {string} style
 */
const wrapCss = (style, exportClasses = true) => {
  let classes = []
  if (exportClasses) {
    const c = style.split(/\r?\n/)
      .filter((a) => {
        return /^\S/.test(a)
      }).join(EOL)
    classes = mismatch(/\.([\w\d_-]+)/g, c, ['className'])
      .map(({ 'className': cl }) => cl)
      .filter((v, i, a) => a.indexOf(v) == i)
  }
  return `(${__$styleInject.toString()})(\`${style}\`)
${classes.map((cl) => {
    return `export const $${cl} = '${cl}'`
  }).join('\n')}`.trim()
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