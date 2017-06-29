/* globals describe it */

// Preact
import {Component, h} from 'preact'
import render from 'preact-render-to-string'

// React
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'

// Inferno
import InfernoComponent from 'inferno-component'
import infernoCreateElement from 'inferno-create-element'
import InfernoServer from 'inferno-server'

// Our library!
import {compose, withState, mapProps, setNodeName} from './index'

// Assertion library
import chai from 'chai'
const expect = chai.expect

const objWithRender = (hyperscript) => ({
  render () {
    return hyperscript('div', null, 'Hello world')
  }
})

describe('compose', () => {
  it('Should be a function', () => {
    expect(compose).to.be.a('function')
  })

  it('Should create a Preact component', () => {
    const Test = compose(Component, h, objWithRender(h))
    const output = render(h(Test, {test: 56}))
    expect(output).to.equal('<div>Hello world</div>')
  })

  it('Should create a React component', () => {
    const Test = compose(React.Component, React.createElement, objWithRender(React.createElement))
    const renderer = ReactTestRenderer.create(React.createElement(Test, {}))
    const output = renderer.toJSON()
    expect(output.type).to.equal('div')
    expect(output.children[0]).to.equal('Hello world')
  })

  it('Should create an Inferno component', () => {
    const Test = compose(InfernoComponent, infernoCreateElement, objWithRender(infernoCreateElement))
    const output = InfernoServer.renderToString(infernoCreateElement(Test))
    expect(output).to.equal('<div>Hello world</div>')
  })

  it('Should pass state as props to PFC', () => {
    const Test = compose(Component, h,
      {state: {stateNum: 2}},
      function render ({stateNum, propNum}) {
        return h('div', null, 'Hello ' + (stateNum * propNum))
      }
    )
    const output = render(h(Test, {propNum: 4}))
    expect(output).to.equal('<div>Hello 8</div>')
  })

  it('Should pass arbitrary functions as props to PFC', () => {
    const Test = compose(Component, h,
      function someFunction () {
        return 8
      },
      function render ({someFunction}) {
        return h('div', null, 'Hello ' + someFunction())
      }
    )
    const output = render(h(Test))
    expect(output).to.equal('<div>Hello 8</div>')
  })
})

describe('withState', () => {
  it('Should set state prop and pass to render', () => {
    const Counter = compose(Component, h,
      withState('counter', 'setCounter', 0),
      function render ({counter, setCounter}) {
        setCounter(counter + 1)
        return h('div', null, [
          'Count: ' + counter,
          h('button', {onClick: () => setCounter(n => n + 1)}, 'Increment'),
          h('button', {onClick: () => setCounter(n => n - 1)}, 'Decrement')
        ])
      }
    )
    const output = render(h(Counter))
    expect(output).to.equal('<div>Count: 0<button>Increment</button><button>Decrement</button></div>')
  })

  it('Should pass props to initialValue function', () => {
    const Counter = compose(Component, h,
      withState('counter', 'setCounter', ({counter}) => counter * counter),
      function componentWillMount () {
        this.setState({counter: this.state.counter * this.state.counter})
      },
      function render ({counter, setCounter}) {
        return h('div', null, [
          'Count: ' + counter,
          h('button', {onClick: () => setCounter(n => n + 1)}, 'Increment'),
          h('button', {onClick: () => setCounter(n => n - 1)}, 'Decrement')
        ])
      }
    )
    const output = render(h(Counter, {counter: 2}))
    expect(output).to.equal('<div>Count: 16<button>Increment</button><button>Decrement</button></div>')
  })

  it('Should work with React', () => {
    const Counter = compose(React.Component, React.createElement,
      withState('counter', 'setCounter', ({counter}) => counter),
      function render ({counter, setCounter}) {
        return React.createElement('div', null, ['Count: ' + counter])
      }
    )
    const renderer = ReactTestRenderer.create(
      React.createElement(Counter, {counter: 5}))
    const output = renderer.toJSON()
    expect(output.type).to.equal('div')
    expect(output.children[0]).to.equal('Count: 5')
  })
})

describe('mapProps', () => {
  it('Should work with Preact', () => {
    const List = compose(Component, h,
      mapProps(({nums}) => ({nums: nums.map((n) => n + 1)})),
      function render ({nums}) {
        return h('div', null, [
          'List: ' + (nums && nums.join(', '))
        ])
      }
    )
    const output = render(h(List, {nums: [1, 2, 3, 4, 5]}))
    expect(output).to.equal('<div>List: 2, 3, 4, 5, 6</div>')
  })

  it('Should work with React', () => {
    const List = compose(React.Component, React.createElement,
      mapProps((props) => ({nums: props.nums ? props.nums.map((n) => n + 1) : []})),
      function render ({nums}) {
        return React.createElement('div', null, [
          'List: ' + (nums && nums.join(', '))
        ])
      }
    )
    const renderer = ReactTestRenderer.create(
      React.createElement(List, {nums: [1, 2, 3, 4, 5]}))
    const output = renderer.toJSON()
    expect(output.type).to.equal('div')
    expect(output.children[0]).to.equal('List: 2, 3, 4, 5, 6')
  })
})

describe('setNodeName', () => {
  it('Should set nodeName to not be "hoc"', () => {
    const List = compose(Component, h,
      setNodeName('CoolComponent'),
      function render () {
        return h('div', null, ['Cool!'])
      }
    )
    const comp = h(List, {nums: [1, 2, 3, 4, 5]})
    expect(comp.nodeName.name).to.equal('CoolComponent')
  })
})
