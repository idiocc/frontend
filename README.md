# @idio/frontend

[![npm version](https://badge.fury.io/js/%40idio%2Ffrontend.svg)](https://npmjs.org/package/@idio/frontend)

`@idio/frontend` is The Middleware To Serve Front-End JavaScript. It allows to set-up the modern front-end development environment where `node_modules` are served alongside compiled JSX code (without using _Babel_, see [`@a-la/jsx`](https://github.com/a-la/jsx)).

```sh
yarn add -E @idio/frontend
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async frontend(config: FrontendConfig): Middleware`](#async-frontendconfig-frontendconfig-middleware)
  * [`FrontEndConfig`](#type-frontendconfig)
- [Copyright](#copyright)

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

## <code>async <ins>frontend</ins>(</code><sub><br/>&nbsp;&nbsp;`config: FrontendConfig,`<br/></sub><code>): <i>Middleware</i></code>

The middleware constructor will initialise the middleware function to serve files from the specified directory (`frontend` by default). The files will be updated on-the-fly to fix their imports to relative paths (e.g., `preact` will be transformed into `/node_modules/preact/dist/preact.mjs`). Any CSS styles will also be served using an injector script.

Files served with this middleware, either transpiler or plain JS, will be cached using their `mtime`. There is no need to compute `md5` because this middleware is meant for the development purposes, whereas production code can be built with [_Depack_](https://artdecocode.com/depack/).

__<a name="type-frontendconfig">`FrontEndConfig`</a>__: Options for the middleware.

|   Name    |                   Type                    |                                                                                                                                       Description                                                                                                                                        |           Default            |
| --------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| directory | <em>(string \| !Array&lt;string&gt;)</em> | The directory or directories from which to serve files.                                                                                                                                                                                                                                  | `frontend`                   |
| mount     | <em>string</em>                           | The directory on which to mount. The dirname must be inside the mount. E.g., to serve `example/src/index.js` from `/src/index.js`, the **mount** is `example/src` and **directory** is `src`.                                                                                            | `.`                          |
| override  | <em>!Object&lt;string, string&gt;</em>    | Instead of resolving the _package.json_ path for packages and looking up the module and main fields, paths can be passed manually in the override. E.g., `{ preact: '/node_modules/preact/src/preact.js' }` will serve the source code of _Preact_ instead of the resolved dist version. | -                            |
| pragma    | <em>string</em>                           | The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`.                                                         | `import { h } from 'preact'` |

The middleware can be used in any `Koa` application, or within the [`idio` web server](https://idio.cc).

```jsx
/* yarn example/ */
import idio from '@idio/idio'
import render from '@depack/render'
import frontend from '@idio/frontend'

(async () => {
  const { url, app } = await idio({
    // logger: { use: true },
    _frontend: {
      use: true,
      middlewareConstructor(_, config) {
        return frontend(config)
      },
      config: {
        directory: 'example/frontend',
      },
    },
  }, { port: process.env.PORT })
  app.use(async (ctx) => {
    ctx.body = render(<html>
      <head><title>Example</title></head>
      <body>
        Hello World
        <script type="module" src="example/frontend"/>
      </body>
    </html>, { addDoctype: true })
  })
  console.log('Started on %s', url)
})()
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

render(<Component test="Welcome"/>, document.body)
render(<Form>
  <Input placeholder="hello world"/>
</Form>, document.body)
```

*The component*

```jsx
import './style.css'

const Component = ({ test }) => {
  return <div>{test}</div>
}

export default Component
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

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://idio.cc">Idio</a> 2019</th>
    <th>
      <a href="https://idio.cc">
        <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio">
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img width="100" src="https://raw.githubusercontent.com/idiocc/cookies/master/wiki/arch4.jpg"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>