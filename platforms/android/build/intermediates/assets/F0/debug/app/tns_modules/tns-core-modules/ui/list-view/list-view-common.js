function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
var builder_1 = require("../builder");
var label_1 = require("../label");
var observable_array_1 = require("../../data/observable-array");
var weak_event_listener_1 = require("../core/weak-event-listener");
__export(require("../core/view"));
var knownTemplates;
(function (knownTemplates) {
    knownTemplates.itemTemplate = "itemTemplate";
})(knownTemplates = exports.knownTemplates || (exports.knownTemplates = {}));
var knownMultiTemplates;
(function (knownMultiTemplates) {
    knownMultiTemplates.itemTemplates = "itemTemplates";
})(knownMultiTemplates = exports.knownMultiTemplates || (exports.knownMultiTemplates = {}));
var autoEffectiveRowHeight = -1;
var ListViewBase = (function (_super) {
    __extends(ListViewBase, _super);
    function ListViewBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._itemTemplateSelectorBindable = new label_1.Label();
        _this._defaultTemplate = {
            key: "default",
            createView: function () {
                if (_this.itemTemplate) {
                    return builder_1.parse(_this.itemTemplate, _this);
                }
                return undefined;
            }
        };
        _this._itemTemplatesInternal = new Array(_this._defaultTemplate);
        _this._effectiveRowHeight = autoEffectiveRowHeight;
        return _this;
    }
    Object.defineProperty(ListViewBase.prototype, "separatorColor", {
        get: function () {
            return this.style.separatorColor;
        },
        set: function (value) {
            this.style.separatorColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListViewBase.prototype, "itemTemplateSelector", {
        get: function () {
            return this._itemTemplateSelector;
        },
        set: function (value) {
            var _this = this;
            if (typeof value === "string") {
                this._itemTemplateSelectorBindable.bind({
                    sourceProperty: null,
                    targetProperty: "templateKey",
                    expression: value
                });
                this._itemTemplateSelector = function (item, index, items) {
                    item["$index"] = index;
                    _this._itemTemplateSelectorBindable.bindingContext = item;
                    return _this._itemTemplateSelectorBindable.get("templateKey");
                };
            }
            else if (typeof value === "function") {
                this._itemTemplateSelector = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    ListViewBase.prototype.refresh = function () {
    };
    ListViewBase.prototype.scrollToIndex = function (index) {
    };
    ListViewBase.prototype._getItemTemplate = function (index) {
        var templateKey = "default";
        if (this.itemTemplateSelector) {
            var dataItem = this._getDataItem(index);
            templateKey = this._itemTemplateSelector(dataItem, index, this.items);
        }
        for (var i = 0, length_1 = this._itemTemplatesInternal.length; i < length_1; i++) {
            if (this._itemTemplatesInternal[i].key === templateKey) {
                return this._itemTemplatesInternal[i];
            }
        }
        return this._itemTemplatesInternal[0];
    };
    ListViewBase.prototype._prepareItem = function (item, index) {
        if (item) {
            item.bindingContext = this._getDataItem(index);
        }
    };
    ListViewBase.prototype._getDataItem = function (index) {
        var thisItems = this.items;
        return thisItems.getItem ? thisItems.getItem(index) : thisItems[index];
    };
    ListViewBase.prototype._getDefaultItemContent = function (index) {
        var lbl = new label_1.Label();
        lbl.bind({
            targetProperty: "text",
            sourceProperty: "$value"
        });
        return lbl;
    };
    ListViewBase.prototype._onItemsChanged = function (args) {
        this.refresh();
    };
    ListViewBase.prototype._onRowHeightPropertyChanged = function (oldValue, newValue) {
        this.refresh();
    };
    ListViewBase.prototype.updateEffectiveRowHeight = function () {
        exports.rowHeightProperty.coerce(this);
    };
    return ListViewBase;
}(view_1.View));
ListViewBase.itemLoadingEvent = "itemLoading";
ListViewBase.itemTapEvent = "itemTap";
ListViewBase.loadMoreItemsEvent = "loadMoreItems";
ListViewBase.knownFunctions = ["itemTemplateSelector"];
exports.ListViewBase = ListViewBase;
exports.itemsProperty = new view_1.Property({
    name: "items", valueChanged: function (target, oldValue, newValue) {
        if (oldValue instanceof view_1.Observable) {
            weak_event_listener_1.removeWeakEventListener(oldValue, observable_array_1.ObservableArray.changeEvent, target._onItemsChanged, target);
        }
        if (newValue instanceof view_1.Observable) {
            weak_event_listener_1.addWeakEventListener(newValue, observable_array_1.ObservableArray.changeEvent, target._onItemsChanged, target);
        }
        target.refresh();
    }
});
exports.itemsProperty.register(ListViewBase);
exports.itemTemplateProperty = new view_1.Property({
    name: "itemTemplate", valueChanged: function (target) {
        target.refresh();
    }
});
exports.itemTemplateProperty.register(ListViewBase);
exports.itemTemplatesProperty = new view_1.Property({
    name: "itemTemplates", valueConverter: function (value) {
        if (typeof value === "string") {
            return builder_1.parseMultipleTemplates(value);
        }
        return value;
    }
});
exports.itemTemplatesProperty.register(ListViewBase);
var defaultRowHeight = "auto";
exports.rowHeightProperty = new view_1.CoercibleProperty({
    name: "rowHeight", defaultValue: defaultRowHeight, equalityComparer: view_1.Length.equals,
    coerceValue: function (target, value) {
        return target.nativeView ? value : defaultRowHeight;
    },
    valueChanged: function (target, oldValue, newValue) {
        target._effectiveRowHeight = view_1.Length.toDevicePixels(newValue, autoEffectiveRowHeight);
        target._onRowHeightPropertyChanged(oldValue, newValue);
    }, valueConverter: view_1.Length.parse
});
exports.rowHeightProperty.register(ListViewBase);
exports.separatorColorProperty = new view_1.CssProperty({ name: "separatorColor", cssName: "separator-color", equalityComparer: view_1.Color.equals, valueConverter: function (v) { return new view_1.Color(v); } });
exports.separatorColorProperty.register(view_1.Style);
//# sourceMappingURL=list-view-common.js.map