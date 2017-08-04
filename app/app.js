var Preact = require('preact')
var classless = require('classless-component')

var applicationModule = require('application')

var render = require('./preact-render-to-nativescript')

var h = Preact.h
var comp = classless.compose(Preact.Component, h)
var withState = classless.withState

var Demo = comp(
  withState('input', 'setInput', 'Finish NativeScript Preact example!'),
  {
    onLoaded: function () {
      console.log('onLoaded')
    },
    componentDidMount: function () {
      var setInput = this.state.setInput
      setTimeout(function () {
        setInput('vertical')
      }, 2500)
    },
    render: function (props) {
      console.log('Demo', props.input)
      return h('Page', null, [
        h('StackLayout', null, [
          h('TextField', {}, props.input)
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
