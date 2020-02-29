import { render, Component } from 'preact'
import Example, { Example2 } from './Example'

class App extends Component {
  render() {
    return (<html>
      <body>
        <Example test="example"/>
        <Example2 />
      </body>
    </html>)
  }
}

const app = (<App />)
const a = render(app, window.app)

/* IDIO HOT RELOAD */
window['idioAddHotReload'] && window['idioAddHotReload'](() => {
  render(app, document.body, a)
})