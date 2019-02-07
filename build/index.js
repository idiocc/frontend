const { collect } = require('catchment');
const { Replaceable } = require('restream');
let read = require('@wrote/read'); if (read && read.__esModule) read = read.default;
const { relative, join, dirname } = require('path');
let transpileJSX = require('@a-la/jsx'); if (transpileJSX && transpileJSX.__esModule) transpileJSX = transpileJSX.default;
let resolveDependency = require('resolve-dependency'); if (resolveDependency && resolveDependency.__esModule) resolveDependency = resolveDependency.default;

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
  const m = async (ctx, next) => {
    const p = ctx.path.replace('/', '')
    if (p == directory || p.startsWith(`${directory}/`)) {
      const { path, isDir } = await resolveDependency(p)
      if (isDir) {
        ctx.redirect(`/${path}`)
        return
      }
      let body = await read(path)
      body = await patch(path, body, pragma)
      ctx.type = 'application/javascript'
      ctx.body = body
    } else if (p.startsWith('node_modules/')) {
      let body = await read(p)
      body = await patch(p, body, pragma)
      ctx.body = body
      ctx.type = 'application/javascript'
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

const patchSource = async (path, source) => {
  const replacement = async (m, pre, from) => {
    if (/^[/.]/.test(from)) {
      const dir = dirname(path)
      const p = join(dir, from)
      const { path: rd } = await resolveDependency(p)
      const rel = relative(dir, rd)
      const r = rel.startsWith('.') ? rel : `./${rel}`
      return `${pre}'${r}'`
    }
    let [scope, name, ...paths] = from.split('/')
    if (!scope.startsWith('@') && name) {
      paths = [name, ...paths]
      name = scope
    } else {
      name = `${scope}/${name}`
    }
    if (paths.length) {
      return getNodeModule(name, paths.join('/'), pre)
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

/* documentary types/index.xml */
/**
 * @typedef {Object} FrontendConfig Options for the middleware.
 * @prop {string} [directory="frontend"] The directory from which to serve files. Default `frontend`.
 * @prop {string} [pragma="import { h } from 'preact'"] The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`. Default `import { h } from 'preact'`.
 */


module.exports = frontend