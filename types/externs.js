/**
 * @fileoverview
 * @externs
 */

/* typal types/index.xml */
/** @const */
var _idio = {}
/**
 * Options for the middleware.
 * @typedef {{ directory: ((string|!Array<string>)|undefined), mount: (string|undefined), override: ((!Object<string, string>)|undefined), pragma: (string|undefined), log: ((boolean|!Function)|undefined), jsxOptions: ((!_alaJsx.Config)|undefined), exportClasses: (boolean|undefined), hotReload: ((!_idio.HotReload)|undefined) }}
 */
_idio.FrontEndConfig

/* typal types/hot-reload.xml */
/**
 * @record
 */
_idio.HotReload
/**
 * The path from which to serve the operational module that provides admin methods. Default `/hot-reload.js`.
 * @type {string|undefined}
 */
_idio.HotReload.prototype.path
/**
 * Whether to ignore paths from `node_modules`. Default `true`.
 * @type {boolean|undefined}
 */
_idio.HotReload.prototype.ignoreNodeModules
/**
 * Pass an empty object here so that references to _FSWatchers_ can be saved.
 * @type {(!Object<string, !fs.FSWatcher>)|undefined}
 */
_idio.HotReload.prototype.watchers
/**
 * Pass an empty object here so that references to _WebSocket_ connections can be saved.
 * @type {(*)|undefined}
 */
_idio.HotReload.prototype.clients
/**
 * The function used to get the server to enable web socket connection.
 * @return {http.Server}
 */
_idio.HotReload.prototype.getServer = function() {}

/* typal types/api.xml */
/**
 * Create a middleware to serve **Front-End** _JavaScript_, including JSX and `node_modules`.
 * @typedef {function(_idio.FrontEndConfig=): !_goa.Middleware}
 */
_idio.frontEnd
