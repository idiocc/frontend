## Hot Reload

This package supports hot reload of modules, mainly for the purpose of developing _Preact_ apps.

<typedef>types/hot-reload.xml</typedef>

The middleware will append some code at the end of each original file, and when an update is detected, it will use dynamic import to get references to new methods and classes. When dealing with classes, the prototype of the original class will be changed at run-time. E.g., if a render method is changed, after updating the prototype and rerendering the whole app, a new `render` method will be used.

_For example, there's a simple component:_

%EXAMPLE: example/reload/Example%

_When hot reload is enabled, it's going to have an additional code at the bottom of the file when served via **front-end** middleware:_

<fork lang="jsx">example/reload</fork>

The API provided for the reload is implemented in a JS file served from [`/hot-reload.js`](/src/listener.js) path. It has 2 functions:

- `idioAddHotReload`: the function to execute to rerender the app, which needs to be implemented by the developer.
- `idioHotReload`: the function to register that a module can be hot-reloaded. Called by auto-generated code from the `frontend` middleware.

After an update is done, the app needs to be rerendered. This is why we have to update the entry file to our application a little bit:

%EXAMPLE: example/reload/App%

In this case, we created a component and passed it for initial render into a container. The return of this function can then be used inside the `idioAddHotReload` listener to rerender the component [without](https://github.com/developit/preact/issues/1259) it loosing its state.

At the moment, the following works:

- Update classes, exported like `export default class` and `export class`.
- Update all other exports, exported like `export const [A] =` and `export let [B] = `. When exporting a _const_, it will be transpiled into a _let_, because otherwise it's impossible to update the binding.

What doesn't work:

- Defining a class or a function first, and then exporting it like:
    ```js
    class Example {}
    const a = () => {}
    export default Example
    export { a }
    ```
- If you're binding a method in a constructor, it won't be unbound after an update, but it also won't be updated, since we don't have access to instances and only update prototypes.
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

%~%