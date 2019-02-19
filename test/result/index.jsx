// serves the folder
/

/* expected */
import { h } from '/node_modules/preact/dist/preact.mjs'
import { render } from '/node_modules/preact/dist/preact.mjs'
import Component from './Component'

render(     h(Component,{},
  `Hello World`
), document.body)
/**/

// adds pragma automatically
index.jsx

/* expected */
import { h } from '/node_modules/preact/dist/preact.mjs'
import { render } from '/node_modules/preact/dist/preact.mjs'
import Component from './Component'

render(     h(Component,{},
  `Hello World`
), document.body)
/**/

// serves explicit node_module path
explicit.js

/* expected */
import fixture from '/node_modules/@idio/preact-fixture/src'
import preact from '/node_modules/preact/src/preact'
/**/

// serves direct import
direct.js

/* expected */
import '/node_modules/preact/debug'
/**/