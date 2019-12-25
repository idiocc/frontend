## API

The package is available by importing its default function:

```js
import frontend from '@idio/frontend'
```

%~%

<typedef name="frontEnd">types/api.xml</typedef>

The middleware constructor will initialise the middleware function to serve files from the specified directory or directories (`frontend` by default). The files will be updated on-the-fly to fix their imports to relative paths (e.g., `preact` will be transformed into `/node_modules/preact/dist/preact.mjs`). Any CSS styles will also be served using an injector script.

Files served with this middleware, either transpiler or plain JS, will be cached using their `mtime`. There is no need to compute `md5` because this middleware is meant for the development purposes, whereas production code can be built with [_Depack_](https://artdecocode.com/depack/).

<typedef>types/index.xml</typedef>

The middleware can be used in any _Koa application, or within the [`idio` web server](https://www.idio.cc).

%EXAMPLE: example, ../src => @idio/frontend%

%TREE example/frontend%

*The entry point*

%EXAMPLE: example/frontend%

*The component*

%EXAMPLE: example/frontend/Component%

*The style*

%EXAMPLE: example/frontend/style.css%

<!-- %FORK example% -->
![Chrome Example](docs/Example1.gif)

%~%