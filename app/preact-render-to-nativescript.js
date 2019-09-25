const { h, render: mount } = require('preact')
const check = require('check-arg-types')

const contentView = require('tns-core-modules/ui/content-view')
const label = require('tns-core-modules/ui/label')
const textBase = require('tns-core-modules/ui/text-base')
const editableTextBase = require('tns-core-modules/ui/editable-text-base')
const textField = require('tns-core-modules/ui/text-field')
const layoutBase = require('tns-core-modules/ui/layouts/layout-base')
const stackLayout = require('tns-core-modules/ui/layouts/stack-layout')
const page = require('tns-core-modules/ui/page')

const undom = require('./undom')

const modules = {
  contentView,
  label,
  textBase,
  editableTextBase,
  textField,
  layoutBase,
  stackLayout,
  page
}

const toType = check.prototype.toType

const PREACT_WIDGET_REF = '__preact_widget_ref__'

// nodeName => module mapping
const modMap = {
  TEXTVIEW: 'textView',
  TEXTFIELD: 'textField',
  STACKLAYOUT: 'stackLayout'
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
  const module = modules[modName]
  const className = classMap[el.nodeName]
  !module && console.log({ modName, className })

  const widget = new module[className]()
  const attrs = el.attributes
  const attrKeys = Object.keys(attrs)
  for (let x = 0; x < attrKeys.length; x++) {
    const k = attrKeys[x]
    const v = attrs[k]
    widget[k] = v
  }
  el[PREACT_WIDGET_REF] = widget
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

// Safely get value or undefined without exception
const getValue = (attributes, name = 'value') => {
  for (let x = 0; x < attributes.length; x++) {
    if (attributes[x].name && attributes[x].name === name) {
      return attributes[x][name]
    }
  }
}

const build = (parentNode, target) => {
  const widget = parentNode[PREACT_WIDGET_REF]

  // textContent
  if (!widget && parentNode.nodeType === 3 && target) {
    console.log('textContent', target.nodeName, target.childNodes[0].data)
    build(target)
  }

  // Label
  if (widget instanceof label.Label) {
    console.log('build Label')
    widget.text = parentNode.childNodes[0].data
    return widget
  }

  // Build Page
  if (widget instanceof page.Page) {
    console.log('build Page')
    const childWidget = build(parentNode.childNodes[0])
    widget.content = childWidget
  }

  // Build Layouts
  if (widget instanceof layoutBase.LayoutBase) {
    console.log('build Layout')
    for (let x = 0; x < parentNode.childNodes.length; x++) {
      const childWidget = build(parentNode.childNodes[x])
      widget.addChild(childWidget)
    }
  }

  // Build Text
  if (widget instanceof textBase.TextBase) {
    const val = getValue(parentNode.attributes) || parentNode.value
    console.log('build TextBase', { val })
    widget.text = val
    if (parentNode.__handlers && parentNode.__handlers.input) {
      widget.on('textChange', function (ev) {
        ev.type = 'Input'
        parentNode.__handlers.input[0](ev)
      })
    }
  }

  return widget
}

const destroy = (parentNode) => {
}

const update = (target, attributeName) => {
  const widget = target[PREACT_WIDGET_REF]

  if (widget instanceof textBase.TextBase) {
    const newVal = getValue(target.attributes, attributeName)
    widget.text = newVal
  }
}

// Observe (un)DOM changes
const MutationObserver = document.defaultView.MutationObserver
const observer = new MutationObserver(function (mutations) {
  mutations.forEach((mutation) => {
    const { addedNodes, removedNodes, type, target } = mutation

    if (type === 'attributes') {
      console.log('mutation#attributes', target.localName, mutation.attributeName)
      update(target, mutation.attributeName)
    }

    if (addedNodes && addedNodes.length) {
      build(addedNodes[0], target)
    }

    if (removedNodes && removedNodes.length) {
      destroy(removedNodes[0])
    }
  })
})

observer.observe(document.body, {
  attributes: true,
  characterData: true, // needed
  childList: true, // children, includes text
  subtree: true // descendants
})

// preact-render-to-nativescript
module.exports = function render (Component) {
  mount(h(Component), document.body)
  // The first child of body is our top-level component; we can just
  // return it's NativeScript counterpart/reference.
  return document.body.childNodes[0][PREACT_WIDGET_REF]
}
