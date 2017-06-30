var Preact = require('preact')
var classless = require('classless-component')

var applicationModule = require('application')

var render = require('./preact-render-to-nativescript')

var h = Preact.h
var comp = classless.compose(Preact.Component, h)

var Child = comp({
  componentDidMount: function () {
    console.log('Child!')
  },
  render: function () {
    console.log('render Child')
    return h('Label', {}, 'This is a label!')
  }
})

var Demo = comp({
  onLoaded: function () {
    console.log('onLoaded')
  },
  componentDidMount: function () {
    console.log('componentDidMount', this)
  },
  render: function () {
    return h('Page', {loaded: this.onLoaded}, [
      h('StackLayout', {orientation: 'vertical'}, [
        h(Child),
        h('TextView', {}, 'This is some text!')
      ])
    ])
  }
})

applicationModule.start({
  create: function () {
    return render(Demo)
  }
})
