const Preact = require('preact')
const undom = require('./undom')
const check = require('check-arg-types')

const contentViewModule = require('ui/content-view')
const textBaseModule = require('ui/text-base')
const layoutBaseModule = require('ui/layouts/layout-base')

const h = Preact.h
const toType = check.prototype.toType

const document = undom()
global.document = document
global.document.createElement = document.createElement

const references = []
const MutationObserver = document.defaultView.MutationObserver
const observer = new MutationObserver(function (mutations) {
  const vnode = serializeJson(mutations[0].addedNodes[0])
  console.log('mutations', JSON.stringify(vnode))
  references.forEach((ref) => {
    const name = ref[0].nodeName
    if (name === vnode.nodeName) {
      console.log('ref', name, ref[1])
      ref[1]._setupUI()
    }
  })
})
observer.observe(document.body)

const modMap = {
  textview: 'text-view',
  stacklayout: 'layouts/stack-layout'
}

const classMap = {
  page: 'Page',
  label: 'Label',
  textview: 'TextView',
  stacklayout: 'StackLayout'
}

module.exports = function render (Component) {
  Preact.render(h(Component), document.body)
  const tree = serializeJson(document.body)
  return wrapper(tree.children[0])
}

function serializeJson (el) {
  if (el.nodeType === 3) return el.nodeValue
  const attributes = {}
  const a = el.attributes
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

  const type = toType(vnode)
  let widget

  if (type === 'object') {
    const modName = modMap[vnode.nodeName] || vnode.nodeName
    const module = require('tns-core-modules/ui/' + modName)
    const className = classMap[vnode.nodeName]
    widget = new module[className]()
    const attrs = vnode.attributes
    const attrKeys = Object.keys(attrs)
    for (let x = 0; x < attrKeys.length; x++) {
      const k = attrKeys[x]
      const v = attrs[k]
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
        for (let y = 0; y < vnode.children.length; y++) {
          widget.addChild(vnode.children[y])
        }
      }
    }
    references.push([vnode, widget])
  } else if (type === 'string') {
    widget = vnode
  }

  return widget
}
