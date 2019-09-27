function assign (obj, props) {
  for (var i in props) obj[i] = props[i]
}

function toLower (str) {
  return String(str).toLowerCase()
}

function splice (arr, item, add, byValueOnly) {
  var i = arr ? findWhere(arr, item, true, byValueOnly) : -1
  if (~i) add ? arr.splice(i, 0, add) : arr.splice(i, 1)
  return i
}

function findWhere (arr, fn, returnIndex, byValueOnly) {
  var i = arr.length
  while (i--) if (typeof fn === 'function' && !byValueOnly ? fn(arr[i]) : arr[i] === fn) break
  return returnIndex ? i : arr[i]
}

function createAttributeFilter (ns, name) {
  return function (o) { return o.ns === ns && toLower(o.name) === toLower(name) }
}

var resolved = typeof Promise !== 'undefined' && Promise.resolve()
var setImmediate = resolved ? function (f) { resolved.then(f) } : setTimeout

/*
const NODE_TYPES = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4,
  ENTITY_REFERENCE_NODE: 5,
  COMMENT_NODE: 6,
  PROCESSING_INSTRUCTION_NODE: 7,
  DOCUMENT_NODE: 9
};
*/

/** Create a minimally viable DOM Document
 *  @returns {Document} document
 */
function undom () {
  function isElement (node) {
    return node.nodeType === 1
  }

  var observers = []

  var pendingMutations = false

  var Node = function Node (nodeType, nodeName) {
    this.nodeType = nodeType
    this.nodeName = nodeName
    this.localName = nodeName
    this.childNodes = []
  }

  var prototypeAccessors = { nextSibling: {}, previousSibling: {}, firstChild: {}, lastChild: {} }
  prototypeAccessors.nextSibling.get = function () {
    var p = this.parentNode
    if (p) return p.childNodes[findWhere(p.childNodes, this, true) + 1]
  }
  prototypeAccessors.previousSibling.get = function () {
    var p = this.parentNode
    if (p) return p.childNodes[findWhere(p.childNodes, this, true) - 1]
  }
  prototypeAccessors.firstChild.get = function () {
    return this.childNodes[0]
  }
  prototypeAccessors.lastChild.get = function () {
    return this.childNodes[this.childNodes.length - 1]
  }
  Node.prototype.appendChild = function appendChild (child) {
    child.remove()
    child.parentNode = this
    this.childNodes.push(child)
    if (this.children && child.nodeType === 1) this.children.push(child)
    mutation(this, 'childList', { addedNodes: [child], previousSibling: this.childNodes[this.childNodes.length - 2] })
  }
  Node.prototype.insertBefore = function insertBefore (child, ref) {
    child.remove()
    var i = splice(this.childNodes, ref, child); var ref2
    if (!ref) {
      this.appendChild(child)
    } else {
      if (~i && child.nodeType === 1) {
        while (i < this.childNodes.length && (ref2 = this.childNodes[i]).nodeType !== 1 || ref === child) i++
        if (ref2) splice(this.children, ref, child)
      }
      mutation(this, 'childList', { addedNodes: [child], nextSibling: ref })
    }
  }
  Node.prototype.replaceChild = function replaceChild (child, ref) {
    if (ref.parentNode === this) {
      this.insertBefore(child, ref)
      ref.remove()
    }
  }
  Node.prototype.removeChild = function removeChild (child) {
    var i = splice(this.childNodes, child)
    if (child.nodeType === 1) splice(this.children, child)

    mutation(this, 'childList', {
      removedNodes: [child],
      previousSibling: this.childNodes[i - 1],
      nextSibling: this.childNodes[i]
    })
  }
  Node.prototype.remove = function remove () {
    if (this.parentNode) this.parentNode.removeChild(this)
  }

  Object.defineProperties(Node.prototype, prototypeAccessors)

  var Text = (function (Node) {
    function Text (text) {
      Node.call(this, 3, '#text') // TEXT_NODE
      this.nodeValue = text
      this.__defineGetter__('data', function () {
        return this.nodeValue
      })
      this.__defineSetter__('data', function (val) {
        this.nodeValue = val
        this.parentNode.setAttribute('value', val)
      })
    }

    if (Node) Text.__proto__ = Node
    Text.prototype = Object.create(Node && Node.prototype)
    Text.prototype.constructor = Text

    var prototypeAccessors$1 = { textContent: {} }
    prototypeAccessors$1.textContent.set = function (text) {
      this.nodeValue = text
      this.data = text
    }
    prototypeAccessors$1.textContent.get = function () {
      return this.nodeValue
    }

    Object.defineProperties(Text.prototype, prototypeAccessors$1)

    return Text
  }(Node))

  var Element = (function (Node) {
    function Element (nodeType, nodeName) {
      var this$1 = this

      Node.call(this, nodeType || 1, nodeName) // ELEMENT_NODE
      this.attributes = []
      this.__handlers = {}
      this.style = {}
      Object.defineProperty(this, 'class', {
        set: function (val) { this$1.setAttribute('className', val) },
        get: function () { return this$1.getAttribute('className') }
      })
      Object.defineProperty(this.style, 'cssText', {
        set: function (val) { this$1.setAttribute('style', val) },
        get: function () { return this$1.getAttribute('style') }
      })
    }

    if (Node) Element.__proto__ = Node
    Element.prototype = Object.create(Node && Node.prototype)
    Element.prototype.constructor = Element

    var prototypeAccessors$2 = { children: {} }

    prototypeAccessors$2.children.get = function () {
      return this.childNodes.filter(isElement)
    }

    Element.prototype.setAttribute = function setAttribute (key, value) {
      this.setAttributeNS(null, key, value)
    }
    Element.prototype.getAttribute = function getAttribute (key) {
      return this.getAttributeNS(null, key)
    }
    Element.prototype.removeAttribute = function removeAttribute (key) {
      this.removeAttributeNS(null, key)
    }

    Element.prototype.setAttributeNS = function setAttributeNS (ns, name, value) {
      var attr = findWhere(this.attributes, createAttributeFilter(ns, name))

      var oldValue = attr && attr.value
      if (!attr) this.attributes.push(attr = { ns: ns, name: name })
      attr.value = String(value)
      mutation(this, 'attributes', { attributeName: name, attributeNamespace: ns, oldValue: oldValue })
    }
    Element.prototype.getAttributeNS = function getAttributeNS (ns, name) {
      var attr = findWhere(this.attributes, createAttributeFilter(ns, name))
      return attr && attr.value
    }
    Element.prototype.removeAttributeNS = function removeAttributeNS (ns, name) {
      splice(this.attributes, createAttributeFilter(ns, name))
      mutation(this, 'attributes', { attributeName: name, attributeNamespace: ns, oldValue: this.getAttributeNS(ns, name) })
    }

    Element.prototype.addEventListener = function addEventListener (type, handler) {
      (this.__handlers[toLower(type)] || (this.__handlers[toLower(type)] = [])).push(handler.bind(this))
    }
    Element.prototype.removeEventListener = function removeEventListener (type, handler) {
      splice(this.__handlers[toLower(type)], handler, 0, true)
    }
    Element.prototype.dispatchEvent = function dispatchEvent (event) {
      var t = event.currentTarget = this

      var c = event.cancelable

      var l; var i
      do {
        l = t.__handlers && t.__handlers[toLower(event.type)]
        if (l) {
          for (i = l.length; i--;) {
            if ((l[i].call(t, event) === false || event._end) && c) break
          }
        }
      } while (event.bubbles && !(c && event._stop) && (event.target = t = t.parentNode))
      return !event.defaultPrevented
    }

    Object.defineProperties(Element.prototype, prototypeAccessors$2)

    return Element
  }(Node))

  var Document = (function (Element) {
    function Document () {
      Element.call(this, 9, '#document') // DOCUMENT_NODE
    }

    if (Element) Document.__proto__ = Element
    Document.prototype = Object.create(Element && Element.prototype)
    Document.prototype.constructor = Document

    return Document
  }(Element))

  var Event = function Event (type, opts) {
    this.type = type
    this.bubbles = !!opts.bubbles
    this.cancelable = !!opts.cancelable
  }
  Event.prototype.stopPropagation = function stopPropagation () {
    this._stop = true
  }
  Event.prototype.stopImmediatePropagation = function stopImmediatePropagation () {
    this._end = this._stop = true
  }
  Event.prototype.preventDefault = function preventDefault () {
    this.defaultPrevented = true
  }

  function mutation (target, type, record) {
    record.target = target
    record.type = type

    for (var i = observers.length; i--;) {
      var ob = observers[i]

      var match = target === ob._target
      if (!match && ob._options.subtree) {
        do {
          if ((match = target === ob._target)) break
        } while ((target = target.parentNode))
      }
      if (match) {
        ob._records.push(record)
        if (!pendingMutations) {
          pendingMutations = true
          setImmediate(flushMutations)
        }
      }
    }
  }

  function flushMutations () {
    pendingMutations = false
    for (var i = observers.length; i--;) {
      var ob = observers[i]
      if (ob._records.length) {
        try {
          ob.callback(ob.takeRecords())
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  var MutationObserver = function MutationObserver (callback) {
    this.callback = callback
    this._records = []
  }
  MutationObserver.prototype.observe = function observe (target, options) {
    this.disconnect()
    this._target = target
    this._options = options || {}
    observers.push(this)
  }
  MutationObserver.prototype.disconnect = function disconnect () {
    this._target = null
    splice(observers, this)
  }
  MutationObserver.prototype.takeRecords = function takeRecords () {
    return this._records.splice(0, this._records.length)
  }

  function createElement (type) {
    return new Element(null, String(type).toUpperCase())
  }

  function createElementNS (ns, type) {
    var element = createElement(type)
    element.namespace = ns
    return element
  }

  function createTextNode (text) {
    return new Text(text)
  }

  function createDocument () {
    var document = new Document()
    assign(document, document.defaultView = { document: document, MutationObserver: MutationObserver, Document: Document, Node: Node, Text: Text, Element: Element, SVGElement: Element, Event: Event })
    assign(document, { documentElement: document, createElement: createElement, createElementNS: createElementNS, createTextNode: createTextNode })
    document.appendChild(document.body = createElement('body'))
    return document
  }

  return createDocument()
}

module.exports = undom
