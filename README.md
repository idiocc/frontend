# @idio/frontend

[![npm version](https://badge.fury.io/js/%40idio%2Ffrontend.svg)](https://www.npmjs.com/package/@idio/frontend)
![Node.js CI](https://github.com/idiocc/frontend/workflows/Node.js%20CI/badge.svg)

`@idio/frontend` is The Middleware To Serve Front-End JavaScript. It allows to set-up the modern front-end development environment where `node_modules` are served alongside compiled JSX code (without using _Babel_, see [`@a-la/jsx`](https://github.com/a-la/jsx)).

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
export default async (options = {}) => {
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
        <script src="/hot-reload.js"/>
        <script type="module" src="example/frontend"/>
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

const c = render(component, document.body)
const f = render(form, document.body)

/* IDIO HOT RELOAD */
window['idioAddHotReload'] && window['idioAddHotReload'](() => {
  render(component, document.body, c)
  render(form, document.body, f)
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


|       Name        |                                                                                                                       Type                                                                                                                       |                                   Description                                    |     Default      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ---------------- |
| path              | <em>string</em>                                                                                                                                                                                                                                  | The path from which to serve the operational module that provides admin methods. | `/hot-reload.js` |
| ignoreNodeModules | <em>boolean</em>                                                                                                                                                                                                                                 | Whether to ignore paths from `node_modules`.                                     | `true`           |
| watchers          | <em>!Object&lt;string, [!fs.FSWatcher](#type-fsfswatcher)&gt;</em>                                                                                                                                                                               | Pass an empty object here so that references to _FSWatchers_ can be saved.       | -                |
| __getServer*__    | <em>() => <a href="https://nodejs.org/api/http.html#http_class_http_server" title="An HTTP server that extends net.Server to handle network requests."><img src=".documentary/type-icons/node-even.png" alt="Node.JS Docs">!http.Server</a></em> | The function used to get the server to enable web socket connection.             | -                |

The middleware will append some code at the end of each original file, and when an update is detected, it will use dynamic import to get references to new methods and classes. When dealing with classes, the prototype of the original class will be changed at run-time. E.g., if a render method is changed, after updating the prototype and rerendering the whole app, a new `render` method will be used.

_For example, there's a simple component:_

```jsx
import { Component } from 'preact'

export default class Example extends Component {
  render({ test }) {
    return (<div id={test}>
      Hello World
    </div>)
  }
}
```

_When hot reload is enabled, it's going to have an additional code at the bottom of the file when served via **front-end** middleware:_

```jsx
import { h } from '/node_modules/preact/dist/preact.mjs'
import { Component } from '/node_modules/preact/dist/preact.mjs'

export default class Example extends Component {
  render({ test }) {
    return (h('div',{id:test},
      `Hello World`
    ))
  }
}

/* IDIO HOT RELOAD */
if (window.idioHotReload) {
  let i = 0
  idioHotReload('example/reload/Example.jsx', async () => {
    i++
    const module = await import(`./Example?ihr=${i}`)
    return {
      module,
      classes: {
        'default': Example,
      },
    }
  })
}
```

The API provided for the reload is implemented in a JS file served from [`/hot-reload.js`](/src/listener.js) path. It has 2 functions:

- `idioAddHotReload`: the function to execute to rerender the app, which needs to be implemented by the developer.
- `idioHotReload`: the function to register that a module can be hot-reloaded. Called by auto-generated code from the `frontend` middleware.

After an update is done, the app needs to be rerendered. This is why we have to update the entry file to our application a little bit:

```jsx
import { render, Component } from 'preact'
import Example from './Example'

class App extends Component {
  render() {
    return (<Example test="example"/>)
  }
}

const app = (<App />)
const a = render(app, window.app)

/* IDIO HOT RELOAD */
window['idioAddHotReload'] && window['idioAddHotReload'](() => {
  render(app, document.body, a)
})
```

In this case, we created a component and passed it for initial render into a container. The return of this function can then be used inside the `idioAddHotReload` listener to rerender the component [without](https://github.com/developit/preact/issues/1259) it loosing its state.

At the moment, the following works:

- update classes only, exported like `export default class` and `export class`.

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