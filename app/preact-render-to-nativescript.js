require('./unwindow')

const undom = require('./undom')

const check = require('check-arg-types')

const { Component, h, render: mount } = require('preact')
const { useState, useEffect } = require('preact/hooks')

const contentView = require('tns-core-modules/ui/content-view')
const editableTextBase = require('tns-core-modules/ui/editable-text-base')
const label = require('tns-core-modules/ui/label')
const layoutBase = require('tns-core-modules/ui/layouts/layout-base')
const page = require('tns-core-modules/ui/page')
const stackLayout = require('tns-core-modules/ui/layouts/stack-layout')
const textBase = require('tns-core-modules/ui/text-base')
const textField = require('tns-core-modules/ui/text-field')

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

// NativeScript Component Names.
// Calling them widgets to distinguish from Preact Components.
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
const modMap = {
  TEXTVIEW: 'textView',
  TEXTFIELD: 'textField',
  STACKLAYOUT: 'stackLayout'
}

// nodeName => class
// Ex. TEXTVIEW => 'TextView'
const classMap = Object.fromEntries(widgets.map(w => [w.toUpperCase(), w]))

console.log({ classMap })

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
console.log(components)

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
    if (parentNode.__handlers && parentNode.__handlers.input) {
      console.log('build TextBase', parentNode.__handlers)
      widget.on('textChange', function (ev) {
        ev.type = 'Input'
        parentNode.__handlers.input[0](ev)
      })
    }
  }

  // Sync Element attributes on NativeScript widget
  const attrs = parentNode.attributes
  const attrsLen = attrs.length
  for (let x = 0; x < attrsLen; x++) {
    const attr = attrs[x]
    widget[attr.name] = attr.value
  }

  return widget
}

const destroy = (parentNode) => {
}

const update = (target, attributeName) => {
  const widget = target[PREACT_WIDGET_REF]

  if (widget instanceof textBase.TextBase) {
    const newVal = getAttr(target.attributes.slice(0), attributeName)
    console.log('update', target.localName, { newVal })
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
