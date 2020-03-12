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