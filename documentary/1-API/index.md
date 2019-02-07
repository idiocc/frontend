## API

The package is available by importing its default function:

```js
import frontend from '@idio/frontend'
```

%~%

```## async frontend => Middleware
[
  ["config", "FrontendConfig"]
]
```

The middleware constructor will initialise the middleware function to serve files from the specified directory (`frontend` by default). The files will be updated on-the-fly to fix their imports to relative paths (e.g., `preact` will be transformed into `/node_modules/preact/dist/preact.mjs`). Any CSS styles will also be served using an injector script.

%TYPEDEF types/index.xml%

The middleware can be used in any `Koa` application, or within the [`idio` web server](https://idio.cc).

%EXAMPLE: example/example.jsx, ../src => @idio/frontend%

%TREE example/frontend%

*The entry point*

%EXAMPLE: example/frontend/index.jsx%

*The component*

%EXAMPLE: example/frontend/Component.jsx%

*The style*

%EXAMPLE: example/frontend/style.css%

<!-- %FORK example example/example% -->
![Chrome Example](docs/Example.gif)

%~%