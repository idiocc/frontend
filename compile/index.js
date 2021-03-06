const _frontend = require('./front-end')

/**
 * Create a middleware to serve **Front-End** _JavaScript_, including JSX and `node_modules`.
 * @param {_idio.FrontEndConfig} [config] Options for the middleware.
 * @param {string|!Array<string>} [config.directory="frontend"] The directory or directories from which to serve files. Default `frontend`.
 * @param {string} [config.mount="."] The directory on which to mount. The dirname must be inside the mount. E.g., to serve `example/src/index.js` from `/src/index.js`, the **mount** is `example/src` and **directory** is `src`. Default `.`.
 * @param {!Object<string, string>} [config.override] Instead of resolving the _package.json_ path for packages and looking up the module and main fields, paths can be passed manually in the override. E.g., `{ preact: '/node_modules/preact/src/preact.js' }` will serve the source code of _Preact_ instead of the resolved dist version.
 * @param {string} [config.pragma="import { h } from 'preact'"] The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`. Default `import { h } from 'preact'`.
 * @param {boolean|!Function} [config.log=false] Log to console when source files were patched. Default `false`.
 * @param {!_alaJsx.Config} [config.jsxOptions] Options for the transpiler.
 * @param {boolean} [config.exportClasses=true] When serving CSS, also export class names. Default `true`.
 * @param {!_idio.HotReload} [config.hotReload] Enable hot reload for modules. Requires at least to implement `getServer` method so that WebSocket listener can be set up on the HTTP server.
 * @return {!_goa.Middleware}
 */
function $frontend(config) {
  return _frontend(config)
}

module.exports = $frontend

/* typal types/index.xml namespace */
/**
 * @typedef {import('@a-la/jsx').Config} _alaJsx.Config
 * @typedef {_idio.FrontEndConfig} FrontEndConfig Options for the middleware.
 * @typedef {Object} _idio.FrontEndConfig Options for the middleware.
 * @prop {string|!Array<string>} [directory="frontend"] The directory or directories from which to serve files. Default `frontend`.
 * @prop {string} [mount="."] The directory on which to mount. The dirname must be inside the mount. E.g., to serve `example/src/index.js` from `/src/index.js`, the **mount** is `example/src` and **directory** is `src`. Default `.`.
 * @prop {!Object<string, string>} [override] Instead of resolving the _package.json_ path for packages and looking up the module and main fields, paths can be passed manually in the override. E.g., `{ preact: '/node_modules/preact/src/preact.js' }` will serve the source code of _Preact_ instead of the resolved dist version.
 * @prop {string} [pragma="import { h } from 'preact'"] The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`. Default `import { h } from 'preact'`.
 * @prop {boolean|!Function} [log=false] Log to console when source files were patched. Default `false`.
 * @prop {!_alaJsx.Config} [jsxOptions] Options for the transpiler.
 * @prop {boolean} [exportClasses=true] When serving CSS, also export class names. Default `true`.
 * @prop {!_idio.HotReload} [hotReload] Enable hot reload for modules. Requires at least to implement `getServer` method so that WebSocket listener can be set up on the HTTP server.
 */

/* typal types/hot-reload.xml namespace */
/**
 * @typedef {import('http').Server} http.Server
 * @typedef {import('fs').FSWatcher} fs.FSWatcher
 * @typedef {_idio.HotReload} HotReload `＠record` Options for hot reload (real-time automatic update of code in browser).
 * @typedef {Object} _idio.HotReload `＠record` Options for hot reload (real-time automatic update of code in browser).
 * @prop {string} [path="/hot-reload.js"] The path from which to serve the operational module that provides admin methods. Default `/hot-reload.js`.
 * @prop {boolean} [module=true] Whether to serve the hot-reload script as a module. Default `true`.
 * @prop {boolean} [ignoreNodeModules=true] Whether to ignore paths from `node_modules`. Default `true`.
 * @prop {!Object<string, !fs.FSWatcher>} [watchers] Pass an empty object here so that references to _FSWatchers_ can be saved.
 * @prop {() => !http.Server} getServer The function used to get the server to enable web socket connection.
 */

/* typal types/api.xml namespace */
/**
 * @typedef {import('@typedefs/goa').Middleware} _goa.Middleware
 * @typedef {_idio.frontEnd} frontEnd Create a middleware to serve **Front-End** _JavaScript_, including JSX and `node_modules`.
 * @typedef {(config?: _idio.FrontEndConfig) => !_goa.Middleware} _idio.frontEnd Create a middleware to serve **Front-End** _JavaScript_, including JSX and `node_modules`.
 */
