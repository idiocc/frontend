import { deepEqual } from '@zoroaster/assert'
import Zoroaster from 'zoroaster'
import rqt, { aqt } from 'rqt'
import Context from '../context'
import { HR, getClasses, getAssignments } from '../../src/lib/hr'

/** @type {Object.<string, (c: Context, z: Zoroaster)>} */
const T = {
  'gets classes'() {
    const { classes } = getClasses(`
export default class Test {
  constructor() {}
}
export class C {}
`)
    deepEqual(classes, {
      default: 'Test',
      C: 'C',
    })
  },
  'gets classes with defered default export'() {
    const { classes } = getClasses(`class Test {}
export default Test
`)
    deepEqual(classes, {
      default: 'Test',
    })
  },
  'gets classes with defered named export'() {
    const { classes } = getClasses(`class Test {}
export { Test }
`)
    deepEqual(classes, {
      Test: 'Test',
    })
  },
  'gets assignments'() {
    const ass = getAssignments(`
export const test = () => { 'test' }
export let i = () => { 'i' }
`)
    deepEqual(ass, {
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
    const { classes } = getClasses(f)
    const as = getAssignments(f)
    const res = HR('test/Component.jsx', classes, as)
    return res
  },
}

export default T