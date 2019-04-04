import makeTestSuite from '@zoroaster/mask'
import rqt from 'rqt'
import Context from '../context'
import frontend from '../../src'
import { splitFrom } from '../../src/lib'

const ts = makeTestSuite('test/result/index', {
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

export const node_modules = makeTestSuite('test/result/node_modules', {
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

export const split = makeTestSuite('test/result/split.json', {
  getResults: splitFrom,
  jsonProps: ['expected'],
})

export default ts
