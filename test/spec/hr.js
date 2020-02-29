import { deepEqual } from '@zoroaster/assert'
import Zoroaster from 'zoroaster'
import rqt, { aqt } from 'rqt'
import Context from '../context'
import { HR, getClasses } from '../../src/lib/hr'

/** @type {Object.<string, (c: Context, z: Zoroaster)>} */
const T = {
  'gets classes'() {
    const cl = getClasses(`
export default class Test {
  constructor() {}
}
export class C {}
`)
    deepEqual(cl, {
      default: 'Test',
      C: 'C',
    })
  },
}

/** @type {Object.<string, (c: Context, z: Zoroaster)>} */
export const hotReload = {
  context: [class {}, Zoroaster],
  'makes hr'(_, { snapshotExtension }) {
    snapshotExtension('js')
    const cl = getClasses(`
export default class Test {
  constructor() {}
}
export class C {}
`)
    const res = HR('test/Component.jsx', cl)
    return res
  },
}

export default T