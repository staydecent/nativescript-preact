const Preact = require('preact')
const undom = require('./undom')
const check = require('check-arg-types')

const contentViewModule = require('ui/content-view')
const textBaseModule = require('ui/text-base')
const editableTextBaseModule = require('ui/editable-text-base')
const layoutBaseModule = require('ui/layouts/layout-base')
const pageModule = require('ui/page')

const h = Preact.h
const toType = check.prototype.toType

const PREACT_WIDGET_REF = '__preact_widget_ref__'

// nodeName => module mapping
const modMap = {
  TEXTVIEW: 'text-view',
  TEXTFIELD: 'text-field',
  STACKLAYOUT: 'layouts/stack-layout'
}

// nodeName => class mapping
const classMap = {
  PAGE: 'Page',
  LABEL: 'Label',
  TEXTVIEW: 'TextView',
  TEXTFIELD: 'TextField',
  STACKLAYOUT: 'StackLayout'
}

// Create and attach NativeScript UI widget to Element
const attachWidget = (el) => {
  const type = toType(el)
  if (type === 'string') {
    return el
  }
  const modName = modMap[el.nodeName] || el.nodeName.toLowerCase()
  const module = require('tns-core-modules/ui/' + modName)
  const className = classMap[el.nodeName]
  const widget = new module[className]()
  const attrs = el.attributes
  const attrKeys = Object.keys(attrs)
  for (let x = 0; x < attrKeys.length; x++) {
    const k = attrKeys[x]
    const v = attrs[k]
    widget[k] = v
  }
  el[PREACT_WIDGET_REF] = widget
  console.log('widget', className, widget, Object.keys(el))
  return el
}

// Mock the DOM
const document = undom()
global.document = document
const superCreateElement = document.createElement
global.document.createElement = (type) => {
  const el = superCreateElement(type)
  return attachWidget(el)
}

const getValue = (attributes) => {
  for (let x = 0; x < attributes.length; x++) {
    if (attributes[x].name && attributes[x].name === 'value') {
      return attributes[x].value
    }
  }
}

const build = (parentNode, target) => {
  const widget = parentNode[PREACT_WIDGET_REF]

  // textContent
  if (!widget && parentNode.nodeType === 3 && target) {
    console.log('textContent', Object.keys(target), target.childNodes[0].nodeValue)
    build(target)
  }

  // Build Page
  if (widget instanceof pageModule.Page) {
    console.log('build Page')
    const childWidget = build(parentNode.childNodes[0])
    widget.content = childWidget
  }

  // Build Layouts
  if (widget instanceof layoutBaseModule.LayoutBase) {
    console.log('build Layout')
    for (let x = 0; x < parentNode.childNodes.length; x++) {
      const childWidget = build(parentNode.childNodes[x])
      widget.addChild(childWidget)
    }
  }

  // Build Text
  if (widget instanceof textBaseModule.TextBase) {
    const val = getValue(parentNode.attributes) || parentNode.childNodes[0].nodeValue
    widget.text = val
    if (parentNode.__handlers && parentNode.__handlers.input) {
      widget.on('textChange', function (ev) {
        console.log('textChange', Object.keys(ev))
        parentNode.__handlers.input[0]({type: 'input'})
      })
      // widget.on('textChange', parentNode.__handlers.input[0])
    }
  }

  return widget
}

const destroy = (parentNode) => {
}

// Observe (un)DOM changes
const MutationObserver = document.defaultView.MutationObserver
const observer = new MutationObserver(function (mutations) {
  mutations.forEach((mutation) => {
    const {addedNodes, removedNodes, target} = mutation
    console.log('mutation', Object.keys(mutation))

    if (addedNodes && addedNodes.length) {
      build(addedNodes[0], target)
    }

    if (removedNodes && removedNodes.length) {
      // console.log('removedNodes', removedNodes.length)
      destroy(removedNodes[0])
    }
  })
})
observer.observe(document.body, {
  attributes: true,
  characterData: true,  // needed
  childList: true,      // children, includes text
  subtree: true         // descendants
})

// preact-render-to-nativescript
module.exports = function render (Component) {
  Preact.render(h(Component), document.body)
  // The first child of body is our top-level component; we can just
  // return it's NativeScript counterpart/reference.
  return document.body.childNodes[0][PREACT_WIDGET_REF]
}
