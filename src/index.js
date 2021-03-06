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
import { c } from 'erte'
import { patchSource } from './lib'
import __$styleInject from './inject-css'
import { HR, getClasses, getAssignments } from './lib/hr'

let watch, shouldNormalise

let listener, moduleListener
// readFileSync(join(__dirname, 'listener.js'))

/**
 * @type {!_idio.frontEnd}
 */
function FrontEnd(config = {}) {
  const {
    directory = 'frontend',
    pragma = 'import { h } from \'preact\'',
    mount = '.',
    jsxOptions,
    exportClasses = true,
    hotReload,
  } = config
  let { log, override = {} } = config
  if (log === true) log = console.log
  let dirs = Array.isArray(directory) ? directory : [directory]

  // check if all dirs exist
  dirs = dirs.map((current) => {
    const dir = join(mount, current)
    const e = existsSync(dir)
    if (!e)
      throw new Error(`Frontend directory ${current} does not exist.`)
    return current.replace(/\\/g, '/')
  })

  let cw = {}, hotReloadPaths
  if (hotReload) {
    if (!hotReload.path) hotReload.path = '/hot-reload'
    if (!('module' in hotReload)) hotReload.module = true
    if (!('ignoreNodeModules' in hotReload)) hotReload.ignoreNodeModules = true

    const { watchers: WATCHING = {} } = hotReload
    cw.WATCHING = WATCHING
    cw.CLIENTS = {}

    const { path: p } = hotReload
    override = { ...override, '@idio/hot-reload': p }

    const { path: hotReloadPath } = hotReload
    hotReloadPaths = [hotReloadPath, hotReloadPath.replace(/\.jsx?$/, '')]
      .filter((v, i, a) => a.indexOf(v) == i)
  }

  let upgraded = false

  /**
   * @type {!_goa.Middleware}
   */
  const m = async (ctx, next) => {
    if (hotReload && hotReloadPaths.includes(ctx.path)) {
      ctx.type = 'js'
      // read for the first time
      if (hotReload.module && !moduleListener) {
        moduleListener = readFileSync(join(__dirname, 'listener.mjs'))
      } else if (!hotReload.module && !listener) {
        listener = readFileSync(join(__dirname, 'listener.js'))
      }
      ctx.body = hotReload.module ? moduleListener : listener
      if (!upgraded) {
        const server = hotReload.getServer()
        cw.CLIENTS = websocket(server)
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
      return next()
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
      body = patchHotReload(path, body, hotReload, cw)
    }

    ctx.body = body
  }
  return m
}

/**
 * @param {string} path
 * @param {string} body
 * @param {_idio.HotReload} hotReload
 */
const patchHotReload = (path, body, hotReload, cw) => {
  const { ignoreNodeModules, module: mod, path: p } = hotReload
  if (path.startsWith('node_modules') && ignoreNodeModules)
    return body

  const fe = c('[@idio/frontend]', 'grey')
  try {
    if (!watch) watch = require(/* dpck */ 'node-watch')
  } catch (err) {
    console.error('%s node-watch is recommended for front-end hot reload.', fe)
    console.error('%s Falling back to standard watch.', fe)
    shouldNormalise = true
    watch = require(/* dpck */ 'fs').watch
  }
  if (!(path in cw.WATCHING)) {
    const watcher = watch(path, (type, filename) => {
      console.error('%s File %s changed', fe, c(filename, 'yellow'))
      Object.values(cw.CLIENTS).forEach((v) => {
        const fn = shouldNormalise ? path : filename
        v('update', { filename: fn })
      })
    })
    cw.WATCHING[path] = watcher
  }
  const { classes, namedAssignments = [] } = getClasses(body)
  const assignments = getAssignments(body)
  namedAssignments.forEach((na) => {
    assignments[na] = na
  })
  const hr = HR(path, classes, assignments, mod ? p : null)
  body = body.replace(/^export(\s+)const(\s+)(\S+)\s+=/gm, t => t.replace('const', 'let'))
  if (namedAssignments.length) {
    body = body.replace(new RegExp(`^const(\\s+(?:${namedAssignments.join('|')})\\s+)`, 'gm'), 'let$1')
  }
  body += `${EOL}${EOL}${hr}`

  return body
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
    if (pragma) body = `${pragma}${EOL}${body}`
  }
  if (/\.css$/.test(path)) {
    body = wrapCss(body, { exportClasses, path })
  } else {
    body = await patchSource(path, body, config)
  }
  return body
}

/**
 * Adds JS wrapper to add CSS dynamically.
 * @param {string} style
 */
const wrapCss = (style, { exportClasses = true, path = '' } = {}) => {
  let classes = []
  if (exportClasses) {
    const t = style.split(/\r?\n/)
      .filter((a) => {
        return /^\S/.test(a)
      }).join(EOL)
    classes = mismatch(/\.([\w\d_-]+)/g, t, ['className'])
      .map(({ 'className': cl }) => cl)
      .filter((v, i, a) => a.indexOf(v) == i)
  }
  const styleId = path
    .replace(/\.css$/, '')
    .replace(/[/\\]/g, '-')
    .replace(/[^\w\d_-]/g, '')
  const inj = __$styleInject.toString()
    .replace(/FRONTEND-STYLE-ID/g, styleId)
  return `(${inj})(\`${style}\`)
${classes.map((cl) => {
    return `export const $${cl} = '${cl}'`
  }).join(EOL)}`.replace(/\r?\n/g, EOL).trim()
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').frontEnd} _idio.frontEnd
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').HotReload} _idio.HotReload
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@typedefs/goa').Middleware} _goa.Middleware
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('fs').Stats} fs.Stats
 */