function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var label_1 = require("../label");
var layout_base_1 = require("../layouts/layout-base");
var stack_layout_1 = require("../layouts/stack-layout");
var observable_array_1 = require("../../data/observable-array");
var weak_event_listener_1 = require("../core/weak-event-listener");
var builder_1 = require("../builder");
__export(require("../layouts/layout-base"));
var knownTemplates;
(function (knownTemplates) {
    knownTemplates.itemTemplate = "itemTemplate";
})(knownTemplates = exports.knownTemplates || (exports.knownTemplates = {}));
var Repeater = (function (_super) {
    __extends(Repeater, _super);
    function Repeater() {
        var _this = _super.call(this) || this;
        _this._isDirty = false;
        _this.itemsLayout = new stack_layout_1.StackLayout();
        return _this;
    }
    Repeater.prototype.onLoaded = function () {
        if (this._isDirty) {
            this.refresh();
        }
        _super.prototype.onLoaded.call(this);
    };
    Repeater.prototype._requestRefresh = function () {
        this._isDirty = true;
        if (this.isLoaded) {
            this.refresh();
        }
    };
    Repeater.prototype.refresh = function () {
        if (this.itemsLayout) {
            this.itemsLayout.removeChildren();
        }
        if (!this.items) {
            return;
        }
        var length = this.items.length;
        for (var i = 0; i < length; i++) {
            var viewToAdd = this.itemTemplate ? builder_1.parse(this.itemTemplate, this) : this._getDefaultItemContent(i);
            var dataItem = this._getDataItem(i);
            viewToAdd.bindingContext = dataItem;
            this.itemsLayout.addChild(viewToAdd);
        }
        this._isDirty = false;
    };
    Repeater.prototype._onItemsChanged = function (data) {
        this._requestRefresh();
    };
    Repeater.prototype._getDefaultItemContent = function (index) {
        var lbl = new label_1.Label();
        lbl.bind({
            targetProperty: "text",
            sourceProperty: "$value"
        });
        return lbl;
    };
    Repeater.prototype._getDataItem = function (index) {
        var items = this.items;
        return items.getItem ? items.getItem(index) : this.items[index];
    };
    Object.defineProperty(Repeater.prototype, "_childrenCount", {
        get: function () {
            var count = 0;
            if (this.itemsLayout) {
                count++;
            }
            return count;
        },
        enumerable: true,
        configurable: true
    });
    Repeater.prototype.eachChildView = function (callback) {
        if (this.itemsLayout) {
            callback(this.itemsLayout);
        }
    };
    Repeater.prototype.onLayout = function (left, top, right, bottom) {
        layout_base_1.View.layoutChild(this, this.itemsLayout, 0, 0, right - left, bottom - top);
    };
    Repeater.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var result = layout_base_1.View.measureChild(this, this.itemsLayout, widthMeasureSpec, heightMeasureSpec);
        var width = layout_base_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = layout_base_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = layout_base_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = layout_base_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var widthAndState = layout_base_1.View.resolveSizeAndState(result.measuredWidth, width, widthMode, 0);
        var heightAndState = layout_base_1.View.resolveSizeAndState(result.measuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    return Repeater;
}(layout_base_1.CustomLayoutView));
exports.Repeater = Repeater;
exports.itemTemplateProperty = new layout_base_1.Property({
    name: "itemTemplate", affectsLayout: true, valueChanged: function (target) {
        target._requestRefresh();
    }
});
exports.itemTemplateProperty.register(Repeater);
exports.itemsProperty = new layout_base_1.Property({
    name: "items", affectsLayout: true, valueChanged: function (target, oldValue, newValue) {
        if (oldValue instanceof observable_array_1.ObservableArray) {
            weak_event_listener_1.removeWeakEventListener(oldValue, observable_array_1.ObservableArray.changeEvent, target._onItemsChanged, target);
        }
        if (newValue instanceof observable_array_1.ObservableArray) {
            weak_event_listener_1.addWeakEventListener(newValue, observable_array_1.ObservableArray.changeEvent, target._onItemsChanged, target);
        }
        target._requestRefresh();
    }
});
exports.itemsProperty.register(Repeater);
exports.itemsLayoutProperty = new layout_base_1.Property({
    name: "itemsLayout", affectsLayout: true, valueChanged: function (target, oldValue, newValue) {
        if (oldValue) {
            target._removeView(oldValue);
            oldValue.removeChildren();
        }
        if (newValue) {
            target._addView(newValue);
        }
        target._requestRefresh();
    }
});
exports.itemsLayoutProperty.register(Repeater);
//# sourceMappingURL=repeater.js.map