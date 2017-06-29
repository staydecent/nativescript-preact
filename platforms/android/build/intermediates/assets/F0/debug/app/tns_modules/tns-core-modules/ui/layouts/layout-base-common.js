function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
__export(require("../core/view"));
var LayoutBaseCommon = (function (_super) {
    __extends(LayoutBaseCommon, _super);
    function LayoutBaseCommon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._subViews = new Array();
        return _this;
    }
    LayoutBaseCommon.prototype._addChildFromBuilder = function (name, value) {
        if (value instanceof view_1.View) {
            this.addChild(value);
        }
    };
    LayoutBaseCommon.prototype.getChildrenCount = function () {
        return this._subViews.length;
    };
    Object.defineProperty(LayoutBaseCommon.prototype, "_childrenCount", {
        get: function () {
            return this._subViews.length;
        },
        enumerable: true,
        configurable: true
    });
    LayoutBaseCommon.prototype.getChildAt = function (index) {
        return this._subViews[index];
    };
    LayoutBaseCommon.prototype.getChildIndex = function (child) {
        return this._subViews.indexOf(child);
    };
    LayoutBaseCommon.prototype.getChildById = function (id) {
        return view_1.getViewById(this, id);
    };
    LayoutBaseCommon.prototype._registerLayoutChild = function (child) {
    };
    LayoutBaseCommon.prototype._unregisterLayoutChild = function (child) {
    };
    LayoutBaseCommon.prototype.addChild = function (child) {
        this._subViews.push(child);
        this._addView(child);
        this._registerLayoutChild(child);
    };
    LayoutBaseCommon.prototype.insertChild = function (child, atIndex) {
        this._subViews.splice(atIndex, 0, child);
        this._addView(child, atIndex);
        this._registerLayoutChild(child);
    };
    LayoutBaseCommon.prototype.removeChild = function (child) {
        this._removeView(child);
        var index = this._subViews.indexOf(child);
        this._subViews.splice(index, 1);
        this._unregisterLayoutChild(child);
    };
    LayoutBaseCommon.prototype.removeChildren = function () {
        while (this.getChildrenCount() !== 0) {
            this.removeChild(this._subViews[this.getChildrenCount() - 1]);
        }
    };
    Object.defineProperty(LayoutBaseCommon.prototype, "padding", {
        get: function () {
            return this.style.padding;
        },
        set: function (value) {
            this.style.padding = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBaseCommon.prototype, "paddingTop", {
        get: function () {
            return this.style.paddingTop;
        },
        set: function (value) {
            this.style.paddingTop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBaseCommon.prototype, "paddingRight", {
        get: function () {
            return this.style.paddingRight;
        },
        set: function (value) {
            this.style.paddingRight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBaseCommon.prototype, "paddingBottom", {
        get: function () {
            return this.style.paddingBottom;
        },
        set: function (value) {
            this.style.paddingBottom = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBaseCommon.prototype, "paddingLeft", {
        get: function () {
            return this.style.paddingLeft;
        },
        set: function (value) {
            this.style.paddingLeft = value;
        },
        enumerable: true,
        configurable: true
    });
    LayoutBaseCommon.prototype._childIndexToNativeChildIndex = function (index) {
        if (index === undefined) {
            return undefined;
        }
        var result = 0;
        for (var i = 0; i < index && i < this._subViews.length; i++) {
            result += this._subViews[i]._getNativeViewsCount();
        }
        return result;
    };
    LayoutBaseCommon.prototype.eachChildView = function (callback) {
        for (var i = 0, length_1 = this._subViews.length; i < length_1; i++) {
            var retVal = callback(this._subViews[i]);
            if (retVal === false) {
                break;
            }
        }
    };
    LayoutBaseCommon.prototype.eachLayoutChild = function (callback) {
        var lastChild = null;
        this.eachChildView(function (cv) {
            cv._eachLayoutView(function (lv) {
                if (lastChild && !lastChild.isCollapsed) {
                    callback(lastChild, false);
                }
                lastChild = lv;
            });
            return true;
        });
        if (lastChild && !lastChild.isCollapsed) {
            callback(lastChild, true);
        }
    };
    return LayoutBaseCommon;
}(view_1.CustomLayoutView));
exports.LayoutBaseCommon = LayoutBaseCommon;
exports.clipToBoundsProperty = new view_1.Property({ name: "clipToBounds", defaultValue: true, valueConverter: view_1.booleanConverter });
exports.clipToBoundsProperty.register(LayoutBaseCommon);
//# sourceMappingURL=layout-base-common.js.map