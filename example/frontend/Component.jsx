import { Component } from 'preact'
import './style.css'

export default class Example extends Component {
  constructor() {
    super()
    this.state = {
      count: 0,
    }
  }
  render({ test }) {
    const { count } = this.state
    return (<div onClick={() => {
      this.setState({ count: count + 1 })
    }}>{test} + updated + {count}</div>)
  }
}