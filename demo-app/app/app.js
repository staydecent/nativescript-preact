const {
  h,
  render,
  useState,
  useEffect,
  ActionBar,
  Button,
  Page,
  StackLayout,
  FlexboxLayout,
  TextField,
  Label
} = require('../../src/nativescript-preact')

const application = require('tns-core-modules/application')

const { SubPage } = require('./sub/page')

function Demo () {
  const [input, setInput] = useState('Finish NativeScript Preact example!')
  const handleInput = ev => setInput(ev.value)
  const handleNavigation = () => render(SubPage)

  useEffect(() => {
    setTimeout(() => setInput('Changed!'), 2500)
  }, [])

  return (
    <Page>
      <ActionBar title='Demo App' />
      <StackLayout>
        <TextField text={input} onInput={handleInput} />
        {input !== 'Changed!' && <Label class='my-label'>{input}</Label>}
        <Button
          bogusProps='cool'
          style='background-color: pink;'
          onPress={handleNavigation}
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
