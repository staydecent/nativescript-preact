var labelModule = require('tns-core-modules/ui/label')
var pagesModule = require('tns-core-modules/ui/page')

var factoryFunc = function () {
  var label = new labelModule.Label()
  label.text = 'Hello, world!'
  var page = new pagesModule.Page()
  page.content = label
  return page
}

exports.testPage = factoryFunc
