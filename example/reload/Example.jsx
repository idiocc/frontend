import { Component } from 'preact'

export default class Example extends Component {
  constructor() {
    super()
    this.example = this.example.bind(this)
  }
  example() {
    console.log('clicked')
  }
  render({ test }) {
    return (<div id={test} onClick={this.example}>
      Hello World
    </div>)
  }
}

export const Example2 = () => {
  return (<span>Open Source!</span>)
}