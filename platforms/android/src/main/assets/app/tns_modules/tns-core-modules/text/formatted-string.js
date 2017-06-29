Object.defineProperty(exports, "__esModule", { value: true });
var span_1 = require("./span");
exports.Span = span_1.Span;
var observable_1 = require("../data/observable");
var observable_array_1 = require("../data/observable-array");
var view_1 = require("../ui/core/view");
var knownCollections;
(function (knownCollections) {
    knownCollections.spans = "spans";
})(knownCollections = exports.knownCollections || (exports.knownCollections = {}));
var CHILD_SPAN = "Span";
var FormattedString = (function (_super) {
    __extends(FormattedString, _super);
    function FormattedString() {
        var _this = _super.call(this) || this;
        _this._spans = new observable_array_1.ObservableArray();
        _this._spans.addEventListener(observable_array_1.ObservableArray.changeEvent, _this.onSpansCollectionChanged, _this);
        return _this;
    }
    Object.defineProperty(FormattedString.prototype, "fontFamily", {
        get: function () {
            return this.style.fontFamily;
        },
        set: function (value) {
            this.style.fontFamily = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormattedString.prototype, "fontSize", {
        get: function () {
            return this.style.fontSize;
        },
        set: function (value) {
            this.style.fontSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormattedString.prototype, "fontStyle", {
        get: function () {
            return this.style.fontStyle;
        },
        set: function (value) {
            this.style.fontStyle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormattedString.prototype, "fontWeight", {
        get: function () {
            return this.style.fontWeight;
        },
        set: function (value) {
            this.style.fontWeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormattedString.prototype, "textDecoration", {
        get: function () {
            return this.style.textDecoration;
        },
        set: function (value) {
            this.style.textDecoration = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormattedString.prototype, "color", {
        get: function () {
            return this.style.color;
        },
        set: function (value) {
            this.style.color = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormattedString.prototype, "backgroundColor", {
        get: function () {
            return this.style.backgroundColor;
        },
        set: function (value) {
            this.style.backgroundColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormattedString.prototype, "spans", {
        get: function () {
            if (!this._spans) {
                this._spans = new observable_array_1.ObservableArray();
            }
            return this._spans;
        },
        enumerable: true,
        configurable: true
    });
    FormattedString.prototype.toString = function () {
        var result = "";
        for (var i = 0, length_1 = this._spans.length; i < length_1; i++) {
            result += this._spans.getItem(i).text;
        }
        return result;
    };
    FormattedString.prototype._addArrayFromBuilder = function (name, value) {
        if (name === knownCollections.spans) {
            this.spans.push(value);
        }
    };
    FormattedString.prototype._addChildFromBuilder = function (name, value) {
        if (name === CHILD_SPAN) {
            this.spans.push(value);
        }
    };
    FormattedString.prototype.onSpansCollectionChanged = function (eventData) {
        if (eventData.addedCount > 0) {
            for (var i = 0; i < eventData.addedCount; i++) {
                var span = eventData.object.getItem(eventData.index + i);
                this._addView(span);
                this.addPropertyChangeHandler(span);
            }
        }
        if (eventData.removed && eventData.removed.length > 0) {
            for (var p = 0; p < eventData.removed.length; p++) {
                var span = eventData.removed[p];
                this.removePropertyChangeHandler(span);
                this._removeView(span);
            }
        }
        this.notifyPropertyChange('.', this);
    };
    FormattedString.prototype.addPropertyChangeHandler = function (span) {
        var style = span.style;
        span.on(observable_1.Observable.propertyChangeEvent, this.onPropertyChange, this);
        style.on("fontFamilyChange", this.onPropertyChange, this);
        style.on("fontSizeChange", this.onPropertyChange, this);
        style.on("fontStyleChange", this.onPropertyChange, this);
        style.on("fontWeightChange", this.onPropertyChange, this);
        style.on("textDecorationChange", this.onPropertyChange, this);
        style.on("colorChange", this.onPropertyChange, this);
        style.on("backgroundColorChange", this.onPropertyChange, this);
    };
    FormattedString.prototype.removePropertyChangeHandler = function (span) {
        var style = span.style;
        span.off(observable_1.Observable.propertyChangeEvent, this.onPropertyChange, this);
        style.off("fontFamilyChange", this.onPropertyChange, this);
        style.off("fontSizeChange", this.onPropertyChange, this);
        style.off("fontStyleChange", this.onPropertyChange, this);
        style.off("fontWeightChange", this.onPropertyChange, this);
        style.off("textDecorationChange", this.onPropertyChange, this);
        style.off("colorChange", this.onPropertyChange, this);
        style.off("backgroundColorChange", this.onPropertyChange, this);
    };
    FormattedString.prototype.onPropertyChange = function (data) {
        this.notifyPropertyChange(data.propertyName, this);
    };
    FormattedString.prototype.eachChild = function (callback) {
        this.spans.forEach(function (v, i, arr) { return callback(v); });
    };
    return FormattedString;
}(view_1.ViewBase));
exports.FormattedString = FormattedString;
//# sourceMappingURL=formatted-string.js.map