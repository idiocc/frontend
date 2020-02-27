import { equal, throws } from '@zoroaster/assert'
import Zoroaster from 'zoroaster'
import rqt, { aqt } from 'rqt'
import Context from '../context'
import frontend from '../../src'
import { basename } from 'path'
// import { deepEqual } from 'assert';

/** @type {Object.<string, (c: Context, z: Zoroaster)>} */
const T = {
  context: [Context, Zoroaster],
  'is a function'() {
    equal(typeof frontend, 'function')
  },
  async'throws error when directory does not exist'() {
    await throws({
      async fn() {
        await frontend({
          directory: 'test-error',
        })
      },
      message: 'Frontend directory test-error does not exist.',
    })
  },
  async'redirects to the index file'({ start, directory }) {
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
  async'updates the references in node_module'({ start, directory }) {
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
  async'can serve both directories'({ start, directory, directory2 }) {
    const { url } = await start({
      _frontend: {
        use: true,
        middlewareConstructor(app, config) {
          return frontend(config)
        },
        config: {
          directory: [basename(directory), basename(directory2)],
          mount: 'test/fixture',
        },
      },
    })
    const res = await rqt(`${url}/frontend2/`)
    const res2 = await rqt(`${url}/frontend/`)
    return { res, res2 }
  },
  async'serves CSS'({ start, directory }, { snapshotExtension }) {
    snapshotExtension(process.env.ALAMODE_ENV == 'test-compile' ? 'jsx' : 'js')
    const { url } = await start({
      _frontend: {
        use: true,
        middlewareConstructor() {
          return frontend({
            directory,
          })
        },
      },
    })
    const res = await rqt(`${url}/${directory}/style.css`)
    return res
  },
  async'supports caching'({ start, directory }) {
    const logged = []
    const { url } = await start({
      _frontend: {
        use: true,
        middlewareConstructor(app, config) {
          return frontend(config)
        },
        config: { directory, log(...args) {
          logged.push(args)
        } },
      },
    })
    const u = `${url}/node_modules/@idio/preact-fixture/src/index.js`
    const { headers }  = await aqt(u)
    const { statusCode }  = await aqt(u, {
      headers: {
        'If-None-Match': headers.etag,
      },
      justHeaders: true,
    })
    equal(statusCode, 304)
    const [[l, p]] = logged
    equal(l, '%s patched in %sms')
    equal(p, 'node_modules/@idio/preact-fixture/src/index.js')
  },
}

export default T