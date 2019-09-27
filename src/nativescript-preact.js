require('./unwindow')

const undom = require('./undom')

const check = require('check-arg-types')

const { Component, h, render: mount } = require('preact')
const hooks = require('preact/hooks')

const PREACT_WIDGET_REF = '__preact_widget_ref__'
const toType = check.prototype.toType

const modules = {
  // UI Modules
  animation: () => require('tns-core-modules/ui/animation'),
  formattedString: () => require('tns-core-modules/text/formatted-string'),
  frame: () => require('tns-core-modules/ui/frame'),
  page: () => require('tns-core-modules/ui/page'),

  // Layouts
  absoluteLayout: () => require('tns-core-modules/ui/layouts/absolute-layout'),
  dockLayout: () => require('tns-core-modules/ui/layouts/dock-layout'),
  flexboxLayout: () => require('tns-core-modules/ui/layouts/flexbox-layout'),
  gridLayout: () => require('tns-core-modules/ui/layouts/grid-layout'),
  layoutBase: () => require('tns-core-modules/ui/layouts/layout-base'),
  stackLayout: () => require('tns-core-modules/ui/layouts/stack-layout'),
  wrapLayout: () => require('tns-core-modules/ui/layouts/wrap-layout'),

  // Widgets
  activityIndicator: () => require('tns-core-modules/ui/activity-indicator'),
  button: () => require('tns-core-modules/ui/button'),
  datePicker: () => require('tns-core-modules/ui/date-picker'),
  dialogs: () => require('tns-core-modules/ui/dialogs'),
  editableTextBase: () => require('tns-core-modules/ui/editable-text-base'),
  htmlView: () => require('tns-core-modules/ui/html-view'),
  image: () => require('tns-core-modules/ui/image'),
  label: () => require('tns-core-modules/ui/label'),
  listPicker: () => require('tns-core-modules/ui/list-picker'),
  listView: () => require('tns-core-modules/ui/list-view'),
  placeholder: () => require('tns-core-modules/ui/placeholder'),
  progress: () => require('tns-core-modules/ui/progress'),
  scrollView: () => require('tns-core-modules/ui/scroll-view'),
  searchBar: () => require('tns-core-modules/ui/search-bar'),
  slider: () => require('tns-core-modules/ui/slider'),
  switchNS: () => require('tns-core-modules/ui/switch'),
  tabView: () => require('tns-core-modules/ui/tab-view'),
  textField: () => require('tns-core-modules/ui/text-field'),
  textView: () => require('tns-core-modules/ui/text-view'),
  timePicker: () => require('tns-core-modules/ui/time-picker'),
  webView: () => require('tns-core-modules/ui/web-view')
}

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
  const module = modules[modName]()
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
    return build(target)
  }

  // Build Page
  if (widget instanceof modules.page().Page) {
    const childWidget = build(parentNode.childNodes[0])
    widget.content = childWidget
  }

  // Build Layouts
  if (widget instanceof modules.layoutBase().LayoutBase) {
    for (let x = 0; x < parentNode.childNodes.length; x++) {
      const childWidget = build(parentNode.childNodes[x])
      widget.addChild(childWidget)
    }
  }

  // Label / Button
  if (widget instanceof modules.label().Label || widget instanceof modules.button().Button) {
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

const destroy = (parentNode, nodes) => {
  const parentWidget = parentNode.__preact_widget_ref__
  const len = nodes.length
  for (let x = 0; x < len; x++) {
    const node = nodes[x]
    parentWidget._removeView(node.__preact_widget_ref__)
  }
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
  const len = mutations.length
  for (let x = 0; x < len; x++) {
    const mutation = mutations[x]
    const { addedNodes, removedNodes, type, target } = mutation

    if (type === 'attributes') {
      update(target, mutation.attributeName)
    }

    if (addedNodes && addedNodes.length) {
      build(addedNodes[0], target)
    }

    if (removedNodes && removedNodes.length) {
      destroy(target, removedNodes)
    }
  }
})

observer.observe(document.body, {
  attributes: true,
  characterData: true, // needed
  childList: true, // children, includes text
  subtree: true // descendants
})

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
  ...hooks,
  ...components
}
