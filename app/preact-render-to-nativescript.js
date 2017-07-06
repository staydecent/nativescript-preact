const Preact = require('preact')
const undom = require('./undom')
const check = require('check-arg-types')

const contentViewModule = require('ui/content-view')
const textBaseModule = require('ui/text-base')
const layoutBaseModule = require('ui/layouts/layout-base')

const h = Preact.h
const toType = check.prototype.toType

const PREACT_WIDGET_REF = '__preact_widget_ref__'

// nodeName => module mapping
const modMap = {
  TEXTVIEW: 'text-view',
  STACKLAYOUT: 'layouts/stack-layout'
}

// nodeName => class mapping
const classMap = {
  PAGE: 'Page',
  LABEL: 'Label',
  TEXTVIEW: 'TextView',
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

// Observe (un)DOM changes
const MutationObserver = document.defaultView.MutationObserver
const observer = new MutationObserver(function (mutations) {
  mutations.forEach((mutation) => {
    console.log('mutations', Object.keys(mutation))
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
