// adds pragma automatically
index.jsx

/* expected */
import { h } from '/node_modules/preact/dist/preact.mjs'
import { render } from '/node_modules/preact/dist/preact.mjs'
import Component from './Component.jsx'

render(h(Component), document.body)
/**/

// serves explicit node_module path
explicit.js

/* expected */
import fixture from '/node_modules/@idio/preact-fixture/src/index.js'
import preact from '/node_modules/preact/src/preact.js'
/**/

// serves direct import
direct.js

/* expected */
import '/node_modules/preact/debug.js'
/**/