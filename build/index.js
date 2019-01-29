const { collect } = require('catchment');
const { Replaceable } = require('restream');
let exists = require('@wrote/exists'); if (exists && exists.__esModule) exists = exists.default;
let read = require('@wrote/read'); if (read && read.__esModule) read = read.default;
const { relative, join, dirname } = require('path');
let transpileJSX = require('@a-la/jsx'); if (transpileJSX && transpileJSX.__esModule) transpileJSX = transpileJSX.default;

/**
 * The Middleware To Serve Front-End JavaScript.
 * @param {Config} [config] Options for the program.
 * @param {boolean} [config.shouldRun=true] A boolean option. Default `true`.
 * @param {string} config.text A text to return.
 */
               async function frontend(config = {}) {
  const {
    directory = 'frontend',
    pragma = 'import { h } from \'preact\'',
  } = config
  /** @type {import('koa').Middleware} */
  const m = async (ctx, next) => {
    const p = ctx.path.replace('/', '')
    if (p == directory || p.startsWith(`${directory}/`)) {
      const { path, isDir } = await resolveDependency(p)
      if (isDir) {
        ctx.redirect(`/${path}`)
        return
      }
      let body = await read(path)
      if (/\.jsx$/.test(path)) {
        body = await transpileJSX(body, { quoteProps: 1 })
        if (pragma) body = `${pragma}\n${body}`
      }
      if (/\.css$/.test(path)) {
        body = wrapCss(body)
      } else {
        body = await patchSource(path, body)
      }
      ctx.type = 'application/javascript'
      ctx.body = body
    } else if (p.startsWith('node_modules/')) {
      ctx.body = await read(p)
      ctx.type = 'application/javascript'
    } else {
      await next()
    }
  }
  return m
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

const patchSource = async (path, source) => {
  const replacement = async (m, pre, from) => {
    if (/[/.]/.test(from)) {
      const dir = dirname(path)
      const p = join(dir, from)
      const { path: rd } = await resolveDependency(p)
      const rel = relative(dir, rd)
      const r = rel.startsWith('.') ? rel : `./${rel}`
      return `${pre}'${r}'`
    }
    const { module: mod } = require(`${from}/package.json`)
    if (!mod) {
      console.warn('[↛] Package %s does not specify module in package.json, trying src', from)
      const d = getNodeModule(from, 'src', pre)
      return d
    }
    return getNodeModule(from, mod, pre)
  }
  const rs = new Replaceable([
    {
      re: /^( *import(?:\s+[^\s,]+\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+)['"](.+)['"]/gm,
      replacement,
    },
  ])
  rs.end(source)
  const body = await collect(rs)
  return body
}

/**
 * Returns the import statement with the path to the dependency on the file system.
 */
const getNodeModule = (from, path, pre) => {
  const modPath = require.resolve(`${from}/${path}`)
  const modRel = relative('', modPath)
  return `${pre}'/${modRel}'`
}

/**
 * For the given local path that can omit the JS/JSX extension and point to a directory (e.g., `./lib` or `./lib/example`), find that file on the filesystem.
 */
const resolveDependency = async (path) => {
  let e = await exists(path)
  let res = path
  let isDir = false
  if (!e) {
    let p = `${path}.js`
    e = await exists(p)
    if (!e) p = `${path}.jsx`; e = await exists(p)
    if (!e) throw new Error(`${path}.js or ${path}.jsx is not found.`)
    res = p
  } else if (e.isDirectory()) {
    let p = `${path}/index.js`
    e = await exists(p)
    if (!e) p = `${p}x`; e = await exists(p)
    if (!e) throw new Error(`index.jsx? file is not found in ${path}.`)
    res = p
    isDir = true
  }
  return { path: res, isDir }
}

/* documentary types/index.xml */
/**
 * @typedef {Object} FrontendConfig Options for the middleware.
 * @prop {string} [directory="frontend"] The directory from which to serve files. Default `frontend`.
 * @prop {string} [pragma="import { h } from 'preact'"] The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`. Default `import { h } from 'preact'`.
 */


module.exports = frontend