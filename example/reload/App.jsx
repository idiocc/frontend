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