var undom = require('undom')

var Preact = require('preact')
var classless = require('classless-component')
var applicationModule = require('application')

var document = undom()
var createElementCopy = document.createElement
global.document = document
global.document.createElement = function (tagName, opts) {
  console.log('createElement', tagName, opts)
  return createElementCopy(tagName, opts)
}

var h = Preact.h
var comp = classless.compose(Preact.Component, h)

var Child = comp({
  componentDidMount: function () {
    console.log('Child!')
  },
  render: function () {
    console.log('render Child')
    return h('Label', {text: 'Hey there!'})
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
    return h('Page', {loaded: this.onLoaded}, [h(Child)])
  }
})

var classMap = {
  page: 'Page',
  label: 'Label'
}

var wrapper = function (vnode) {
  console.log('wrapper', JSON.stringify(vnode))
  var module = require('tns-core-modules/ui/' + vnode.nodeName)
  var className = classMap[vnode.nodeName]
  var widget = new module[className]()
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
  if (className === 'Page') {
    widget.content = vnode.children[0]
  }
  return widget
}

applicationModule.start({
  create: function () {
    Preact.render(h(Demo), document.body)
    var tree = serializeJson(document.body)
    return wrapper(tree.children[0])
  }
})

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
