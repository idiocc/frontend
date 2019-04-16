import { equal, throws } from 'zoroaster/assert'
import rqt, { aqt } from 'rqt'
import Context from '../context'
import frontend from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof frontend, 'function')
  },
  async 'throws error when directory does not exist'() {
    await throws({
      async fn() {
        await frontend({
          directory: 'test-error',
        })
      },
      message: 'Frontend directory test-error does not exist.',
    })
  },
  async 'redirects to the index file'({ start, directory }) {
    const { url } = await start({
      _frontend: {
        use: true,
        middlewareConstructor(app, config) {
          return frontend(config)
        },
        config: { directory },
      },
    })
    const { headers: {
      location,
    } } = await aqt(`${url}/${directory}`, { justHeaders: 1 })
    equal(location, `/${directory}/index.jsx`)
  },
  async 'updates the references in node_module'({ start, directory }) {
    const { url } = await start({
      _frontend: {
        use: true,
        middlewareConstructor(app, config) {
          return frontend(config)
        },
        config: { directory },
      },
    })
    const res = await rqt(`${url}/node_modules/@idio/preact-fixture/src/index.js`)
    return res
  },
}

export default T