Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("../../../data/observable");
var style_1 = require("../../styling/style");
exports.Style = style_1.Style;
exports.unsetValue = new Object();
var symbolPropertyMap = {};
var cssSymbolPropertyMap = {};
var inheritableProperties = new Array();
var inheritableCssProperties = new Array();
function print(map) {
    var symbols = Object.getOwnPropertySymbols(map);
    for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
        var symbol = symbols_1[_i];
        var prop = map[symbol];
        if (!prop.registered) {
            console.log("Property " + prop.name + " not Registered!!!!!");
        }
    }
}
function _printUnregisteredProperties() {
    print(symbolPropertyMap);
    print(cssSymbolPropertyMap);
}
exports._printUnregisteredProperties = _printUnregisteredProperties;
var Property = (function () {
    function Property(options) {
        this.enumerable = true;
        this.configurable = true;
        var name = options.name;
        this.name = name;
        var key = Symbol(name + ":propertyKey");
        this.key = key;
        var getDefault = Symbol(name + ":getDefault");
        this.getDefault = getDefault;
        var setNative = Symbol(name + ":setNative");
        this.setNative = setNative;
        var defaultValueKey = Symbol(name + ":nativeDefaultValue");
        this.defaultValueKey = defaultValueKey;
        var defaultValue = options.defaultValue;
        this.defaultValue = defaultValue;
        var eventName = name + "Change";
        var equalityComparer = options.equalityComparer;
        var affectsLayout = options.affectsLayout;
        var valueChanged = options.valueChanged;
        var valueConverter = options.valueConverter;
        this.set = function (value) {
            var reset = value === exports.unsetValue;
            var unboxedValue;
            var wrapped;
            if (reset) {
                unboxedValue = defaultValue;
            }
            else {
                wrapped = value && value.wrapped;
                unboxedValue = wrapped ? observable_1.WrappedValue.unwrap(value) : value;
                if (valueConverter && typeof unboxedValue === "string") {
                    unboxedValue = valueConverter(unboxedValue);
                }
            }
            var currentValue = key in this ? this[key] : defaultValue;
            var changed = equalityComparer ? !equalityComparer(currentValue, unboxedValue) : currentValue !== unboxedValue;
            if (wrapped || changed) {
                var setNativeValue = this.nativeView && this[setNative];
                if (reset) {
                    delete this[key];
                    if (valueChanged) {
                        valueChanged(this, currentValue, unboxedValue);
                    }
                    if (setNativeValue) {
                        if (defaultValueKey in this) {
                            this[setNative](this[defaultValueKey]);
                            delete this[defaultValueKey];
                        }
                        else {
                            this[setNative](defaultValue);
                        }
                    }
                }
                else {
                    this[key] = unboxedValue;
                    if (valueChanged) {
                        valueChanged(this, currentValue, unboxedValue);
                    }
                    if (setNativeValue) {
                        if (!(defaultValueKey in this)) {
                            this[defaultValueKey] = this[getDefault] ? this[getDefault]() : defaultValue;
                        }
                        this[setNative](unboxedValue);
                    }
                }
                if (this.hasListeners(eventName)) {
                    this.notify({
                        eventName: eventName,
                        propertyName: name,
                        object: this,
                        value: unboxedValue,
                        oldValue: currentValue
                    });
                }
                if (affectsLayout) {
                    this.requestLayout();
                }
            }
        };
        this.get = function () {
            return key in this ? this[key] : defaultValue;
        };
        this.nativeValueChange = function (owner, value) {
            var currentValue = key in owner ? owner[key] : defaultValue;
            var changed = equalityComparer ? !equalityComparer(currentValue, value) : currentValue !== value;
            if (changed) {
                owner[key] = value;
                if (valueChanged) {
                    valueChanged(owner, currentValue, value);
                }
                if (owner.nativeView && !(defaultValueKey in owner)) {
                    owner[defaultValueKey] = owner[getDefault] ? owner[getDefault]() : defaultValue;
                }
                if (owner.hasListeners(eventName)) {
                    owner.notify({
                        eventName: eventName,
                        propertyName: name,
                        object: owner,
                        value: value,
                        oldValue: currentValue
                    });
                }
                if (affectsLayout) {
                    owner.requestLayout();
                }
            }
        };
        symbolPropertyMap[key] = this;
    }
    Property.prototype.register = function (cls) {
        if (this.registered) {
            throw new Error("Property " + this.name + " already registered.");
        }
        this.registered = true;
        Object.defineProperty(cls.prototype, this.name, this);
    };
    Property.prototype.isSet = function (instance) {
        return this.key in instance;
    };
    return Property;
}());
exports.Property = Property;
var CoercibleProperty = (function (_super) {
    __extends(CoercibleProperty, _super);
    function CoercibleProperty(options) {
        var _this = _super.call(this, options) || this;
        var name = options.name;
        var key = _this.key;
        var getDefault = _this.getDefault;
        var setNative = _this.setNative;
        var defaultValueKey = _this.defaultValueKey;
        var defaultValue = _this.defaultValue;
        var coerceKey = Symbol(name + ":coerceKey");
        var eventName = name + "Change";
        var affectsLayout = options.affectsLayout;
        var equalityComparer = options.equalityComparer;
        var valueChanged = options.valueChanged;
        var valueConverter = options.valueConverter;
        var coerceCallback = options.coerceValue;
        _this.coerce = function (target) {
            var originalValue = coerceKey in target ? target[coerceKey] : defaultValue;
            target[name] = originalValue;
        };
        _this.set = function (value) {
            var reset = value === exports.unsetValue;
            var unboxedValue;
            var wrapped;
            if (reset) {
                unboxedValue = defaultValue;
                delete this[coerceKey];
            }
            else {
                wrapped = value && value.wrapped;
                unboxedValue = wrapped ? observable_1.WrappedValue.unwrap(value) : value;
                if (valueConverter && typeof unboxedValue === "string") {
                    unboxedValue = valueConverter(unboxedValue);
                }
                this[coerceKey] = unboxedValue;
                unboxedValue = coerceCallback(this, unboxedValue);
            }
            var currentValue = key in this ? this[key] : defaultValue;
            var changed = equalityComparer ? !equalityComparer(currentValue, unboxedValue) : currentValue !== unboxedValue;
            if (wrapped || changed) {
                var setNativeValue = this.nativeView && this[setNative];
                if (reset) {
                    delete this[key];
                    if (valueChanged) {
                        valueChanged(this, currentValue, unboxedValue);
                    }
                    if (setNativeValue) {
                        if (defaultValueKey in this) {
                            this[setNative](this[defaultValueKey]);
                            delete this[defaultValueKey];
                        }
                        else {
                            this[setNative](defaultValue);
                        }
                    }
                }
                else {
                    this[key] = unboxedValue;
                    if (valueChanged) {
                        valueChanged(this, currentValue, unboxedValue);
                    }
                    if (setNativeValue) {
                        if (!(defaultValueKey in this)) {
                            this[defaultValueKey] = this[getDefault] ? this[getDefault]() : defaultValue;
                        }
                        this[setNative](unboxedValue);
                    }
                }
                if (this.hasListeners(eventName)) {
                    this.notify({
                        eventName: eventName,
                        propertyName: name,
                        object: this,
                        value: unboxedValue,
                        oldValue: currentValue
                    });
                }
                if (affectsLayout) {
                    this.requestLayout();
                }
            }
        };
        return _this;
    }
    return CoercibleProperty;
}(Property));
exports.CoercibleProperty = CoercibleProperty;
var InheritedProperty = (function (_super) {
    __extends(InheritedProperty, _super);
    function InheritedProperty(options) {
        var _this = _super.call(this, options) || this;
        var name = options.name;
        var key = _this.key;
        var defaultValue = options.defaultValue;
        var sourceKey = Symbol(name + ":valueSourceKey");
        _this.sourceKey = sourceKey;
        var setBase = _this.set;
        var setFunc = function (valueSource) { return function (value) {
            var that = this;
            var unboxedValue;
            var newValueSource;
            if (value === exports.unsetValue) {
                var parent_1 = that.parent;
                if (parent_1 && parent_1[sourceKey] !== 0) {
                    unboxedValue = parent_1[name];
                    newValueSource = 1;
                }
                else {
                    unboxedValue = defaultValue;
                    newValueSource = 0;
                }
            }
            else {
                unboxedValue = value;
                newValueSource = valueSource;
            }
            var currentValue = that[key];
            setBase.call(that, unboxedValue);
            var newValue = that[key];
            that[sourceKey] = newValueSource;
            if (currentValue !== newValue) {
                var reset_1 = newValueSource === 0;
                that.eachChild(function (child) {
                    var childValueSource = child[sourceKey] || 0;
                    if (reset_1) {
                        if (childValueSource === 1) {
                            setFunc.call(child, exports.unsetValue);
                        }
                    }
                    else {
                        if (childValueSource <= 1) {
                            setInheritedValue.call(child, newValue);
                        }
                    }
                    return true;
                });
            }
        }; };
        var setInheritedValue = setFunc(1);
        _this.setInheritedValue = setInheritedValue;
        _this.set = setFunc(3);
        inheritableProperties.push(_this);
        return _this;
    }
    return InheritedProperty;
}(Property));
exports.InheritedProperty = InheritedProperty;
var CssProperty = (function () {
    function CssProperty(options) {
        var name = options.name;
        this.name = name;
        this.cssName = "css:" + options.cssName;
        this.cssLocalName = options.cssName;
        var key = Symbol(name + ":propertyKey");
        this.key = key;
        var sourceKey = Symbol(name + ":valueSourceKey");
        this.sourceKey = sourceKey;
        var getDefault = Symbol(name + ":getDefault");
        this.getDefault = getDefault;
        var setNative = Symbol(name + ":setNative");
        this.setNative = setNative;
        var defaultValueKey = Symbol(name + ":nativeDefaultValue");
        this.defaultValueKey = defaultValueKey;
        var defaultValue = options.defaultValue;
        this.defaultValue = defaultValue;
        var eventName = name + "Change";
        var affectsLayout = options.affectsLayout;
        var equalityComparer = options.equalityComparer;
        var valueChanged = options.valueChanged;
        var valueConverter = options.valueConverter;
        function setLocalValue(value) {
            var reset = value === exports.unsetValue;
            if (reset) {
                value = defaultValue;
                delete this[sourceKey];
            }
            else {
                this[sourceKey] = 3;
                if (valueConverter && typeof value === "string") {
                    value = valueConverter(value);
                }
            }
            var currentValue = key in this ? this[key] : defaultValue;
            var changed = equalityComparer ? !equalityComparer(currentValue, value) : currentValue !== value;
            if (changed) {
                var view = this.view;
                var setNativeValue = view.nativeView && view[setNative];
                if (reset) {
                    delete this[key];
                    if (valueChanged) {
                        valueChanged(this, currentValue, value);
                    }
                    if (setNativeValue) {
                        if (defaultValueKey in this) {
                            view[setNative](this[defaultValueKey]);
                            delete this[defaultValueKey];
                        }
                        else {
                            view[setNative](defaultValue);
                        }
                    }
                }
                else {
                    this[key] = value;
                    if (valueChanged) {
                        valueChanged(this, currentValue, value);
                    }
                    if (setNativeValue) {
                        if (!(defaultValueKey in this)) {
                            this[defaultValueKey] = view[getDefault] ? view[getDefault]() : defaultValue;
                        }
                        view[setNative](value);
                    }
                }
                if (this.hasListeners(eventName)) {
                    this.notify({
                        eventName: eventName,
                        propertyName: name,
                        object: this,
                        value: value,
                        oldValue: currentValue
                    });
                }
                if (affectsLayout) {
                    view.requestLayout();
                }
            }
        }
        function setCssValue(value) {
            var reset = value === exports.unsetValue;
            var currentValueSource = this[sourceKey] || 0;
            if (currentValueSource === 3) {
                return;
            }
            if (reset) {
                value = defaultValue;
                delete this[sourceKey];
            }
            else {
                if (valueConverter && typeof value === "string") {
                    value = valueConverter(value);
                }
                this[sourceKey] = 2;
            }
            var currentValue = key in this ? this[key] : defaultValue;
            var changed = equalityComparer ? !equalityComparer(currentValue, value) : currentValue !== value;
            if (changed) {
                var view = this.view;
                var setNativeValue = view.nativeView && view[setNative];
                if (reset) {
                    delete this[key];
                    if (valueChanged) {
                        valueChanged(this, currentValue, value);
                    }
                    if (setNativeValue) {
                        if (defaultValueKey in this) {
                            view[setNative](this[defaultValueKey]);
                            delete this[defaultValueKey];
                        }
                        else {
                            view[setNative](defaultValue);
                        }
                    }
                }
                else {
                    this[key] = value;
                    if (valueChanged) {
                        valueChanged(this, currentValue, value);
                    }
                    if (setNativeValue) {
                        if (!(defaultValueKey in this)) {
                            this[defaultValueKey] = view[getDefault] ? view[getDefault]() : defaultValue;
                        }
                        view[setNative](value);
                    }
                }
                if (this.hasListeners(eventName)) {
                    this.notify({
                        eventName: eventName,
                        propertyName: name,
                        object: this,
                        value: value,
                        oldValue: currentValue
                    });
                }
                if (affectsLayout) {
                    view.requestLayout();
                }
            }
        }
        function get() {
            return key in this ? this[key] : defaultValue;
        }
        this.cssValueDescriptor = {
            enumerable: true,
            configurable: true,
            get: get,
            set: setCssValue
        };
        this.localValueDescriptor = {
            enumerable: true,
            configurable: true,
            get: get,
            set: setLocalValue
        };
        cssSymbolPropertyMap[key] = this;
    }
    CssProperty.prototype.register = function (cls) {
        if (this.registered) {
            throw new Error("Property " + this.name + " already registered.");
        }
        this.registered = true;
        Object.defineProperty(cls.prototype, this.name, this.localValueDescriptor);
        Object.defineProperty(cls.prototype, this.cssName, this.cssValueDescriptor);
        if (this.cssLocalName !== this.cssName) {
            Object.defineProperty(cls.prototype, this.cssLocalName, this.localValueDescriptor);
        }
    };
    CssProperty.prototype.isSet = function (instance) {
        return this.key in instance;
    };
    return CssProperty;
}());
exports.CssProperty = CssProperty;
var CssAnimationProperty = (function () {
    function CssAnimationProperty(options) {
        this.options = options;
        var valueConverter = options.valueConverter, equalityComparer = options.equalityComparer, valueChanged = options.valueChanged, defaultValue = options.defaultValue;
        var propertyName = options.name;
        this.name = propertyName;
        CssAnimationProperty.properties[propertyName] = this;
        if (options.cssName && options.cssName !== propertyName) {
            CssAnimationProperty.properties[options.cssName] = this;
        }
        this._valueConverter = options.valueConverter;
        var cssName = "css:" + (options.cssName || propertyName);
        this.cssName = cssName;
        var keyframeName = "keyframe:" + propertyName;
        this.keyframe = keyframeName;
        var defaultName = "default:" + propertyName;
        var defaultValueKey = Symbol(defaultName);
        this.defaultValueKey = defaultValueKey;
        this.defaultValue = defaultValue;
        var cssValue = Symbol(cssName);
        var styleValue = Symbol(propertyName);
        var keyframeValue = Symbol(keyframeName);
        var computedValue = Symbol("computed-value:" + propertyName);
        this.computedValueKey = computedValue;
        var computedSource = Symbol("computed-source:" + propertyName);
        this.getDefault = Symbol(propertyName + ":getDefault");
        var setNative = this.setNative = Symbol(propertyName + ":setNative");
        var eventName = propertyName + "Change";
        function descriptor(symbol, propertySource, enumerable, configurable, getsComputed) {
            return {
                enumerable: enumerable, configurable: configurable,
                get: getsComputed ? function () { return this[computedValue]; } : function () { return this[symbol]; },
                set: function (value) {
                    var prev = this[computedValue];
                    if (value === exports.unsetValue) {
                        this[symbol] = exports.unsetValue;
                        if (this[computedSource] === propertySource) {
                            if (this[styleValue] !== exports.unsetValue) {
                                this[computedSource] = 3;
                                this[computedValue] = this[styleValue];
                            }
                            else if (this[cssValue] !== exports.unsetValue) {
                                this[computedSource] = 2;
                                this[computedValue] = this[cssValue];
                            }
                            else {
                                this[computedSource] = 0;
                                this[computedValue] = defaultValue;
                            }
                        }
                    }
                    else {
                        if (valueConverter && typeof value === "string") {
                            value = valueConverter(value);
                        }
                        this[symbol] = value;
                        if (this[computedSource] <= propertySource) {
                            this[computedSource] = propertySource;
                            this[computedValue] = value;
                        }
                    }
                    var next = this[computedValue];
                    if (prev !== next && (!equalityComparer || !equalityComparer(prev, next))) {
                        if (valueChanged) {
                            valueChanged(this, prev, next);
                        }
                        if (this.view.nativeView && this.view[setNative]) {
                            this.view[setNative](next);
                        }
                        if (this.hasListeners(eventName)) {
                            this.notify({ eventName: eventName, object: this, propertyName: propertyName, value: value, oldValue: prev });
                        }
                    }
                }
            };
        }
        var defaultPropertyDescriptor = descriptor(defaultValueKey, 0, false, false, false);
        var cssPropertyDescriptor = descriptor(cssValue, 2, false, false, false);
        var stylePropertyDescriptor = descriptor(styleValue, 3, true, true, true);
        var keyframePropertyDescriptor = descriptor(keyframeValue, 4, false, false, false);
        symbolPropertyMap[computedValue] = this;
        cssSymbolPropertyMap[computedValue] = this;
        this.register = function (cls) {
            cls.prototype[defaultValueKey] = options.defaultValue;
            cls.prototype[computedValue] = options.defaultValue;
            cls.prototype[computedSource] = 0;
            cls.prototype[cssValue] = exports.unsetValue;
            cls.prototype[styleValue] = exports.unsetValue;
            cls.prototype[keyframeValue] = exports.unsetValue;
            Object.defineProperty(cls.prototype, defaultName, defaultPropertyDescriptor);
            Object.defineProperty(cls.prototype, cssName, cssPropertyDescriptor);
            Object.defineProperty(cls.prototype, propertyName, stylePropertyDescriptor);
            if (options.cssName && options.cssName !== options.name) {
                Object.defineProperty(cls.prototype, options.cssName, stylePropertyDescriptor);
            }
            Object.defineProperty(cls.prototype, keyframeName, keyframePropertyDescriptor);
        };
    }
    CssAnimationProperty._getByCssName = function (name) {
        return this.properties[name];
    };
    CssAnimationProperty.prototype.isSet = function (instance) {
        return instance[this.computedValueKey] !== exports.unsetValue;
    };
    return CssAnimationProperty;
}());
CssAnimationProperty.properties = {};
exports.CssAnimationProperty = CssAnimationProperty;
var InheritedCssProperty = (function (_super) {
    __extends(InheritedCssProperty, _super);
    function InheritedCssProperty(options) {
        var _this = _super.call(this, options) || this;
        var name = options.name;
        var key = _this.key;
        var sourceKey = _this.sourceKey;
        var getDefault = _this.getDefault;
        var setNative = _this.setNative;
        var defaultValueKey = _this.defaultValueKey;
        var eventName = name + "Change";
        var defaultValue = options.defaultValue;
        var affectsLayout = options.affectsLayout;
        var equalityComparer = options.equalityComparer;
        var valueChanged = options.valueChanged;
        var valueConverter = options.valueConverter;
        var setFunc = function (valueSource) { return function (value) {
            var reset = value === exports.unsetValue;
            var currentValueSource = this[sourceKey] || 0;
            if (reset) {
                if (valueSource === 2 && currentValueSource === 3) {
                    return;
                }
            }
            else {
                if (currentValueSource > valueSource) {
                    return;
                }
            }
            var view = this.view;
            var newValue;
            if (reset) {
                var parent_2 = view.parent;
                var style = parent_2 ? parent_2.style : null;
                if (style && style[sourceKey] > 0) {
                    newValue = style[name];
                    this[sourceKey] = 1;
                }
                else {
                    newValue = defaultValue;
                    delete this[sourceKey];
                }
            }
            else {
                this[sourceKey] = valueSource;
                if (valueConverter && typeof value === "string") {
                    newValue = valueConverter(value);
                }
                else {
                    newValue = value;
                }
            }
            var currentValue = key in this ? this[key] : defaultValue;
            var changed = equalityComparer ? !equalityComparer(currentValue, newValue) : currentValue !== newValue;
            if (changed) {
                var view_1 = this.view;
                var setNativeValue = view_1.nativeView && view_1[setNative];
                if (reset) {
                    delete this[key];
                    if (valueChanged) {
                        valueChanged(this, currentValue, newValue);
                    }
                    if (setNativeValue) {
                        if (defaultValueKey in this) {
                            view_1[setNative](this[defaultValueKey]);
                            delete this[defaultValueKey];
                        }
                        else {
                            view_1[setNative](defaultValue);
                        }
                    }
                }
                else {
                    this[key] = newValue;
                    if (valueChanged) {
                        valueChanged(this, currentValue, newValue);
                    }
                    if (setNativeValue) {
                        if (!(defaultValueKey in this)) {
                            this[defaultValueKey] = view_1[getDefault] ? view_1[getDefault]() : defaultValue;
                        }
                        view_1[setNative](newValue);
                    }
                }
                if (this.hasListeners(eventName)) {
                    this.notify({
                        eventName: eventName,
                        propertyName: name,
                        object: this,
                        value: newValue,
                        oldValue: currentValue
                    });
                }
                if (affectsLayout) {
                    view_1.requestLayout();
                }
                view_1.eachChild(function (child) {
                    var childStyle = child.style;
                    var childValueSource = childStyle[sourceKey] || 0;
                    if (reset) {
                        if (childValueSource === 1) {
                            setDefaultFunc.call(childStyle, exports.unsetValue);
                        }
                    }
                    else {
                        if (childValueSource <= 1) {
                            setInheritedFunc.call(childStyle, newValue);
                        }
                    }
                    return true;
                });
            }
        }; };
        var setDefaultFunc = setFunc(0);
        var setInheritedFunc = setFunc(1);
        _this.setInheritedValue = setInheritedFunc;
        _this.cssValueDescriptor.set = setFunc(2);
        _this.localValueDescriptor.set = setFunc(3);
        inheritableCssProperties.push(_this);
        return _this;
    }
    return InheritedCssProperty;
}(CssProperty));
exports.InheritedCssProperty = InheritedCssProperty;
var ShorthandProperty = (function () {
    function ShorthandProperty(options) {
        this.name = options.name;
        var key = Symbol(this.name + ":propertyKey");
        this.key = key;
        this.cssName = "css:" + options.cssName;
        this.cssLocalName = "" + options.cssName;
        var converter = options.converter;
        function setLocalValue(value) {
            if (this[key] !== value) {
                this[key] = value;
                for (var _i = 0, _a = converter(value); _i < _a.length; _i++) {
                    var _b = _a[_i], p = _b[0], v = _b[1];
                    this[p.name] = v;
                }
            }
        }
        function setCssValue(value) {
            if (this[key] !== value) {
                this[key] = value;
                for (var _i = 0, _a = converter(value); _i < _a.length; _i++) {
                    var _b = _a[_i], p = _b[0], v = _b[1];
                    this[p.cssName] = v;
                }
            }
        }
        this.cssValueDescriptor = {
            enumerable: true,
            configurable: true,
            get: options.getter,
            set: setCssValue
        };
        this.localValueDescriptor = {
            enumerable: true,
            configurable: true,
            get: options.getter,
            set: setLocalValue
        };
        cssSymbolPropertyMap[key] = this;
    }
    ShorthandProperty.prototype.register = function (cls) {
        if (this.registered) {
            throw new Error("Property " + this.name + " already registered.");
        }
        this.registered = true;
        Object.defineProperty(cls.prototype, this.name, this.localValueDescriptor);
        Object.defineProperty(cls.prototype, this.cssName, this.cssValueDescriptor);
        if (this.cssLocalName !== this.cssName) {
            Object.defineProperty(cls.prototype, this.cssLocalName, this.localValueDescriptor);
        }
    };
    return ShorthandProperty;
}());
exports.ShorthandProperty = ShorthandProperty;
function inheritablePropertyValuesOn(view) {
    var array = new Array();
    for (var _i = 0, inheritableProperties_1 = inheritableProperties; _i < inheritableProperties_1.length; _i++) {
        var prop = inheritableProperties_1[_i];
        var sourceKey = prop.sourceKey;
        var valueSource = view[sourceKey] || 0;
        if (valueSource !== 0) {
            array.push({ property: prop, value: view[prop.name] });
        }
    }
    return array;
}
function inheritableCssPropertyValuesOn(style) {
    var array = new Array();
    for (var _i = 0, inheritableCssProperties_1 = inheritableCssProperties; _i < inheritableCssProperties_1.length; _i++) {
        var prop = inheritableCssProperties_1[_i];
        var sourceKey = prop.sourceKey;
        var valueSource = style[sourceKey] || 0;
        if (valueSource !== 0) {
            array.push({ property: prop, value: style[prop.name] });
        }
    }
    return array;
}
function initNativeView(view) {
    var symbols = Object.getOwnPropertySymbols(view);
    for (var _i = 0, symbols_2 = symbols; _i < symbols_2.length; _i++) {
        var symbol = symbols_2[_i];
        var property = symbolPropertyMap[symbol];
        if (!property) {
            continue;
        }
        var setNative = property.setNative;
        var getDefault = property.getDefault;
        if (setNative in view) {
            var defaultValueKey = property.defaultValueKey;
            if (!(defaultValueKey in view)) {
                view[defaultValueKey] = view[getDefault] ? view[getDefault]() : property.defaultValue;
            }
            var value = view[symbol];
            view[setNative](value);
        }
    }
    var style = view.style;
    symbols = Object.getOwnPropertySymbols(style);
    for (var _a = 0, symbols_3 = symbols; _a < symbols_3.length; _a++) {
        var symbol = symbols_3[_a];
        var property = cssSymbolPropertyMap[symbol];
        if (!property) {
            continue;
        }
        if (view[property.setNative]) {
            if (view[property.getDefault]) {
                var defaultValueKey = property.defaultValueKey;
                if (!(defaultValueKey in style)) {
                    style[defaultValueKey] = view[property.getDefault] ? view[property.getDefault]() : property.defaultValue;
                }
            }
            var value = style[symbol];
            view[property.setNative](value);
        }
    }
}
exports.initNativeView = initNativeView;
function resetNativeView(view) {
    var symbols = Object.getOwnPropertySymbols(view);
    for (var _i = 0, symbols_4 = symbols; _i < symbols_4.length; _i++) {
        var symbol = symbols_4[_i];
        var property = symbolPropertyMap[symbol];
        if (!property) {
            continue;
        }
        if (view[property.setNative]) {
            if (property.defaultValueKey in view) {
                view[property.setNative](view[property.defaultValueKey]);
                delete view[property.defaultValueKey];
            }
            else {
                view[property.setNative](property.defaultValue);
            }
        }
    }
    var style = view.style;
    symbols = Object.getOwnPropertySymbols(style);
    for (var _a = 0, symbols_5 = symbols; _a < symbols_5.length; _a++) {
        var symbol = symbols_5[_a];
        var property = cssSymbolPropertyMap[symbol];
        if (!property) {
            continue;
        }
        if (view[property.setNative]) {
            if (property.defaultValueKey in style) {
                view[property.setNative](style[property.defaultValueKey]);
                delete style[property.defaultValueKey];
            }
            else {
                view[property.setNative](property.defaultValue);
            }
        }
    }
}
exports.resetNativeView = resetNativeView;
function clearInheritedProperties(view) {
    for (var _i = 0, inheritableProperties_2 = inheritableProperties; _i < inheritableProperties_2.length; _i++) {
        var prop = inheritableProperties_2[_i];
        var sourceKey = prop.sourceKey;
        if (view[sourceKey] === 1) {
            prop.set.call(view, exports.unsetValue);
        }
    }
    var style = view.style;
    for (var _a = 0, inheritableCssProperties_2 = inheritableCssProperties; _a < inheritableCssProperties_2.length; _a++) {
        var prop = inheritableCssProperties_2[_a];
        var sourceKey = prop.sourceKey;
        if (style[sourceKey] === 1) {
            prop.setInheritedValue.call(style, exports.unsetValue);
        }
    }
}
exports.clearInheritedProperties = clearInheritedProperties;
function resetCSSProperties(style) {
    var symbols = Object.getOwnPropertySymbols(style);
    for (var _i = 0, symbols_6 = symbols; _i < symbols_6.length; _i++) {
        var symbol = symbols_6[_i];
        var cssProperty = void 0;
        if (cssProperty = cssSymbolPropertyMap[symbol]) {
            style[cssProperty.cssName] = exports.unsetValue;
            if (cssProperty instanceof CssAnimationProperty) {
                style[cssProperty.keyframe] = exports.unsetValue;
            }
        }
    }
}
exports.resetCSSProperties = resetCSSProperties;
function propagateInheritableProperties(view, child) {
    var inheritablePropertyValues = inheritablePropertyValuesOn(view);
    for (var _i = 0, inheritablePropertyValues_1 = inheritablePropertyValues; _i < inheritablePropertyValues_1.length; _i++) {
        var pair = inheritablePropertyValues_1[_i];
        var prop = pair.property;
        var sourceKey = prop.sourceKey;
        var currentValueSource = child[sourceKey] || 0;
        if (currentValueSource <= 1) {
            prop.setInheritedValue.call(child, pair.value);
        }
    }
}
exports.propagateInheritableProperties = propagateInheritableProperties;
function propagateInheritableCssProperties(parentStyle, childStyle) {
    var inheritableCssPropertyValues = inheritableCssPropertyValuesOn(parentStyle);
    for (var _i = 0, inheritableCssPropertyValues_1 = inheritableCssPropertyValues; _i < inheritableCssPropertyValues_1.length; _i++) {
        var pair = inheritableCssPropertyValues_1[_i];
        var prop = pair.property;
        var sourceKey = prop.sourceKey;
        var currentValueSource = childStyle[sourceKey] || 0;
        if (currentValueSource <= 1) {
            prop.setInheritedValue.call(childStyle, pair.value, 1);
        }
    }
}
exports.propagateInheritableCssProperties = propagateInheritableCssProperties;
function makeValidator() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    var set = new Set(values);
    return function (value) { return set.has(value); };
}
exports.makeValidator = makeValidator;
function makeParser(isValid) {
    return function (value) {
        var lower = value && value.toLowerCase();
        if (isValid(lower)) {
            return lower;
        }
        else {
            throw new Error("Invalid value: " + value);
        }
    };
}
exports.makeParser = makeParser;
//# sourceMappingURL=properties.js.map