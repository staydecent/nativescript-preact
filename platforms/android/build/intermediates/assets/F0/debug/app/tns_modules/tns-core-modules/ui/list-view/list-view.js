function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var list_view_common_1 = require("./list-view-common");
var stack_layout_1 = require("../layouts/stack-layout");
var proxy_view_container_1 = require("../proxy-view-container");
var layout_base_1 = require("../layouts/layout-base");
__export(require("./list-view-common"));
var ITEMLOADING = list_view_common_1.ListViewBase.itemLoadingEvent;
var LOADMOREITEMS = list_view_common_1.ListViewBase.loadMoreItemsEvent;
var ITEMTAP = list_view_common_1.ListViewBase.itemTapEvent;
var ItemClickListener;
function initializeItemClickListener() {
    if (ItemClickListener) {
        return;
    }
    var ItemClickListenerImpl = (function (_super) {
        __extends(ItemClickListenerImpl, _super);
        function ItemClickListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        ItemClickListenerImpl.prototype.onItemClick = function (parent, convertView, index, id) {
            var owner = this.owner;
            var view = owner._realizedTemplates.get(owner._getItemTemplate(index).key).get(convertView);
            owner.notify({ eventName: ITEMTAP, object: owner, index: index, view: view });
        };
        return ItemClickListenerImpl;
    }(java.lang.Object));
    ItemClickListenerImpl = __decorate([
        Interfaces([android.widget.AdapterView.OnItemClickListener])
    ], ItemClickListenerImpl);
    ItemClickListener = ItemClickListenerImpl;
}
var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._androidViewId = -1;
        _this._realizedItems = new Map();
        _this._realizedTemplates = new Map();
        return _this;
    }
    ListView.prototype.createNativeView = function () {
        initializeItemClickListener();
        var listView = new android.widget.ListView(this._context);
        listView.setDescendantFocusability(android.view.ViewGroup.FOCUS_AFTER_DESCENDANTS);
        this.updateEffectiveRowHeight();
        listView.setCacheColorHint(android.graphics.Color.TRANSPARENT);
        ensureListViewAdapterClass();
        var adapter = new ListViewAdapterClass(this);
        listView.setAdapter(adapter);
        listView.adapter = adapter;
        var itemClickListener = new ItemClickListener(this);
        listView.setOnItemClickListener(itemClickListener);
        listView.itemClickListener = itemClickListener;
        return listView;
    };
    ListView.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeView;
        nativeView.itemClickListener.owner = this;
        var adapter = nativeView.adapter;
        adapter.owner = this;
        nativeView.setAdapter(adapter);
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        nativeView.setId(this._androidViewId);
    };
    ListView.prototype.disposeNativeView = function () {
        var nativeView = this.nativeView;
        nativeView.setAdapter(null);
        nativeView.itemClickListener.owner = null;
        nativeView.adapter.owner = null;
        this.clearRealizedCells();
        _super.prototype.disposeNativeView.call(this);
    };
    ListView.prototype.refresh = function () {
        var nativeView = this.nativeView;
        if (!nativeView || !nativeView.getAdapter()) {
            return;
        }
        this._realizedItems.forEach(function (view, nativeView) {
            if (!(view.bindingContext instanceof list_view_common_1.Observable)) {
                view.bindingContext = null;
            }
        });
        nativeView.getAdapter().notifyDataSetChanged();
    };
    ListView.prototype.scrollToIndex = function (index) {
        var nativeView = this.nativeView;
        if (nativeView) {
            nativeView.setSelection(index);
        }
    };
    Object.defineProperty(ListView.prototype, "_childrenCount", {
        get: function () {
            return this._realizedItems.size;
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.eachChildView = function (callback) {
        this._realizedItems.forEach(function (view, nativeView) {
            if (view.parent instanceof ListView) {
                callback(view);
            }
            else {
                if (view.parent) {
                    callback(view.parent);
                }
            }
        });
    };
    ListView.prototype._dumpRealizedTemplates = function () {
        console.log("Realized Templates:");
        this._realizedTemplates.forEach(function (value, index) {
            console.log("\t" + index + ":");
            value.forEach(function (value, index) {
                console.log("\t\t" + index.hashCode() + ": " + value);
            });
        });
        console.log("Realized Items Size: " + this._realizedItems.size);
    };
    ListView.prototype.clearRealizedCells = function () {
        var _this = this;
        this._realizedItems.forEach(function (view, nativeView) {
            if (view.parent) {
                if (!(view.parent instanceof ListView)) {
                    _this._removeView(view.parent);
                }
                view.parent._removeView(view);
            }
        });
        this._realizedItems.clear();
        this._realizedTemplates.clear();
    };
    ListView.prototype[list_view_common_1.separatorColorProperty.getDefault] = function () {
        var nativeView = this.nativeView;
        return {
            dividerHeight: nativeView.getDividerHeight(),
            divider: nativeView.getDivider()
        };
    };
    ListView.prototype[list_view_common_1.separatorColorProperty.setNative] = function (value) {
        var nativeView = this.nativeView;
        if (value instanceof list_view_common_1.Color) {
            nativeView.setDivider(new android.graphics.drawable.ColorDrawable(value.android));
            nativeView.setDividerHeight(1);
        }
        else {
            nativeView.setDivider(value.divider);
            nativeView.setDividerHeight(value.dividerHeight);
        }
    };
    ListView.prototype[list_view_common_1.itemTemplatesProperty.getDefault] = function () {
        return null;
    };
    ListView.prototype[list_view_common_1.itemTemplatesProperty.setNative] = function (value) {
        this._itemTemplatesInternal = new Array(this._defaultTemplate);
        if (value) {
            this._itemTemplatesInternal = this._itemTemplatesInternal.concat(value);
        }
        this.nativeView.setAdapter(new ListViewAdapterClass(this));
        this.refresh();
    };
    return ListView;
}(list_view_common_1.ListViewBase));
exports.ListView = ListView;
var ListViewAdapterClass;
function ensureListViewAdapterClass() {
    if (ListViewAdapterClass) {
        return;
    }
    var ListViewAdapter = (function (_super) {
        __extends(ListViewAdapter, _super);
        function ListViewAdapter(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        ListViewAdapter.prototype.getCount = function () {
            return this.owner && this.owner.items && this.owner.items.length ? this.owner.items.length : 0;
        };
        ListViewAdapter.prototype.getItem = function (i) {
            if (this.owner && this.owner.items && i < this.owner.items.length) {
                var getItem = this.owner.items.getItem;
                return getItem ? getItem(i) : this.owner.items[i];
            }
            return null;
        };
        ListViewAdapter.prototype.getItemId = function (i) {
            return long(i);
        };
        ListViewAdapter.prototype.hasStableIds = function () {
            return true;
        };
        ListViewAdapter.prototype.getViewTypeCount = function () {
            return this.owner._itemTemplatesInternal.length;
        };
        ListViewAdapter.prototype.getItemViewType = function (index) {
            var template = this.owner._getItemTemplate(index);
            var itemViewType = this.owner._itemTemplatesInternal.indexOf(template);
            return itemViewType;
        };
        ListViewAdapter.prototype.getView = function (index, convertView, parent) {
            if (!this.owner) {
                return null;
            }
            var totalItemCount = this.owner.items ? this.owner.items.length : 0;
            if (index === (totalItemCount - 1)) {
                this.owner.notify({ eventName: LOADMOREITEMS, object: this.owner });
            }
            var template = this.owner._getItemTemplate(index);
            var view;
            if (convertView) {
                view = this.owner._realizedTemplates.get(template.key).get(convertView);
                if (!view) {
                    throw new Error("There is no entry with key '" + convertView + "' in the realized views cache for template with key'" + template.key + "'.");
                }
            }
            else {
                view = template.createView();
            }
            var args = {
                eventName: ITEMLOADING, object: this.owner, index: index, view: view,
                android: parent,
                ios: undefined
            };
            this.owner.notify(args);
            if (!args.view) {
                args.view = this.owner._getDefaultItemContent(index);
            }
            if (args.view) {
                if (this.owner._effectiveRowHeight > -1) {
                    args.view.height = this.owner.rowHeight;
                }
                else {
                    args.view.height = list_view_common_1.unsetValue;
                }
                this.owner._prepareItem(args.view, index);
                if (!args.view.parent) {
                    if (args.view instanceof layout_base_1.LayoutBase &&
                        !(args.view instanceof proxy_view_container_1.ProxyViewContainer)) {
                        this.owner._addView(args.view);
                        convertView = args.view.nativeView;
                    }
                    else {
                        var sp = new stack_layout_1.StackLayout();
                        sp.addChild(args.view);
                        this.owner._addView(sp);
                        convertView = sp.nativeView;
                    }
                }
                var realizedItemsForTemplateKey = this.owner._realizedTemplates.get(template.key);
                if (!realizedItemsForTemplateKey) {
                    realizedItemsForTemplateKey = new Map();
                    this.owner._realizedTemplates.set(template.key, realizedItemsForTemplateKey);
                }
                realizedItemsForTemplateKey.set(convertView, args.view);
                this.owner._realizedItems.set(convertView, args.view);
            }
            return convertView;
        };
        return ListViewAdapter;
    }(android.widget.BaseAdapter));
    ListViewAdapterClass = ListViewAdapter;
}
//# sourceMappingURL=list-view.js.map