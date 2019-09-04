import read from '@wrote/read'
import transpileJSX from '@a-la/jsx'
import resolveDependency from 'resolve-dependency'
import exists from '@wrote/exists'
import makePromise from 'makepromise'
import { lstat } from 'fs'
import { join, relative } from 'path'
import { patchSource } from './lib'

/**
 * The Middleware To Serve Front-End JavaScript.
 * @param {!_idio.FrontEndConfig} [config] Options for the middleware.
 * @param {string|!Array<string>} [config.directory="frontend"] The directory or directories from which to serve files. Default `frontend`.
 * @param {string} [config.mount="."] The directory on which to mount. The dirname must be inside the mount. E.g., to serve `example/src/index.js` from `/src/index.js`, the **mount** is `example/src` and **directory** is `src`. Default `.`.
 * @param {!Object<string, string>} [config.override] Instead of resolving the _package.json_ path for packages and looking up the module and main fields, paths can be passed manually in the override. E.g., `{ preact: '/node_modules/preact/src/preact.js' }` will serve the source code of _Preact_ instead of the resolved dist version.
 * @param {string} [config.pragma="import { h } from 'preact'"] The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`. Default `import { h } from 'preact'`.
 */
export default async function frontend(config = {}) {
  const {
    directory = 'frontend',
    pragma = 'import { h } from \'preact\'',
    mount = '.',
    override = {},
    log,
  } = config
  const dirs = Array.isArray(directory) ? directory : [directory]

  await dirs.reduce(async (acc, current) => {
    await acc
    const dir = join(mount, current)
    const e = await exists(dir)
    if (!e)
      throw new Error(`Frontend directory ${current} does not exist.`)
  }, {})

  /** @type {import('koa').Middleware} */
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
    body = await patch(path, body, pragma, { mount, override })
    let end = new Date().getTime()
    if (log) log('%s patched in %sms', path, end - start)
    ctx.type = 'application/javascript'
    ctx.body = body
  }
  return m
}

const patch = async (path, body, pragma, { mount, override }) => {
  if (/\.jsx$/.test(path)) {
    body = await transpileJSX(body)
    if (pragma) body = `${pragma}\n${body}`
  }
  if (/\.css$/.test(path)) {
    body = wrapCss(body)
  } else {
    body = await patchSource(path, body, { mount, override } )
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


/* typal types/index.xml namespace */
/**
 * @typedef {_idio.FrontEndConfig} FrontEndConfig Options for the middleware.
 * @typedef {Object} _idio.FrontEndConfig Options for the middleware.
 * @prop {string|!Array<string>} [directory="frontend"] The directory or directories from which to serve files. Default `frontend`.
 * @prop {string} [mount="."] The directory on which to mount. The dirname must be inside the mount. E.g., to serve `example/src/index.js` from `/src/index.js`, the **mount** is `example/src` and **directory** is `src`. Default `.`.
 * @prop {!Object<string, string>} [override] Instead of resolving the _package.json_ path for packages and looking up the module and main fields, paths can be passed manually in the override. E.g., `{ preact: '/node_modules/preact/src/preact.js' }` will serve the source code of _Preact_ instead of the resolved dist version.
 * @prop {string} [pragma="import { h } from 'preact'"] The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`. Default `import { h } from 'preact'`.
 */
