import { render } from 'preact'
import Component from './Component'
// linked node_modules are also resolved
import Form, { Input } from '@depack/form'

render(<Component test="Welcome"/>, document.body)
render(<Form>
  <Input placeholder="hello world"/>
</Form>, document.body)