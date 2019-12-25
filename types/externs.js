/**
 * @fileoverview
 * @externs
 */

/* typal types/index.xml */
/** @const */
var _idio = {}
/**
 * Options for the middleware.
 * @typedef {{ directory: ((string|!Array<string>)|undefined), mount: (string|undefined), override: ((!Object<string, string>)|undefined), pragma: (string|undefined), log: ((boolean|!Function)|undefined) }}
 */
_idio.FrontEndConfig

/* typal types/api.xml */
/**
 * Create a middleware to serve **Front-End** _JavaScript_, including JSX and `node_modules`.
 * @typedef {function(_idio.FrontEndConfig=): !_goa.Middleware}
 */
_idio.frontEnd
