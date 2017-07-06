var Preact = require('preact')
var classless = require('classless-component')

var applicationModule = require('application')

var render = require('./preact-render-to-nativescript')

var h = Preact.h
var comp = classless.compose(Preact.Component, h)
var withState = classless.withState

var Child = comp(
  withState('items', 'setItems', [1, 2, 3]),
  {
    componentDidMount: function () {
      var setItems = this.state.setItems
      setTimeout(function () {
        setItems([1, 2, 3, 4, 5])
      }, 550)
    },
    render: function (props) {
      console.log('setItems', props.items)
      return h('StackLayout', null, props.items.map(
        (el) => h('TextView', {key: 'key-' + el}, el)))
    }
  }
)

var Demo = comp(
  withState('orientation', 'setOrientation', 'horizontal'),
  {
    onLoaded: function () {
      console.log('onLoaded')
    },
    componentDidMount: function () {
      var setOrientation = this.state.setOrientation
      setTimeout(function () {
        console.log('go vertical')
        setOrientation('vertical')
      }, 250)
    },
    componentDidUpdate () {
      console.log('_updateLayout?')
    },
    render: function (props) {
      console.log('Demo', props.orientation)
      return h('Page', {loaded: props.onLoaded}, [
        h('StackLayout', {orientation: props.orientation}, [
          h(Child),
          h('TextView', {}, props.orientation)
        ])
      ])
    }
  }
)

applicationModule.start({
  create: function () {
    return render(Demo)
  }
})
