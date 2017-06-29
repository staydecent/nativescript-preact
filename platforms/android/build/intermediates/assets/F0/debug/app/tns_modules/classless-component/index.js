const toType = function (val) {
  var str = ({}).toString.call(val)
  return str.toLowerCase().slice(8, -1)
}

/**
 * Create a class-based Component out of object literals
 * @param  {Function} Component   React, Preact, Inferno Component creator
 * @param  {Function} hyperscript React, Preact, Inferno element/vnode creator
 * @param  {Object}   objs        object-literals containing lifecycle methods etc.
 * @return {Component}            The final Component to render
 */
export function compose () {
  const args = Array.prototype.slice.call(arguments)
  const Component = args[0]
  const h = args[1]

  if (toType(Component) !== 'function' || toType(h) !== 'function') {
    throw new Error('compose expects to be called like, `compose(Component, createElement, [{}, {}, ...]`')
  }

  // Allow partial appliction for reuse, ex:
  // `const preactCompose = compose(Component, h)`
  // `preactCompose(withState(..), {}, ...)`
  if (args.length <= 2) {
    return compose.bind(null, Component, h)
  }

  const objs = args.slice(2).map((obj) =>
    toType(obj) === 'function' ? {[obj.name]: obj} : obj
  )
  const obj = Object.assign.apply(Object, [{}].concat(objs))
  const userRender = obj.render.bind(null)
  const pfc = (props) => userRender(props)

  obj.render = function () {
    let props = _arbitraryFuncs.call(this, this.props)

    // handle mapProps
    if (obj._mapProps) {
      Object.assign(props, obj._mapProps.call(this, props))
      delete props._mapProps
    }

    // Bind withState setter
    if (obj._mergeState) {
      const setter = obj[obj._mergeState].bind(this)
      Object.assign(obj.state, {[obj._mergeState]: setter})
      delete props._mergeState
    }

    // Pass the state of the hoc to the pfc as props
    if (this.state) {
      const stateKeys = Object.keys(this.state)
      for (let x = 0; x < stateKeys.length; x++) {
        props[stateKeys[x]] = this.state[stateKeys[x]]
      }
    }

    return h(pfc, props)
  }

  // Create a HoC class, avoiding class syntax
  function hoc () {
    Component.apply(this, arguments)

    if (this._initialValue && this._initialValue.length === 2) {
      Object.assign(this.state, {[this._initialValue[0]]: this._initialValue[1].apply(null, arguments)})
      delete this._initialValue
    }

    // auto-bind methods to the component
    for (let i in obj) {
      if (i !== 'render' && toType(obj[i]) === 'function') {
        this[i] = obj[i].bind(this)
      }
    }

    if (obj.init) {
      obj.init.call(this)
    }
  }

  hoc.prototype = Object.assign(
    Object.create(Component.prototype), obj
  )

  hoc.prototype.constructor = hoc

  if (obj._setNodeName) {
    Object.defineProperty(hoc, 'name', {value: obj._setNodeName})
    delete obj._setNodeName
  }

  return hoc
}

function _arbitraryFuncs (props) {
  const newProps = Object.assign({}, props)
  const ignore = [
    'componentWillMount',
    'componentDidMount',
    'componentWillUnmount',
    'componentDidUnmount',
    'componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'componentDidUpdate'
  ]
  const keys = Object.keys(this)
  for (var x = 0; x < keys.length; x++) {
    if (toType(this[keys[x]]) === 'function' && ignore.indexOf(keys[x]) === -1) {
      newProps[keys[x]] = this[keys[x]]
    }
  }
  return newProps
}

/**
 * Set a state value, and a function to update that state value.
 * @param  {[type]} propName      [description]
 * @param  {[type]} setterName    [description]
 * @param  {[type]} initialValue) [description]
 * @return {[type]}               [description]
 */
export function withState (propName, setterName, initialValue) {
  const obj = {
    [setterName]: function setter (val) {
      this.setState({[propName]: val})
    },
    _mergeState: setterName
  }
  if (toType(initialValue) === 'function') {
    obj._initialValue = [propName, initialValue]
    obj.state = {[propName]: null}
  } else {
    obj.state = {[propName]: initialValue}
  }
  return obj
}

/**
 * Pass props to function, that returns new props
 * @param  {Function} fn (ownerProps: Object) => Object
 * @return {Object}
 */
export function mapProps (fn) {
  return {_mapProps: fn}
}

export function setNodeName (string) {
  return {_setNodeName: string}
}
