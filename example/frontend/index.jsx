import { render } from 'preact'
import Component from './Component'
// linked node_modules are also resolved
import Form, { Input } from '@depack/form'

const component = <Component test="Welcome"/>
const form = (<Form>
  <Input placeholder="hello world"/>
</Form>)

const c = render(component, document.body)
const f = render(form, document.body)

/* IDIO HOT RELOAD */
window['idioAddHotReload'] && window['idioAddHotReload'](() => {
  render(component, document.body, c)
  render(form, document.body, f)
})