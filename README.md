# @idio/frontend

[![npm version](https://badge.fury.io/js/%40idio%2Ffrontend.svg)](https://www.npmjs.com/package/@idio/frontend)
![Node.js CI](https://github.com/idiocc/frontend/workflows/Node.js%20CI/badge.svg)

`@idio/frontend` is The Middleware To Serve Front-End JavaScript. It allows to set-up the modern front-end development environment where `node_modules` are served alongside compiled JSX code (without using _Babel_, see [`@a-la/jsx`](https://github.com/a-la/jsx)).

<a href="https://www.idio.cc">
  <img src="docs/frontend.gif" alt="Idio Frontend Middleware">
</a>

```sh
yarn add @idio/frontend
npm i @idio/frontend
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`frontEnd(config=: FrontEndConfig): !_goa.Middleware`](#frontendconfig-frontendconfig-_goamiddleware)
  * [`FrontEndConfig`](#type-frontendconfig)
- [Hot Reload](#hot-reload)
  * [`HotReload`](#type-hotreload)
  * [Enabling Hot Reload](#enabling-hot-reload)
  * [Status](#status)
  * [Node-watch](#node-watch)
- [Copyright & License](#copyright--license)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default function:

```js
import frontend from '@idio/frontend'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## <code><ins>frontEnd</ins>(</code><sub><br/>&nbsp;&nbsp;`config=: FrontEndConfig,`<br/></sub><code>): <i>!_goa.Middleware</i></code>
Create a middleware to serve **Front-End** _JavaScript_, including JSX and `node_modules`.

 - <kbd>config</kbd> <em><code><a href="#type-frontendconfig" title="Options for the middleware.">FrontEndConfig</a></code></em> (optional): Options for the middleware.

The middleware constructor will initialise the middleware function to serve files from the specified directory or directories (`frontend` by default). The files will be updated on-the-fly to fix their imports to relative paths (e.g., `preact` will be transformed into `/node_modules/preact/dist/preact.mjs`). Any CSS styles will also be served using an injector script.

Files served with this middleware, either transpiler or plain JS, will be cached using their `mtime`. There is no need to compute `md5` because this middleware is meant for the development purposes, whereas production code can be built with [_Depack_](https://artdecocode.com/depack/).

__<a name="type-frontendconfig">`FrontEndConfig`</a>__: Options for the middleware.


|     Name      |                                                               Type                                                                |                                                                                                                                       Description                                                                                                                                        |           Default            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| directory     | <em>(string \| !Array&lt;string&gt;)</em>                                                                                         | The directory or directories from which to serve files.                                                                                                                                                                                                                                  | `frontend`                   |
| mount         | <em>string</em>                                                                                                                   | The directory on which to mount. The dirname must be inside the mount. E.g., to serve `example/src/index.js` from `/src/index.js`, the **mount** is `example/src` and **directory** is `src`.                                                                                            | `.`                          |
| override      | <em>!Object&lt;string, string&gt;</em>                                                                                            | Instead of resolving the _package.json_ path for packages and looking up the module and main fields, paths can be passed manually in the override. E.g., `{ preact: '/node_modules/preact/src/preact.js' }` will serve the source code of _Preact_ instead of the resolved dist version. | -                            |
| pragma        | <em>string</em>                                                                                                                   | The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`.                                                         | `import { h } from 'preact'` |
| log           | <em>(boolean \| !Function)</em>                                                                                                   | Log to console when source files were patched.                                                                                                                                                                                                                                           | `false`                      |
| jsxOptions    | <em>[!_alaJsx.Config](#type-_alajsxconfig)</em>                                                                                   | Options for the transpiler.                                                                                                                                                                                                                                                              | -                            |
| exportClasses | <em>boolean</em>                                                                                                                  | When serving CSS, also export class names.                                                                                                                                                                                                                                               | `true`                       |
| hotReload     | <em><a href="#type-hotreload" title="Options for hot reload (real-time automatic update of code in browser).">!HotReload</a></em> | Enable hot reload for modules. Requires at least to implement `getServer` method so that WebSocket listener can be set up on the HTTP server.                                                                                                                                            | -                            |

The middleware can be used in any _Koa application, or within the [`idio` web server](https://www.idio.cc).

```jsx
import idio, { render } from '@idio/idio'
import frontend from '@idio/frontend'

/**
 * @param {import('..').FrontEndConfig} options
 */
export default async (options = {}, src = 'example/frontend') => {
  const { url, app, router, server } = await idio({
    // logger: { use: true },
    _frontend: {
      use: true,
      middlewareConstructor() {
        return frontend({
          directory: ['example/frontend', 'example/reload'],
          ...options,
        })
      },
    },
  }, { port: process.env.PORT })
  router.get('/', async (ctx) => {
    ctx.body = render(<html>
      <head><title>Example</title></head>
      <body>
        Hello World
        <div id="app" />
        <script type="module" src={src}/>
      </body>
    </html>, { addDoctype: true })
  })
  app.use(router.routes())
  console.error('Started on %s', url)
  return { app, url, server }
}
```

```m
example/frontend
├── Component.jsx
├── index.jsx
└── style.css
```

*The entry point*

```jsx
import { render } from 'preact'
import Component from './Component'
// linked node_modules are also resolved
import Form, { Input } from '@depack/form'

const component = <Component test="Welcome"/>
const form = (<Form>
  <Input placeholder="hello world"/>
</Form>)

let c = render(component, window['app'])
let f = render(form, document.body)

/* IDIO HOT RELOAD */
import addHotReload from '@idio/hot-reload'
addHotReload(() => {
  c = render(component, document.body, c)
  f = render(form, document.body, f)
})
```

*The component*

```jsx
import { Component } from 'preact'
import './style.css'

export default class Example extends Component {
  constructor() {
    super()
    this.state = {
      count: 0,
    }
  }
  render({ test }) {
    const { count } = this.state
    return (<div onClick={() => {
      this.setState({ count: count + 1 })
    }}>{test} + updated + {count}</div>)
  }
}
```

*The style*

```css
body {
  background: lightcyan;
}
```

![Chrome Example](docs/Example1.gif)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## Hot Reload

This package supports hot reload of modules, mainly for the purpose of developing _Preact_ apps.

__<a name="type-hotreload">`HotReload`</a>__: Options for hot reload (real-time automatic update of code in browser).


|       Name        |                                                                                                                      Type                                                                                                                       |                                   Description                                    |     Default      |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------- |
| path              | <em>string</em>                                                                                                                                                                                                                                 | The path from which to serve the operational module that provides admin methods. | `/hot-reload.js` |
| module            | <em>boolean</em>                                                                                                                                                                                                                                | Whether to serve the hot-reload script as a module.                              | `true`           |
| ignoreNodeModules | <em>boolean</em>                                                                                                                                                                                                                                | Whether to ignore paths from `node_modules`.                                     | `true`           |
| watchers          | <em>!Object&lt;string, [!fs.FSWatcher](#type-fsfswatcher)&gt;</em>                                                                                                                                                                              | Pass an empty object here so that references to _FSWatchers_ can be saved.       | -                |
| __getServer*__    | <em>() => <a href="https://nodejs.org/api/http.html#http_class_http_server" title="An HTTP server that extends net.Server to handle network requests."><img src=".documentary/type-icons/node-odd.png" alt="Node.JS Docs">!http.Server</a></em> | The function used to get the server to enable web socket connection.             | -                |

The middleware will append some code at the end of each original file, and when an update is detected, it will use dynamic import to get references to new methods and classes. When dealing with classes, the prototype of the original class will be changed at run-time. E.g., if a render method is changed, after updating the prototype and rerendering the whole app, a new `render` method will be used.

_For example, there's a simple component:_

```jsx
import { Component } from 'preact'
import { $Example } from './style.css'

export default class Example extends Component {
  constructor() {
    super()
    this.example = this.example.bind(this)
  }
  example() {
    console.log('clicked')
  }
  render({ test }) {
    return (<div id={test} onClick={this.example}
      className={$Example}>
      Hello World
    </div>)
  }
}

export const Example2 = () => {
  return (<span>Open Source!</span>)
}

const Example3 = () => {
  return (<pre>Art Deco © {new Date().getFullYear()}</pre>)
}

export { Example3 }
```

_When hot reload is enabled, it's going to have an additional code at the bottom of the file when served via **front-end** middleware:_

```jsx
import { h } from '/node_modules/preact/dist/preact.mjs'
import { Component } from '/node_modules/preact/dist/preact.mjs'
import { $Example } from './style.css'

export default class Example extends Component {
  constructor() {
    super()
    this.example = this.example.bind(this)
  }
  example() {
    console.log('clicked')
  }
  render({ test }) {
    return (  h('div',{id:test, onClick:this.example,
      className:$Example},
      `Hello World`
    ))
  }
}

export let Example2 = () => {
  return (h('span',{},`Open Source!`))
}

let Example3 = () => {
  return (h('pre',{},`Art Deco © `,new Date().getFullYear()))
}

export { Example3 }

/* IDIO HOT RELOAD */
import { idioHotReload } from '/hot-reload'
if (idioHotReload) {
  let _idio = 0
  idioHotReload('example/reload/Example.jsx', async () => {
    _idio++
    const module = await import(`./Example?ihr=${_idio}`)
    Example2 = module['Example2']
    Example3 = module['Example3']
    return {
      module,
      classes: {
        'default': Example,
      },
    }
  })
}
```

Such code registers a listener to messages from the websocket connection.

### Enabling Hot Reload

The API provided for the reload is implemented in a JS file served from [`/hot-reload.js`](/src/listener.js) path. It has 2 functions:

- `idioAddHotReload`: the function to execute to rerender the app, which needs to be implemented by the developer. This should be imported in the application main entry point.
- `idioHotReload`: the function to register that a module can be hot-reloaded. Called by auto-generated code from the `frontend` middleware.

After an update is done, the app needs to be rerendered. This is why we have to update the entry file to our application a little bit:

```jsx
import { render, Component } from 'preact'
import Example, { Example2, Example3 } from './Example'

class App extends Component {
  render() {
    return (<html>
      <body>
        <Example test="example"/>
        <Example2 />
        <Example3 />
      </body>
    </html>)
  }
}

const app = (<App />)
const a = render(app, window.app)

/* IDIO HOT RELOAD */
import addHotReload from '@idio/hot-reload'
addHotReload(() => {
  render(app, document.body, a)
})
```

In this case, we created a component and passed it for initial render into a container. The return of this function can then be used inside the `idioAddHotReload` listener to rerender the component [without](https://github.com/developit/preact/issues/1259) it loosing its state.

Therefore, to enable the reload, add the default export from `@idio/hot-reload`.

```js
import addHotReload from '@idio/hot-reload'
addHotReload(() => {
  render(app, document.body, a)
})
```

The front-end middleware will rename it into `/hot-reload` path automatically, but when you're building the code with _Depack_, you should install [`@idio/hot-reload`](https://github.com/idiocc/hot-reload) package, which exports a default dummy function that doesn't do anything, and will be dropped by the compiler so that there's no additional bytes added to the bundle because of the hot reload.

```js
// @idio/hot-reload main:
export default (cb) => {}
```

### Status

At the moment, the following works:

- Updating classes, exported like the following:
    ```js
    export default class A {}

    class B {}
    class C {}
    export default B
    export { C }
    ```
- Updating all other exports. When exporting a _const_, it will be transpiled into a _let_, because otherwise it's impossible to update the binding.
    ```js
    export const A = () => {} // will become `let`
    export let B = () => {}

    const C = () => {} // will become let
    let D = 'hello'

    export { C, D }
    ```
- Update styles dynamically upon changes to CSS files.

What doesn't work:

- If you're binding a method in a constructor, it won't be updated, since we don't have access to instances and only update prototypes. This actually doesn't work even in `react-hot-reload`.
    ```js
    class E extends Component {
      constructor() {
        super()
        this.example = this.example.bind(this)
      }
      example() {
        // callback
      }
      render() {
        // example won't be reloaded since it was bound.
        return (<div onClick={this.example}>)
      }
    }
    ```

### Node-watch

It's recommended to install `node-watch` which is an improvement to the standard watcher, that deals with bouncing multiple instant refreshes that happen in some IDEs like _VS Code_.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

## Copyright & License

GNU Affero General Public License v3.0

<table>
  <tr>
    <th>
      <a href="https://www.artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://www.artd.eco">Art Deco™</a> for <a href="https://idio.cc">Idio</a> 2020</th>
    <th>
      <a href="https://idio.cc">
        <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio">
      </a>
    </th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>