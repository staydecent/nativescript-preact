const {
  render,
  h,
  useState,
  useEffect
} = require('./preact-render-to-nativescript')

const application = require('tns-core-modules/application')

function Demo () {
  const [input, setInput] = useState('Finish NativeScript Preact example!')
  const handleInput = ev => setInput(ev.value)
  
  useEffect(() => {
    setTimeout(() => setInput('Changed!'), 2500)
  }, [])

  return h('Page', null, [
    h('StackLayout', null, [
      h('TextField', {
        text: input,
        onInput: handleInput
      }),
      h('Label', null, [input])
    ])
  ])
}

application.run({
  create: function () {
    return render(Demo)
  }
})
