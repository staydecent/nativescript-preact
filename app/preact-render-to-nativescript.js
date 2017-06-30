var Preact = require('preact')
var undom = require('undom')
var check = require('check-arg-types')

var contentViewModule = require('ui/content-view')
var textBaseModule = require('ui/text-base')
var layoutBaseModule = require('ui/layouts/layout-base')

var h = Preact.h
var toType = check.prototype.toType

var document = undom()
var createElementCopy = document.createElement
global.document = document
global.document.createElement = function (tagName, opts) {
  console.log('createElement', tagName, opts)
  return createElementCopy(tagName, opts)
}

var modMap = {
  textview: 'text-view',
  stacklayout: 'layouts/stack-layout'
}

var classMap = {
  page: 'Page',
  label: 'Label',
  textview: 'TextView',
  stacklayout: 'StackLayout'
}

module.exports = function (Component) {
  Preact.render(h(Component), document.body)
  var tree = serializeJson(document.body)
  return wrapper(tree.children[0])
}

function serializeJson (el) {
  if (el.nodeType === 3) return el.nodeValue
  var attributes = {}
  var a = el.attributes
  if (el.className) attributes.class = el.className
  for (let i = 0; i < a.length; i++) attributes[a[i].name] = a[i].value
  return {
    nodeName: String(el.nodeName).toLowerCase(),
    attributes: attributes,
    children: el.childNodes.map(serializeJson)
  }
}

function wrapper (vnode) {
  console.log('wrapper', JSON.stringify(vnode))

  var type = toType(vnode)
  var widget

  if (type === 'object') {
    var modName = modMap[vnode.nodeName] || vnode.nodeName
    var module = require('tns-core-modules/ui/' + modName)
    var className = classMap[vnode.nodeName]
    widget = new module[className]()
    var attrs = vnode.attributes
    var attrKeys = Object.keys(attrs)
    for (var x = 0; x < attrKeys.length; x++) {
      var k = attrKeys[x]
      var v = attrs[k]
      widget[k] = v
    }
    vnode.children = vnode.children.map(function (child) {
      return wrapper(child)
    })
    // If we have children, let's set them to the proper NativeScript
    // attribute for the class instance.
    if (vnode.children && vnode.children.length) {
      if (widget instanceof contentViewModule.ContentView) {
        if (vnode.children.length > 1) {
          console.warn('ContentView\'s can only have a single child element.', vnode.children)
        }
        widget.content = vnode.children[0]
      }
      if (widget instanceof textBaseModule.TextBase) {
        if (vnode.children.length > 1) {
          console.warn('TextBase\'s can only have a single child element.', vnode.children)
        }
        widget.text = vnode.children[0]
      }
      if (widget instanceof layoutBaseModule.LayoutBase) {
        for (var y = 0; y < vnode.children.length; y++) {
          widget.addChild(vnode.children[y])
        }
      }
    }
  } else if (type === 'string') {
    widget = vnode
  }

  return widget
}
