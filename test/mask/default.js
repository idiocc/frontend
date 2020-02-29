import makeTestSuite from '@zoroaster/mask'
import rqt, { aqt } from 'rqt'
import Context from '../context'
import TempContext from 'temp-context'
import { EOL } from 'os'
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
    const { body, statusCode, statusMessage } = await aqt(`${url}/${directory}/${this.input}`)
    if (statusCode != 200) {
      throw new Error(`GET ${this.input}: ${statusCode}\n${statusMessage}`)
    }
    return body
  },
  context: Context,
})

export const modules = makeTestSuite('test/result/modules', {
  /**
   * @param {Context} context
   * @param {TempContext} t
   */
  async getResults({ start }, { write, TEMP }) {
    const file = (await write('test.jsx', this.input))
      .replace(/\\/g, '/')
    const { url } = await start({
      _frontend: {
        use: true,
        middlewareConstructor() {
          return frontend({ directory: TEMP })
        },
      },
    })
    const URL = `${url}/${file}`
    const { body, statusCode, statusMessage } = await aqt(URL)
    if (statusCode != 200) {
      throw new Error(`GET ${URL}: ${statusCode}\n${statusMessage}`)
    }
    return body
      .replace(/\r?\n/g, EOL)
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
    const input = this.input.replace(/'(.+)'/, '$1')
    const res = await rqt(`${url}/${input}`)
    return res
      .replace(/\r?\n/g, EOL)
  },
  context: Context,
  splitRe: /^\/\/\/ /mg,
})