function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
__export(require("../core/view"));
var knownCollections;
(function (knownCollections) {
    knownCollections.items = "items";
})(knownCollections = exports.knownCollections || (exports.knownCollections = {}));
var SegmentedBarItemBase = (function (_super) {
    __extends(SegmentedBarItemBase, _super);
    function SegmentedBarItemBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._title = "";
        return _this;
    }
    Object.defineProperty(SegmentedBarItemBase.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            var strValue = (value !== null && value !== undefined) ? value.toString() : "";
            if (this._title !== strValue) {
                this._title = strValue;
                this._update();
            }
        },
        enumerable: true,
        configurable: true
    });
    return SegmentedBarItemBase;
}(view_1.ViewBase));
exports.SegmentedBarItemBase = SegmentedBarItemBase;
var SegmentedBarBase = (function (_super) {
    __extends(SegmentedBarBase, _super);
    function SegmentedBarBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SegmentedBarBase.prototype, "selectedBackgroundColor", {
        get: function () {
            return this.style.selectedBackgroundColor;
        },
        set: function (value) {
            this.style.selectedBackgroundColor = value;
        },
        enumerable: true,
        configurable: true
    });
    SegmentedBarBase.prototype._addArrayFromBuilder = function (name, value) {
        if (name === "items") {
            this.items = value;
        }
    };
    SegmentedBarBase.prototype._addChildFromBuilder = function (name, value) {
        if (name === "SegmentedBarItem") {
            var item = value;
            var items = this.items;
            if (!items) {
                items = new Array();
                items.push(item);
                this.items = items;
            }
            else {
                items.push(item);
                this._addView(item);
            }
            if (this.nativeView) {
                this[exports.itemsProperty.setNative](items);
            }
        }
    };
    SegmentedBarBase.prototype.onItemsChanged = function (oldItems, newItems) {
        if (oldItems) {
            for (var i = 0, count = oldItems.length; i < count; i++) {
                this._removeView(oldItems[i]);
            }
        }
        if (newItems) {
            for (var i = 0, count = newItems.length; i < count; i++) {
                this._addView(newItems[i]);
            }
        }
    };
    SegmentedBarBase.prototype.eachChild = function (callback) {
        var items = this.items;
        if (items) {
            items.forEach(function (item, i) {
                callback(item);
            });
        }
    };
    return SegmentedBarBase;
}(view_1.View));
SegmentedBarBase.selectedIndexChangedEvent = "selectedIndexChanged";
exports.SegmentedBarBase = SegmentedBarBase;
exports.selectedIndexProperty = new view_1.CoercibleProperty({
    name: "selectedIndex", defaultValue: -1,
    valueChanged: function (target, oldValue, newValue) {
        target.notify({ eventName: SegmentedBarBase.selectedIndexChangedEvent, object: target, oldIndex: oldValue, newIndex: newValue });
    },
    coerceValue: function (target, value) {
        var items = target.items;
        if (items) {
            var max = items.length - 1;
            if (value < 0) {
                value = 0;
            }
            if (value > max) {
                value = max;
            }
        }
        else {
            value = -1;
        }
        return value;
    },
    valueConverter: function (v) { return parseInt(v); }
});
exports.selectedIndexProperty.register(SegmentedBarBase);
exports.itemsProperty = new view_1.Property({
    name: "items", valueChanged: function (target, oldValue, newValue) {
        target.onItemsChanged(oldValue, newValue);
    }
});
exports.itemsProperty.register(SegmentedBarBase);
exports.selectedBackgroundColorProperty = new view_1.InheritedCssProperty({ name: "selectedBackgroundColor", cssName: "selected-background-color", equalityComparer: view_1.Color.equals, valueConverter: function (v) { return new view_1.Color(v); } });
exports.selectedBackgroundColorProperty.register(view_1.Style);
//# sourceMappingURL=segmented-bar-common.js.map