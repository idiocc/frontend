let read = require('@wrote/read'); if (read && read.__esModule) read = read.default;
let transpileJSX = require('@a-la/jsx'); if (transpileJSX && transpileJSX.__esModule) transpileJSX = transpileJSX.default;
let resolveDependency = require('resolve-dependency'); if (resolveDependency && resolveDependency.__esModule) resolveDependency = resolveDependency.default;
let exists = require('@wrote/exists'); if (exists && exists.__esModule) exists = exists.default;
let makePromise = require('makepromise'); if (makePromise && makePromise.__esModule) makePromise = makePromise.default;
const { lstat } = require('fs');
const { join, relative } = require('path');
const { patchSource } = require('./lib');

/**
 * The Middleware To Serve Front-End JavaScript.
 * @param {!_frontend.Config} [config] Options for the middleware.
 * @param {string} [config.directory="frontend"] The directory from which to serve files. Default `frontend`.
 * @param {string} [config.mount="."] Where to mount the middleware (relative to what folder is the directory). Default `.`.
 * @param {string} [config.pragma="import { h } from 'preact'"] The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`. Default `import { h } from 'preact'`.
 */
               async function frontend(config = {}) {
  const {
    directory = 'frontend',
    pragma = 'import { h } from \'preact\'',
    mount = '.',
    log,
  } = config
  const dir = join(mount, directory)
  const e = await exists(dir)
  if (!e)
    throw new Error(`Frontend directory ${dir} does not exist.`)
  /** @type {import('koa').Middleware} */
  const m = async (ctx, next) => {
    let p = ctx.path.replace('/', '')
    const canServe = p == directory
      || p.startsWith(`${directory}/`)
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
    /** @type {import('fs').Stats} */
    let ls
    try {
      ls = await makePromise(lstat, path)
    } catch (err) {
      ctx.status = 404
      return
    }
    ctx.status = 200
    ctx.etag = ls.mtime.getTime()
    if (ctx.fresh) {
      ctx.status = 304
      return
    }
    let body = await read(path)
    let start = new Date().getTime()
    body = await patch(path, body, pragma, mount)
    let end = new Date().getTime()
    if (log) log('%s patched in %sms', path, end - start)
    ctx.type = 'application/javascript'
    ctx.body = body
  }
  return m
}

const patch = async (path, body, pragma, mount) => {
  if (/\.jsx$/.test(path)) {
    body = await transpileJSX(body)
    if (pragma) body = `${pragma}\n${body}`
  }
  if (/\.css$/.test(path)) {
    body = wrapCss(body)
  } else {
    body = await patchSource(path, body, mount)
  }
  return body
}

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


/* documentary types/index.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_frontend.Config} Config Options for the middleware.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _frontend.Config Options for the middleware.
 * @prop {string} [directory="frontend"] The directory from which to serve files. Default `frontend`.
 * @prop {string} [mount="."] Where to mount the middleware (relative to what folder is the directory). Default `.`.
 * @prop {string} [pragma="import { h } from 'preact'"] The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`. Default `import { h } from 'preact'`.
 */


module.exports = frontend