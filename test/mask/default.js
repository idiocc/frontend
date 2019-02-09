import { makeTestSuite } from 'zoroaster'
import rqt from 'rqt'
import Context from '../context'
import frontend from '../../src'

const ts = makeTestSuite('test/result/index.jsx', {
  /**
   * @param {string}
   * @param {Context} context
   */
  async getResults(input, { start, directory }) {
    const { url } = await start({
      _frontend: {
        use: true,
        middlewareConstructor(app, config) {
          return frontend(config)
        },
        config: { directory },
      },
    })
    const res = await rqt(`${url}/${directory}/${input}`)
    return res
  },
  context: Context,
})

export const node_modules = makeTestSuite('test/result/node_modules.jsx', {
  /**
   * @param {string}
   * @param {Context} context
   */
  async getResults(input, { start, directory }) {
    const { url } = await start({
      _frontend: {
        use: true,
        middlewareConstructor(app, config) {
          return frontend(config)
        },
        config: { directory },
      },
    })
    const res = await rqt(`${url}/${input}`)
    return res
  },
  context: Context,
  splitRe: /^\/\/\/ /mg,
})

export default ts
