import { Component } from 'preact'

export default class Example extends Component {
  render({ test }) {
    return (<div id={test}>
      Hello World
    </div>)
  }
}

export const Example2 = () => {
  return (<span>Open Source!</span>)
}