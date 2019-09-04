import makeTestSuite from '@zoroaster/mask'
import rqt from 'rqt'
import Context from '../context'
import TempContext from 'temp-context'
import frontend from '../../src'

export default makeTestSuite('test/result/default', {
  /**
   * @param {Context} context
   */
  async getResults({ start, directory }) {
    const { url } = await start({
      _frontend: {
        use: true,
        middlewareConstructor(app, config) {
          return frontend(config)
        },
        config: { directory },
      },
    })
    const res = await rqt(`${url}/${directory}/${this.input}`)
    return res
  },
  context: Context,
})

export const modules = makeTestSuite('test/result/modules', {
  /**
   * @param {Context} context
   * @param {TempContext} t
   */
  async getResults({ start }, { write, TEMP }) {
    const file = await write('test.jsx', this.input)
    const { url } = await start({
      _frontend: {
        use: true,
        middlewareConstructor(app, config) {
          return frontend(config)
        },
        config: { directory: TEMP },
      },
    })
    const res = await rqt(`${url}/${file}`)
    return res
  },
  context: [Context, TempContext],
})

export const node_modules = makeTestSuite('test/result/node_modules', {
  /**
   * @param {Context} context
   */
  async getResults({ start, directory }) {
    const { url } = await start({
      _frontend: {
        use: true,
        middlewareConstructor(app, config) {
          return frontend(config)
        },
        config: { directory },
      },
    })
    const res = await rqt(`${url}/${this.input}`)
    return res
  },
  context: Context,
  splitRe: /^\/\/\/ /mg,
})