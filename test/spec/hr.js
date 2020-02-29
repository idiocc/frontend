import { deepEqual } from '@zoroaster/assert'
import Zoroaster from 'zoroaster'
import rqt, { aqt } from 'rqt'
import Context from '../context'
import { HR, getClasses, getAssignments } from '../../src/lib/hr'

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
  'gets assignments'() {
    const cl = getAssignments(`
export const test = () => { 'test' }
export let i = () => { 'i' }
`)
    deepEqual(cl, {
      test: 'test',
      i: 'i',
    })
  },
}

/** @type {Object.<string, (c: Context, z: Zoroaster)>} */
export const hotReload = {
  context: [class {}, Zoroaster],
  'makes hr'(_, { snapshotExtension }) {
    snapshotExtension('js')
    const f = `
export default class Test {
  constructor() {}
}
export class C {}
export const t = () => {}
export let i = () => {}
`
    const cl = getClasses(f)
    const as = getAssignments(f)
    const res = HR('test/Component.jsx', cl, as)
    return res
  },
}

export default T