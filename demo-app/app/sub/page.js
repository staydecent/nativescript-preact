/** @jsx h */
const {
  h,
  ActionBar,
  Button,
  Page,
  ScrollView,
  StackLayout
} = require('../../../src/nativescript-preact')

export function SubPage () {
  // @see: https://docs.nativescript.org/core-concepts/navigation
  const handlePress = ({ object }) => object.page.frame.goBack()

  return (
    <Page>
      <ActionBar title='Sub Page' />
      <ScrollView>
        <StackLayout>
          <Button onPress={handlePress}>Go Back</Button>
        </StackLayout>
      </ScrollView>
    </Page>
  )
}
