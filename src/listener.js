/* eslint-env browser */
const ws = new WebSocket(`ws://${location.host}`, 'json')
setInterval(() => {
  if (ws.readyState == ws.OPEN) ws.send('')
}, 2000)

const listeners = {}
const reloaders = []

/**
 * Functions that render root applications, called for re-renderning.
 */
window.idioAddHotReload = (cb) => {
  reloaders.push(cb)
}
/**
 * Register a callback for hot reload.
 */
window.idioHotReload = (path, callback) => {
  // already registered for that path
  if (path in listeners) return
  listeners[path] = callback
}

const PREACT_PROPS = ['setState', 'forceUpdate', 'render', 'componentWillMount',
  'componentDidMount', 'componentWillUnmount', 'getChildContext',
  'componentWillReceiveProps', 'shouldComponentUpdate', 'componentWillUpdate',
  'componentDidUpdate']

ws.addEventListener('message', async (event) => {
  const { message, event: e } = JSON.parse(event.data)
  console.log('Received %s:', e, message)
  const { filename } = message
  const cb = listeners[filename]
  if (cb) {
    const { module, classes = {} } = await cb()
    Object.entries(classes).forEach(([key, Cl]) => {
      const NewClass = module[key]
      if (!NewClass) {
        console.error('A class with key %s wasn\'t exported by new module.', key)
        return
      }
      PREACT_PROPS.forEach((prop) => {
        Cl.prototype[prop] = NewClass.prototype[prop]
      })
    })
    reloaders.forEach((rcb) => {
      rcb()
    })
  } else {
    console.log('Listener for %s not found', filename)
  }
})