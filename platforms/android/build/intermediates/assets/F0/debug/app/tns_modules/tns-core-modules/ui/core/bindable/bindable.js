Object.defineProperty(exports, "__esModule", { value: true });
var properties_1 = require("../properties");
var observable_1 = require("../../../data/observable");
exports.Observable = observable_1.Observable;
exports.WrappedValue = observable_1.WrappedValue;
var weak_event_listener_1 = require("../weak-event-listener");
var binding_builder_1 = require("../../builder/binding-builder");
var utils_1 = require("../../../utils/utils");
var trace_1 = require("../../../trace");
exports.traceEnabled = trace_1.isEnabled;
exports.traceWrite = trace_1.write;
exports.traceCategories = trace_1.categories;
exports.traceNotifyEvent = trace_1.notifyEvent;
exports.isCategorySet = trace_1.isCategorySet;
exports.traceMessageType = trace_1.messageType;
var types = require("../../../utils/types");
var application = require("../../../application");
var polymerExpressions = require("../../../js-libs/polymer-expressions");
var contextKey = "context";
var paramsRegex = /\[\s*(['"])*(\w*)\1\s*\]/;
var bc = binding_builder_1.bindingConstants;
var emptyArray = [];
var propertiesCache = {};
function getProperties(property) {
    if (!property) {
        return emptyArray;
    }
    var result = propertiesCache[property];
    if (result) {
        return result;
    }
    var parentsMatches = property.match(binding_builder_1.parentsRegex);
    result = property.replace(binding_builder_1.parentsRegex, "parentsMatch")
        .replace(/\]/g, "")
        .split(/\.|\[/);
    var parentsMatchesCounter = 0;
    for (var i = 0, resultLength = result.length; i < resultLength; i++) {
        if (result[i] === "parentsMatch") {
            result[i] = parentsMatches[parentsMatchesCounter++];
        }
    }
    propertiesCache[property] = result;
    return result;
}
function getEventOrGestureName(name) {
    return name.indexOf("on") === 0 ? name.substr(2, name.length - 2) : name;
}
exports.getEventOrGestureName = getEventOrGestureName;
function isGesture(eventOrGestureName) {
    var t = eventOrGestureName.trim().toLowerCase();
    return t === "tap"
        || t === "doubletap"
        || t === "pinch"
        || t === "pan"
        || t === "swipe"
        || t === "rotation"
        || t === "longpress"
        || t === "touch";
}
exports.isGesture = isGesture;
function isEventOrGesture(name, view) {
    if (typeof name === "string") {
        var eventOrGestureName = getEventOrGestureName(name);
        var evt = eventOrGestureName + "Event";
        return view.constructor && evt in view.constructor || isGesture(eventOrGestureName.toLowerCase());
    }
    return false;
}
exports.isEventOrGesture = isEventOrGesture;
var Binding = (function () {
    function Binding(target, options) {
        this.propertyChangeListeners = new Map();
        this.target = new WeakRef(target);
        this.options = options;
        this.sourceProperties = getProperties(options.sourceProperty);
        this.targetOptions = this.resolveOptions(target, getProperties(options.targetProperty));
        if (!this.targetOptions) {
            throw new Error("Invalid property: " + options.targetProperty + " for target: " + target);
        }
        if (options.twoWay) {
            var target_1 = this.targetOptions.instance.get();
            if (target_1 instanceof observable_1.Observable) {
                target_1.on(this.targetOptions.property + "Change", this.onTargetPropertyChanged, this);
            }
        }
    }
    Binding.prototype.onTargetPropertyChanged = function (data) {
        this.updateTwoWay(data.value);
    };
    Binding.prototype.loadedHandlerVisualTreeBinding = function (args) {
        var target = args.object;
        target.off("loaded", this.loadedHandlerVisualTreeBinding, this);
        var context = target.bindingContext;
        if (context !== undefined && context !== null) {
            this.update(context);
        }
    };
    ;
    Binding.prototype.clearSource = function () {
        var _this = this;
        this.propertyChangeListeners.forEach(function (observable, index, map) {
            weak_event_listener_1.removeWeakEventListener(observable, observable_1.Observable.propertyChangeEvent, _this.onSourcePropertyChanged, _this);
        });
        this.propertyChangeListeners.clear();
        this.sourcesAndProperties = null;
        if (this.source) {
            this.source.clear();
        }
        if (this.sourceOptions) {
            this.sourceOptions.instance.clear();
            this.sourceOptions = undefined;
        }
    };
    Binding.prototype.sourceAsObject = function (source) {
        var objectType = typeof source;
        if (objectType === "number") {
            source = new Number(source);
        }
        else if (objectType === "boolean") {
            source = new Boolean(source);
        }
        else if (objectType === "string") {
            source = new String(source);
        }
        return source;
    };
    Binding.prototype.bindingContextChanged = function (data) {
        var target = this.targetOptions.instance.get();
        if (!target) {
            this.unbind();
            return;
        }
        var value = data.value;
        if (value !== null && value !== undefined) {
            this.update(value);
        }
        else {
            this.clearBinding();
        }
    };
    Binding.prototype.bind = function (source) {
        var target = this.targetOptions.instance.get();
        if (this.sourceIsBindingContext && target instanceof observable_1.Observable && this.targetOptions.property !== "bindingContext") {
            target.on("bindingContextChange", this.bindingContextChanged, this);
        }
        this.update(source);
    };
    Binding.prototype.update = function (source) {
        this.clearSource();
        source = this.sourceAsObject(source);
        if (!types.isNullOrUndefined(source)) {
            this.source = new WeakRef(source);
            this.sourceOptions = this.resolveOptions(source, this.sourceProperties);
            var sourceValue = this.getSourcePropertyValue();
            this.updateTarget(sourceValue);
            this.addPropertyChangeListeners(this.source, this.sourceProperties);
        }
        else if (!this.sourceIsBindingContext) {
            var sourceValue = this.getSourcePropertyValue();
            this.updateTarget(sourceValue ? sourceValue : source);
        }
    };
    Binding.prototype.unbind = function () {
        var target = this.targetOptions.instance.get();
        if (target instanceof observable_1.Observable) {
            if (this.options.twoWay) {
                target.off(this.targetOptions.property + "Change", this.onTargetPropertyChanged, this);
            }
            if (this.sourceIsBindingContext && this.targetOptions.property !== "bindingContext") {
                target.off("bindingContextChange", this.bindingContextChanged, this);
            }
        }
        if (this.targetOptions) {
            this.targetOptions = undefined;
        }
        this.sourceProperties = undefined;
        if (!this.source) {
            return;
        }
        this.clearSource();
    };
    Binding.prototype.resolveObjectsAndProperties = function (source, properties) {
        var result = [];
        var currentObject = source;
        var currentObjectChanged = false;
        for (var i = 0, propsArrayLength = properties.length; i < propsArrayLength; i++) {
            var property = properties[i];
            if (property === bc.bindingValueKey) {
                currentObjectChanged = true;
            }
            if (property === bc.parentValueKey || property.indexOf(bc.parentsValueKey) === 0) {
                var parentView = this.getParentView(this.target.get(), property).view;
                if (parentView) {
                    currentObject = parentView.bindingContext;
                }
                else {
                    var targetInstance = this.target.get();
                    targetInstance.off("loaded", this.loadedHandlerVisualTreeBinding, this);
                    targetInstance.on("loaded", this.loadedHandlerVisualTreeBinding, this);
                }
                currentObjectChanged = true;
            }
            if (currentObject) {
                result.push({ instance: currentObject, property: property });
            }
            else {
                break;
            }
            if (!currentObjectChanged && (i < propsArrayLength - 1)) {
                currentObject = currentObject ? currentObject[properties[i]] : null;
            }
            currentObjectChanged = false;
        }
        return result;
    };
    Binding.prototype.addPropertyChangeListeners = function (source, sourceProperty, parentProperies) {
        var objectsAndProperties = this.resolveObjectsAndProperties(source.get(), sourceProperty);
        var prop = parentProperies || "";
        for (var i = 0, length_1 = objectsAndProperties.length; i < length_1; i++) {
            var propName = objectsAndProperties[i].property;
            prop += "$" + propName;
            var currentObject = objectsAndProperties[i].instance;
            if (!this.propertyChangeListeners.has(prop) && currentObject instanceof observable_1.Observable && currentObject._isViewBase) {
                weak_event_listener_1.addWeakEventListener(currentObject, propName + "Change", this.onSourcePropertyChanged, this);
                weak_event_listener_1.addWeakEventListener(currentObject, observable_1.Observable.propertyChangeEvent, this.onSourcePropertyChanged, this);
                this.propertyChangeListeners.set(prop, currentObject);
            }
            else if (!this.propertyChangeListeners.has(prop) && currentObject instanceof observable_1.Observable) {
                weak_event_listener_1.addWeakEventListener(currentObject, observable_1.Observable.propertyChangeEvent, this.onSourcePropertyChanged, this);
                this.propertyChangeListeners.set(prop, currentObject);
            }
        }
    };
    Binding.prototype.prepareExpressionForUpdate = function () {
        var escapedSourceProperty = utils_1.escapeRegexSymbols(this.options.sourceProperty);
        var expRegex = new RegExp(escapedSourceProperty, 'g');
        var resultExp = this.options.expression.replace(expRegex, bc.newPropertyValueKey);
        return resultExp;
    };
    Binding.prototype.updateTwoWay = function (value) {
        if (this.updating || !this.options.twoWay) {
            return;
        }
        var newValue = value;
        if (this.options.expression) {
            var changedModel = {};
            changedModel[bc.bindingValueKey] = value;
            changedModel[bc.newPropertyValueKey] = value;
            var sourcePropertyName = "";
            if (this.sourceOptions) {
                sourcePropertyName = this.sourceOptions.property;
            }
            else if (typeof this.options.sourceProperty === "string" && this.options.sourceProperty.indexOf(".") === -1) {
                sourcePropertyName = this.options.sourceProperty;
            }
            if (sourcePropertyName !== "") {
                changedModel[sourcePropertyName] = value;
            }
            var updateExpression = this.prepareExpressionForUpdate();
            this.prepareContextForExpression(changedModel, updateExpression, undefined);
            var expressionValue = this._getExpressionValue(updateExpression, true, changedModel);
            if (expressionValue instanceof Error) {
                trace_1.write(expressionValue.message, trace_1.categories.Binding, trace_1.messageType.error);
            }
            newValue = expressionValue;
        }
        this.updateSource(newValue);
    };
    Binding.prototype._getExpressionValue = function (expression, isBackConvert, changedModel) {
        try {
            var exp_1 = polymerExpressions.PolymerExpressions.getExpression(expression);
            if (exp_1) {
                var context = this.source && this.source.get && this.source.get() || global;
                var model = {};
                var addedProps = [];
                var resources = application.getResources();
                for (var prop in resources) {
                    if (resources.hasOwnProperty(prop) && !context.hasOwnProperty(prop)) {
                        context[prop] = resources[prop];
                        addedProps.push(prop);
                    }
                }
                this.prepareContextForExpression(context, expression, addedProps);
                model[contextKey] = context;
                var result = exp_1.getValue(model, isBackConvert, changedModel ? changedModel : model);
                var addedPropsLength = addedProps.length;
                for (var i = 0; i < addedPropsLength; i++) {
                    delete context[addedProps[i]];
                }
                addedProps.length = 0;
                return result;
            }
            return new Error(expression + " is not a valid expression.");
        }
        catch (e) {
            var errorMessage = "Run-time error occured in file: " + e.sourceURL + " at line: " + e.line + " and column: " + e.column;
            return new Error(errorMessage);
        }
    };
    Binding.prototype.onSourcePropertyChanged = function (data) {
        var sourceProps = this.sourceProperties;
        var sourcePropsLength = sourceProps.length;
        var changedPropertyIndex = sourceProps.indexOf(data.propertyName);
        var parentProps = "";
        if (changedPropertyIndex > -1) {
            parentProps = "$" + sourceProps.slice(0, changedPropertyIndex + 1).join("$");
            while (this.propertyChangeListeners.get(parentProps) !== data.object) {
                changedPropertyIndex += sourceProps.slice(changedPropertyIndex + 1).indexOf(data.propertyName) + 1;
                parentProps = "$" + sourceProps.slice(0, changedPropertyIndex + 1).join("$");
            }
        }
        if (this.options.expression) {
            var expressionValue = this._getExpressionValue(this.options.expression, false, undefined);
            if (expressionValue instanceof Error) {
                trace_1.write(expressionValue.message, trace_1.categories.Binding, trace_1.messageType.error);
            }
            else {
                this.updateTarget(expressionValue);
            }
        }
        else {
            if (changedPropertyIndex > -1) {
                var props = sourceProps.slice(changedPropertyIndex + 1);
                var propsLength = props.length;
                if (propsLength > 0) {
                    var value = data.value;
                    for (var i = 0; i < propsLength; i++) {
                        value = value[props[i]];
                    }
                    this.updateTarget(value);
                }
                else if (data.propertyName === this.sourceOptions.property) {
                    this.updateTarget(data.value);
                }
            }
        }
        if (changedPropertyIndex > -1 && changedPropertyIndex < sourcePropsLength - 1) {
            var probablyChangedObject = this.propertyChangeListeners.get(parentProps);
            if (probablyChangedObject &&
                probablyChangedObject !== data.object[sourceProps[changedPropertyIndex]]) {
                for (var i = sourcePropsLength - 1; i > changedPropertyIndex; i--) {
                    var prop = "$" + sourceProps.slice(0, i + 1).join("$");
                    if (this.propertyChangeListeners.has(prop)) {
                        weak_event_listener_1.removeWeakEventListener(this.propertyChangeListeners.get(prop), observable_1.Observable.propertyChangeEvent, this.onSourcePropertyChanged, this);
                        this.propertyChangeListeners.delete(prop);
                    }
                }
                var newProps = sourceProps.slice(changedPropertyIndex + 1);
                var newObject = data.object[sourceProps[changedPropertyIndex]];
                if (!types.isNullOrUndefined(newObject) && typeof newObject === 'object') {
                    this.addPropertyChangeListeners(new WeakRef(newObject), newProps, parentProps);
                }
            }
        }
    };
    Binding.prototype.prepareContextForExpression = function (model, expression, newProps) {
        var parentViewAndIndex;
        var parentView;
        var addedProps = newProps || [];
        if (expression.indexOf(bc.bindingValueKey) > -1) {
            model[bc.bindingValueKey] = model;
            addedProps.push(bc.bindingValueKey);
        }
        if (expression.indexOf(bc.parentValueKey) > -1) {
            parentView = this.getParentView(this.target.get(), bc.parentValueKey).view;
            if (parentView) {
                model[bc.parentValueKey] = parentView.bindingContext;
                addedProps.push(bc.parentValueKey);
            }
        }
        var parentsArray = expression.match(binding_builder_1.parentsRegex);
        if (parentsArray) {
            for (var i = 0; i < parentsArray.length; i++) {
                parentViewAndIndex = this.getParentView(this.target.get(), parentsArray[i]);
                if (parentViewAndIndex.view) {
                    model[bc.parentsValueKey] = model[bc.parentsValueKey] || {};
                    model[bc.parentsValueKey][parentViewAndIndex.index] = parentViewAndIndex.view.bindingContext;
                    addedProps.push(bc.parentsValueKey);
                }
            }
        }
    };
    Binding.prototype.getSourcePropertyValue = function () {
        if (this.options.expression) {
            var changedModel = {};
            changedModel[bc.bindingValueKey] = this.source ? this.source.get() : undefined;
            var expressionValue = this._getExpressionValue(this.options.expression, false, changedModel);
            if (expressionValue instanceof Error) {
                trace_1.write(expressionValue.message, trace_1.categories.Binding, trace_1.messageType.error);
            }
            else {
                return expressionValue;
            }
        }
        if (this.sourceOptions) {
            var sourceOptionsInstance = this.sourceOptions.instance.get();
            if (this.sourceOptions.property === bc.bindingValueKey) {
                return sourceOptionsInstance;
            }
            else if ((sourceOptionsInstance instanceof observable_1.Observable) && (this.sourceOptions.property && this.sourceOptions.property !== "")) {
                return sourceOptionsInstance.get(this.sourceOptions.property);
            }
            else if (sourceOptionsInstance && this.sourceOptions.property && this.sourceOptions.property !== "" &&
                this.sourceOptions.property in sourceOptionsInstance) {
                return sourceOptionsInstance[this.sourceOptions.property];
            }
            else {
                trace_1.write("Property: '" + this.sourceOptions.property + "' is invalid or does not exist. SourceProperty: '" + this.options.sourceProperty + "'", trace_1.categories.Binding, trace_1.messageType.error);
            }
        }
        return null;
    };
    Binding.prototype.clearBinding = function () {
        this.clearSource();
        this.updateTarget(properties_1.unsetValue);
    };
    Binding.prototype.updateTarget = function (value) {
        if (this.updating) {
            return;
        }
        this.updateOptions(this.targetOptions, types.isNullOrUndefined(value) ? properties_1.unsetValue : value);
    };
    Binding.prototype.updateSource = function (value) {
        if (this.updating || !this.source || !this.source.get()) {
            return;
        }
        this.updateOptions(this.sourceOptions, value);
    };
    Binding.prototype.getParentView = function (target, property) {
        if (!target) {
            return { view: null, index: null };
        }
        var result;
        if (property === bc.parentValueKey) {
            result = target.parent;
        }
        var index = null;
        if (property.indexOf(bc.parentsValueKey) === 0) {
            result = target.parent;
            var indexParams = paramsRegex.exec(property);
            if (indexParams && indexParams.length > 1) {
                index = indexParams[2];
            }
            if (!isNaN(index)) {
                var indexAsInt = parseInt(index);
                while (indexAsInt > 0) {
                    result = result.parent;
                    indexAsInt--;
                }
            }
            else if (types.isString(index)) {
                while (result && result.typeName !== index) {
                    result = result.parent;
                }
            }
        }
        return { view: result, index: index };
    };
    Binding.prototype.resolveOptions = function (obj, properties) {
        var objectsAndProperties = this.resolveObjectsAndProperties(obj, properties);
        if (objectsAndProperties.length > 0) {
            var resolvedObj = objectsAndProperties[objectsAndProperties.length - 1].instance;
            var prop = objectsAndProperties[objectsAndProperties.length - 1].property;
            return {
                instance: new WeakRef(this.sourceAsObject(resolvedObj)),
                property: prop
            };
        }
        return null;
    };
    Binding.prototype.updateOptions = function (options, value) {
        var optionsInstance;
        if (options && options.instance) {
            optionsInstance = options.instance.get();
        }
        if (!optionsInstance) {
            return;
        }
        this.updating = true;
        try {
            if (isEventOrGesture(options.property, optionsInstance) &&
                types.isFunction(value)) {
                optionsInstance.off(options.property, null, optionsInstance.bindingContext);
                optionsInstance.on(options.property, value, optionsInstance.bindingContext);
            }
            else if (optionsInstance instanceof observable_1.Observable) {
                optionsInstance.set(options.property, value);
            }
            else {
                optionsInstance[options.property] = value;
            }
        }
        catch (ex) {
            trace_1.write("Binding error while setting property " + options.property + " of " + optionsInstance + ": " + ex, trace_1.categories.Binding, trace_1.messageType.error);
        }
        this.updating = false;
    };
    return Binding;
}());
exports.Binding = Binding;
//# sourceMappingURL=bindable.js.map