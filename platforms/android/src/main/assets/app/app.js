var Preact = require('preact')
var pagesModule = require('tns-core-modules/ui/page')
var applicationModule = require('application')

var h = Preact.h

var wrapper = function (Component) {
  var vnode = Component()
  var module = require('tns-core-modules/ui/' + vnode.nodeName.toLowerCase())
  var widget = new module[vnode.nodeName]()
  var attrs = vnode.attributes
  var attrKeys = Object.keys(attrs)
  for (var x = 0; x < attrKeys.length; x++) {
    var k = attrKeys[x]
    var v = attrs[k]
    widget[k] = v
  }
  return widget
}

var Label = function () {
  return h('Label', {text: 'Hello, world!'})
}

applicationModule.start({
  create: function () {
    var page = new pagesModule.Page()
    page.content = wrapper(Label)
    return page
  }
})
