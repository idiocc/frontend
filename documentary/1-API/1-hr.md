## Hot Reload

This package supports hot reload of modules, mainly for the purpose of developing _Preact_ apps.

<typedef>types/hot-reload.xml</typedef>

The middleware will append some code at the end of each original file, and when an update is detected, it will use dynamic import to get references to new methods and classes. When dealing with classes, the prototype of the original class will be changed at run-time. E.g., if a render method is changed, after updating the prototype and rerendering the whole app, a new `render` method will be used.

_For example, there's a simple component:_

%EXAMPLE: example/reload/Example%

_When hot reload is enabled, it's going to have an additional code at the bottom of the file when served via **front-end** middleware:_

<fork lang="jsx">example/reload</fork>

Such code registers a listener to messages from the websocket connection.

### Enabling Hot Reload

The API provided for the reload is implemented in a JS file served from [`/hot-reload.js`](/src/listener.js) path. It has 2 functions:

- `idioAddHotReload`: the function to execute to rerender the app, which needs to be implemented by the developer. This should be imported in the application main entry point.
- `idioHotReload`: the function to register that a module can be hot-reloaded. Called by auto-generated code from the `frontend` middleware.

After an update is done, the app needs to be rerendered. This is why we have to update the entry file to our application a little bit:

%EXAMPLE: example/reload/App%

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

%~%