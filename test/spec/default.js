import { equal } from 'zoroaster/assert'
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
  async 'redirects to the index file'({ start, directory }) {
    const { url } = await start({
      frontend: {
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
  async 'adds pragma automatically'({ start, directory, SNAPSHOT_DIR },
    { test, setDir }) {
    setDir(SNAPSHOT_DIR)
    const { url } = await start({
      frontend: {
        use: true,
        middlewareConstructor(app, config) {
          return frontend(config)
        },
        config: { directory },
      },
    })
    const res = await rqt(`${url}/${directory}/index.jsx`)
    await test('pragma.jsx', res)
  },
}

export default T