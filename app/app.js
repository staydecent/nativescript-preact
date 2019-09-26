const {
  render,
  h,
  useState,
  useEffect,
  Button,
  Page,
  StackLayout,
  FlexboxLayout,
  TextField,
  Label
} = require('./preact-render-to-nativescript')

const application = require('tns-core-modules/application')
const dialogs = require('tns-core-modules/ui/dialogs')

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
        <Button
          bogusProps='cool'
          style='background-color: pink;'
          onPress={() => dialogs.alert('Alert').then(() => console.log('Dialog closed!'))}
        >
          Alert!
        </Button>
        <FlexboxLayout flexWrap='wrap' height='300' width='300' backgroundColor='lightgray'>
          <Label text='Label 1' width='100' height='50' backgroundColor='red' />
          <Label text='Label 2' width='100' height='50' backgroundColor='green' />
          <Label text='Label 3' width='100' height='50' backgroundColor='blue' />
          <Label text='Label 4' width='100' height='50' backgroundColor='yellow' />
        </FlexboxLayout>
      </StackLayout>
    </Page>
  )
}

application.run({
  create: function () {
    return render(Demo)
  }
})
