var Preact = require('preact')
var classless = require('classless-component')

var applicationModule = require('application')

var render = require('./preact-render-to-nativescript')

var h = Preact.h
var comp = classless.compose(Preact.Component, h)
var withState = classless.withState

var Child = comp({
  componentDidMount: function () {
    console.log('Child!')
  },
  render: function () {
    console.log('render Child')
    return h('Label', {}, 'This is a label!')
  }
})

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
      console.log('Demo', Object.keys(props))
      return h('Page', {loaded: props.onLoaded}, [
        h('StackLayout', {orientation: props.orientation}, [
          h(Child),
          h('TextView', {}, 'This is some text!')
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
