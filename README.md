# @idio/frontend

[![npm version](https://badge.fury.io/js/%40idio%2Ffrontend.svg)](https://npmjs.org/package/@idio/frontend)

`@idio/frontend` is The Middleware To Serve Front-End JavaScript. It allows to set-up the modern front-end development environment where `node_modules` are served alongside compiled JSX code.

```sh
yarn add -E @idio/frontend
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`frontend(config: FrontendConfig): Middleware`](#frontendconfig-frontendconfig-middleware)
  * [`FrontendConfig`](#type-frontendconfig)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import frontend from '@idio/frontend'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `frontend(`<br/>&nbsp;&nbsp;`config: FrontendConfig,`<br/>`): Middleware`

The middleware constructor will initialise the middleware function to serve files from the specified directory (`frontend` by default). The files will be updated on-the-fly to fix their imports to relative paths (e.g., `preact` will be transformed into `node_modules/preact/dist/preact.mjs`). Any CSS styles will also be served using an injector script.

__<a name="type-frontendconfig">`FrontendConfig`</a>__: Options for the middleware.

|   Name    |   Type   |               Description                |  Default   |
| --------- | -------- | ---------------------------------------- | ---------- |
| directory | _string_ | The directory from which to serve files. | `frontend` |

```jsx
/* yarn example/ */
import core from '@idio/core'
import render from 'preact-render-to-string'
import frontend from '@idio/frontend'

(async () => {
  const { url, router, app } = await core({
    logger: { use: true },
    frontend: {
      use: true,
      middlewareConstructor(_, config) {
        return frontend(config)
      },
      config: {
        directory: 'example/frontend',
      },
    },
  })
  router.get('/', async (ctx) => {
    ctx.body = '<!doctype html>\n' + render(
      <html>
        <head><title>Example</title></head>
        <body>
          Hello World
          <script type="module" src="example/frontend"/>
        </body>
      </html>)
  })
  app.use(router.routes())
  console.log('Started on %s', url)
})()
```

*The entry point*

```jsx
import { h, render } from 'preact'
import Component from './Component'

render(<Component test="Welcome"/>, document.body)
```

*The component *

```jsx
import { h } from 'preact'
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

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" />
      </a>
    </th>
    <th>
      © <a href="https://artd.eco">Art Deco</a>
      for
      <a href="https://idio.cc">Idio</a>
      2019
    </th>
    <th>
        <a href="https://idio.cc">
          <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio" />
        </a>
      </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif" alt="Tech Nation Visa" />
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks">Tech Nation Visa Sucks</a>
    </th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>