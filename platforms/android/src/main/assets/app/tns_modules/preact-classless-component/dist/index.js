'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (obj) {
  function preactComponent() {
    _preact.Component.apply(this, arguments);

    // auto-bind methods to the component
    for (var i in obj) {
      if (i !== 'render' && typeof obj[i] === 'function') {
        this[i] = obj[i].bind(this);
      }
    }

    if (obj.init) {
      obj.init.call(this);
    }
  }

  preactComponent.prototype = _extends(Object.create(_preact.Component.prototype), obj);

  preactComponent.prototype.constructor = preactComponent;

  return preactComponent;
};

var _preact = require('preact');