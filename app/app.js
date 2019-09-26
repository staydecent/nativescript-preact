const {
  render,
  h,
  useState,
  useEffect,
  Page,
  StackLayout,
  TextField,
  Label
} = require('./preact-render-to-nativescript')

const application = require('tns-core-modules/application')

function Demo () {
  const [input, setInput] = useState('Finish NativeScript Preact example!')
  const handleInput = ev => setInput(ev.value)
  
  useEffect(() => {
    setTimeout(() => setInput('Changed!'), 2500)
  }, [])

  return (
    <Page>
      <StackLayout>
        <TextField text={input} onInput={handleInput} />
        <Label>{input}</Label>
      </StackLayout>
    </Page>
  )
}

application.run({
  create: function () {
    return render(Demo)
  }
})
