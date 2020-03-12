import { render } from 'preact'
import Component from './Component'
// linked node_modules are also resolved
import Form, { Input } from '@depack/form'

const component = <Component test="Welcome"/>
const form = (<Form>
  <Input placeholder="hello world"/>
</Form>)

let c = render(component, window['app'])
let f = render(form, document.body)

/* IDIO HOT RELOAD */
import addHotReload from '@idio/hot-reload'
addHotReload(() => {
  c = render(component, document.body, c)
  f = render(form, document.body, f)
})