let read = require('@wrote/read'); if (read && read.__esModule) read = read.default;
let transpileJSX = require('@a-la/jsx'); if (transpileJSX && transpileJSX.__esModule) transpileJSX = transpileJSX.default;
let resolveDependency = require('resolve-dependency'); if (resolveDependency && resolveDependency.__esModule) resolveDependency = resolveDependency.default;
let exists = require('@wrote/exists'); if (exists && exists.__esModule) exists = exists.default;
const { patchSource } = require('./lib');

/**
 * The Middleware To Serve Front-End JavaScript.
 * @param {FrontendConfig} [config] Options for the middleware.
 * @param {string} [config.directory="frontend"] The directory from which to serve files. Default `frontend`.
 * @param {string} [config.pragma="import { h } from 'preact'"] The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`. Default `import { h } from 'preact'`.
 */
               async function frontend(config = {}) {
  const {
    directory = 'frontend',
    pragma = 'import { h } from \'preact\'',
  } = config
  /** @type {import('koa').Middleware} */
  const e = await exists(directory)
  if (!e) {
    throw new Error(`Frontend directory ${directory} does not exist.`)
  }
  const m = async (ctx, next) => {
    const p = ctx.path.replace('/', '')
    if ( p == directory
      || p.startsWith(`${directory}/`)
      || p.startsWith('node_modules/'))
    {
      const { path, isDir } = await resolveDependency(p)
      if (isDir && !p.endsWith('/')) {
        ctx.redirect(`/${path}`)
        return
      }
      let body = await read(path)
      body = await patch(path, body, pragma)
      ctx.type = 'application/javascript'
      ctx.body = body
    } else {
      await next()
    }
  }
  return m
}

const patch = async (path, body, pragma) => {
  if (/\.jsx$/.test(path)) {
    body = await transpileJSX(body)
    if (pragma) body = `${pragma}\n${body}`
  }
  if (/\.css$/.test(path)) {
    body = wrapCss(body)
  } else {
    body = await patchSource(path, body)
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
 * @typedef {Object} FrontendConfig Options for the middleware.
 * @prop {string} [directory="frontend"] The directory from which to serve files. Default `frontend`.
 * @prop {string} [pragma="import { h } from 'preact'"] The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`. Default `import { h } from 'preact'`.
 */


module.exports = frontend