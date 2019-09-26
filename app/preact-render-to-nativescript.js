require('./unwindow')

const undom = require('./undom')

const check = require('check-arg-types')

const { Component, h, render: mount } = require('preact')
const { useState, useEffect } = require('preact/hooks')

// UI Modules
const animation = require('tns-core-modules/ui/animation')
const formattedString = require('tns-core-modules/text/formatted-string')
const frame = require('tns-core-modules/ui/frame')
const page = require('tns-core-modules/ui/page')

// Layouts
const absoluteLayout = require('tns-core-modules/ui/layouts/absolute-layout')
const dockLayout = require('tns-core-modules/ui/layouts/dock-layout')
const flexboxLayout = require('tns-core-modules/ui/layouts/flexbox-layout')
const gridLayout = require('tns-core-modules/ui/layouts/grid-layout')
const layoutBase = require('tns-core-modules/ui/layouts/layout-base')
const stackLayout = require('tns-core-modules/ui/layouts/stack-layout')
const wrapLayout = require('tns-core-modules/ui/layouts/wrap-layout')

// Widgets

const activityIndicator = require('tns-core-modules/ui/activity-indicator')
const button = require('tns-core-modules/ui/button')
const datePicker = require('tns-core-modules/ui/date-picker')
const dialogs = require('tns-core-modules/ui/dialogs')
const editableTextBase = require('tns-core-modules/ui/editable-text-base')
const htmlView = require('tns-core-modules/ui/html-view')
const image = require('tns-core-modules/ui/image')
const label = require('tns-core-modules/ui/label')
const listPicker = require('tns-core-modules/ui/list-picker')
const listView = require('tns-core-modules/ui/list-view')
const placeholder = require('tns-core-modules/ui/placeholder')
const progress = require('tns-core-modules/ui/progress')
const scrollView = require('tns-core-modules/ui/scroll-view')
const searchBar = require('tns-core-modules/ui/search-bar')
const slider = require('tns-core-modules/ui/slider')
const switchNS = require('tns-core-modules/ui/switch')
const tabView = require('tns-core-modules/ui/tab-view')
const textField = require('tns-core-modules/ui/text-field')
const textView = require('tns-core-modules/ui/text-view')
const timePicker = require('tns-core-modules/ui/time-picker')
const webView = require('tns-core-modules/ui/web-view')

const modules = {
  animation,
  formattedString,
  frame,
  page,
  absoluteLayout,
  dockLayout,
  flexboxLayout,
  gridLayout,
  layoutBase,
  stackLayout,
  wrapLayout,
  activityIndicator,
  button,
  datePicker,
  dialogs,
  editableTextBase,
  htmlView,
  image,
  label,
  listPicker,
  listView,
  placeholder,
  progress,
  scrollView,
  searchBar,
  slider,
  switchNS,
  tabView,
  textField,
  textView,
  timePicker,
  webView
}

const toType = check.prototype.toType

const PREACT_WIDGET_REF = '__preact_widget_ref__'

// NS Widgets
const widgets = [
  'AbsoluteLayout',
  'ActionBar',
  'ActionItem',
  'ActivityIndicator',
  'Button',
  'ContainerView',
  'ContentView',
  'CustomLayoutView',
  'DatePicker',
  'DockLayout',
  'EditableTextBase',
  'FlexboxLayout',
  'FormattedString',
  'Frame',
  'GridLayout',
  'HtmlView',
  'Image',
  'Label',
  'LayoutBase',
  'ListPicker',
  'ListView',
  'NavigationButton',
  'Observable',
  'Page',
  'Placeholder',
  'Progress',
  'Repeater',
  'ScrollView',
  'SearchBar',
  'SegmentedBar',
  'SegmentedBarItem',
  'Slider',
  'Span',
  'StackLayout',
  'Switch',
  'TabView',
  'TabViewItem',
  'TextBase',
  'TextField',
  'TextView',
  'TimePicker',
  'View',
  'ViewBase',
  'WebView',
  'WrapLayout'
]

// nodeName => module
// Ex. TEXTVIEW => 'textView'
const modMap = Object.fromEntries(widgets.map(w => [w.toUpperCase(), w[0].toLowerCase() + w.slice(1)]))

// nodeName => class
// Ex. TEXTVIEW => 'TextView'
const classMap = Object.fromEntries(widgets.map(w => [w.toUpperCase(), w]))

// handler mappings
const handlerMap = {
  input: 'textChange',
  press: 'tap',
  click: 'tap'
}

// Map NativeScript components to createElement calls
const makeComponent = componentName => {
  function ComponentWrapper ({ children, ...props }) {
    return h(componentName, props, children)
  }
  ComponentWrapper.displayName = componentName
  return ComponentWrapper
}
let components = {}
Object.values(classMap).map(componentName => {
  components[componentName] = makeComponent(componentName)
})

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
const getAttr = (attributes, name = 'value') => {
  for (let x = 0; x < attributes.length; x++) {
    if (attributes[x].name && attributes[x].name === name) {
      return attributes[x].value
    }
  }
}

const build = (parentNode, target) => {
  const widget = parentNode[PREACT_WIDGET_REF]

  // textContent
  if (!widget && parentNode.nodeType === 3 && target) {
    console.log('textContent', target.nodeName, target.childNodes[0].data)
    return build(target)
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

  // Label / Button
  if (widget instanceof label.Label || widget instanceof button.Button) {
    console.log('build Label/Button')
    widget.text = parentNode.childNodes && parentNode.childNodes.length
      ? parentNode.childNodes[0].data
      : getAttr(parentNode.attributes, 'text')
  }

  // Sync Element attributes on NativeScript widget
  const attrs = parentNode.attributes
  const attrsLen = attrs.length
  for (let x = 0; x < attrsLen; x++) {
    const attr = attrs[x]
    widget[attr.name] = attr.value
  }

  // Bind any found handlers
  const eventNames = Object.keys(parentNode.__handlers || {})
  if (eventNames.length) {
    const len = eventNames.length
    for (let x = 0; x < len; x++) {
      const name = eventNames[x]
      widget.on(handlerMap[eventNames[x]] || eventNames[x], function (ev) {
        ev.type = name[0].toUpperCase() + name.slice(1)
        parentNode.__handlers[name][0](ev)
      })
    }
  }

  return widget
}

const destroy = (parentNode) => {
}

const update = (target, attributeName) => {
  const widget = target[PREACT_WIDGET_REF]

  const newVal = getAttr(target.attributes.slice(0), attributeName)
  console.log('update', target.localName, { attributeName, newVal })
  widget[attributeName] = newVal

  if (attributeName === 'value') {
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
function render (Component) {
  mount(h(Component), document.body)
  // The first child of body is our top-level component; we can just
  // return it's NativeScript counterpart/reference.
  return document.body.childNodes[0][PREACT_WIDGET_REF]
}

module.exports = {
  render,
  Component,
  h,
  useState,
  useEffect,
  ...components
}
