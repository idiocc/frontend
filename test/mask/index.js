import { makeTestSuite } from 'zoroaster'
import Context from '../context'
import frontend from '../../src'

const ts = makeTestSuite('test/result', {
  async getResults(input) {
    const res = await frontend({
      text: input,
    })
    return res
  },
  context: Context,
})

// export default ts
