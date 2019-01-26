import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import frontend from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof frontend, 'function')
  },
  async 'calls package without error'() {
    await frontend()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await frontend({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T