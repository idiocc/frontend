import { equal, throws } from 'zoroaster/assert'
import rqt, { aqt } from 'rqt'
import SnapshotContext from 'snapshot-context'
import Context from '../context'
import frontend from '../../src'

/** @type {Object.<string, (c: Context, s:SnapshotContext)>} */
const T = {
  context: [Context, SnapshotContext],
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
  async 'updates the references in node_module'({ start, directory, SNAPSHOT_DIR },
    { test, setDir }) {
    setDir(SNAPSHOT_DIR)
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
    await test('node_module.js', res)
  },
}

export default T