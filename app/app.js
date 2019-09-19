const Preact = require('preact')
const application = require('tns-core-modules/application')

const render = require('./preact-render-to-nativescript')

const h = Preact.h

class Demo extends Preact.Component {
  constructor (props) {
    super(props)
    this.state = {
      input: 'Finish NativeScript Preact example!'
    }
    this.onLoaded = this.onLoaded.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  onLoaded () {
    console.log('onLoaded')
  }

  handleInput (ev) {
    this.setState({ input: ev.value })
  }

  componentDidMount () {
    setTimeout(() => this.setState({ input: 'vertical' }), 2500)
  }

  render () {
    return h('Page', null, [
      h('StackLayout', null, [
        h('TextField', {
          value: this.state.input,
          onInput: this.handleInput
        }),
        h('Label', null, [this.state.input])
      ])
    ])
  }
}

application.run({
  create: function () {
    return render(Demo)
  }
})
