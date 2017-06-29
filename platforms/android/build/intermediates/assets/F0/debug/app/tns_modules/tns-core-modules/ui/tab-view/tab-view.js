function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var font_1 = require("../styling/font");
var tab_view_common_1 = require("./tab-view-common");
var text_base_1 = require("../text-base");
var image_source_1 = require("../../image-source");
var utils_1 = require("../../utils/utils");
__export(require("./tab-view-common"));
var VIEWS_STATES = "_viewStates";
var ACCENT_COLOR = "colorAccent";
var PRIMARY_COLOR = "colorPrimary";
var DEFAULT_ELEVATION = 4;
var PagerAdapter;
var PageChangedListener;
function initializeNativeClasses() {
    if (PagerAdapter) {
        return;
    }
    var PagerAdapterImpl = (function (_super) {
        __extends(PagerAdapterImpl, _super);
        function PagerAdapterImpl(owner, items) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            _this.items = items;
            return global.__native(_this);
        }
        PagerAdapterImpl.prototype.getCount = function () {
            return this.items ? this.items.length : 0;
        };
        PagerAdapterImpl.prototype.getPageTitle = function (index) {
            if (index < 0 || index >= this.items.length) {
                return "";
            }
            return this.items[index].title;
        };
        PagerAdapterImpl.prototype.instantiateItem = function (container, index) {
            if (tab_view_common_1.traceEnabled()) {
                tab_view_common_1.traceWrite("TabView.PagerAdapter.instantiateItem; container: " + container + "; index: " + index, tab_view_common_1.traceCategory);
            }
            var item = this.items[index];
            if (this[VIEWS_STATES]) {
                if (tab_view_common_1.traceEnabled()) {
                    tab_view_common_1.traceWrite("TabView.PagerAdapter.instantiateItem; restoreHierarchyState: " + item.view, tab_view_common_1.traceCategory);
                }
                item.view.nativeView.restoreHierarchyState(this[VIEWS_STATES]);
            }
            if (item.view.nativeView) {
                container.addView(item.view.nativeView);
            }
            return item.view.nativeView;
        };
        PagerAdapterImpl.prototype.destroyItem = function (container, index, _object) {
            if (tab_view_common_1.traceEnabled()) {
                tab_view_common_1.traceWrite("TabView.PagerAdapter.destroyItem; container: " + container + "; index: " + index + "; _object: " + _object, tab_view_common_1.traceCategory);
            }
            var item = this.items[index];
            var nativeView = item.view.nativeView;
            if (!nativeView || !_object) {
                return;
            }
            if (nativeView.toString() !== _object.toString()) {
                throw new Error("Expected " + nativeView.toString() + " to equal " + _object.toString());
            }
            container.removeView(nativeView);
        };
        PagerAdapterImpl.prototype.isViewFromObject = function (view, _object) {
            return view === _object;
        };
        PagerAdapterImpl.prototype.saveState = function () {
            if (tab_view_common_1.traceEnabled()) {
                tab_view_common_1.traceWrite("TabView.PagerAdapter.saveState", tab_view_common_1.traceCategory);
            }
            var owner = this.owner;
            if (owner._childrenCount === 0) {
                return null;
            }
            if (!this[VIEWS_STATES]) {
                this[VIEWS_STATES] = new android.util.SparseArray();
            }
            var viewStates = this[VIEWS_STATES];
            var childCallback = function (view) {
                var nativeView = view.nativeView;
                if (nativeView && nativeView.isSaveFromParentEnabled && nativeView.isSaveFromParentEnabled()) {
                    nativeView.saveHierarchyState(viewStates);
                }
                return true;
            };
            owner.eachChildView(childCallback);
            var bundle = new android.os.Bundle();
            bundle.putSparseParcelableArray(VIEWS_STATES, viewStates);
            return bundle;
        };
        PagerAdapterImpl.prototype.restoreState = function (state, loader) {
            if (tab_view_common_1.traceEnabled()) {
                tab_view_common_1.traceWrite("TabView.PagerAdapter.restoreState", tab_view_common_1.traceCategory);
            }
            var bundle = state;
            bundle.setClassLoader(loader);
            this[VIEWS_STATES] = bundle.getSparseParcelableArray(VIEWS_STATES);
        };
        return PagerAdapterImpl;
    }(android.support.v4.view.PagerAdapter));
    ;
    var PageChangedListenerImpl = (function (_super) {
        __extends(PageChangedListenerImpl, _super);
        function PageChangedListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this._owner = owner;
            return global.__native(_this);
        }
        PageChangedListenerImpl.prototype.onPageSelected = function (position) {
            this._owner.selectedIndex = position;
        };
        return PageChangedListenerImpl;
    }(android.support.v4.view.ViewPager.SimpleOnPageChangeListener));
    PagerAdapter = PagerAdapterImpl;
    PageChangedListener = PageChangedListenerImpl;
}
function createTabItemSpec(item) {
    var result = new org.nativescript.widgets.TabItemSpec();
    result.title = item.title;
    if (item.iconSource) {
        if (item.iconSource.indexOf(utils_1.RESOURCE_PREFIX) === 0) {
            result.iconId = utils_1.ad.resources.getDrawableId(item.iconSource.substr(utils_1.RESOURCE_PREFIX.length));
        }
        else {
            var is = image_source_1.fromFileOrResource(item.iconSource);
            if (is) {
                result.iconDrawable = new android.graphics.drawable.BitmapDrawable(is.android);
            }
        }
    }
    return result;
}
var defaultAccentColor = undefined;
function getDefaultAccentColor(context) {
    if (defaultAccentColor === undefined) {
        defaultAccentColor = utils_1.ad.resources.getPalleteColor(ACCENT_COLOR, context) || 0xFF33B5E5;
    }
    return defaultAccentColor;
}
var TabViewItem = (function (_super) {
    __extends(TabViewItem, _super);
    function TabViewItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabViewItem.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        if (this.nativeView) {
            this._defaultTransformationMethod = this.nativeView.getTransformationMethod();
        }
    };
    TabViewItem.prototype.resetNativeView = function () {
        _super.prototype.resetNativeView.call(this);
        if (this.nativeView) {
            this.nativeView.setTransformationMethod(this._defaultTransformationMethod);
        }
    };
    TabViewItem.prototype.createNativeView = function () {
        return this.nativeView;
    };
    TabViewItem.prototype.setNativeView = function (textView) {
        this.nativeView = textView;
        if (textView) {
            tab_view_common_1.initNativeView(this);
        }
    };
    TabViewItem.prototype._update = function () {
        var tv = this.nativeView;
        if (tv) {
            var tabLayout = tv.getParent();
            tabLayout.updateItemAt(this.index, this.tabItemSpec);
        }
    };
    TabViewItem.prototype[tab_view_common_1.fontSizeProperty.getDefault] = function () {
        return { nativeSize: this.nativeView.getTextSize() };
    };
    TabViewItem.prototype[tab_view_common_1.fontSizeProperty.setNative] = function (value) {
        if (typeof value === "number") {
            this.nativeView.setTextSize(value);
        }
        else {
            this.nativeView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
        }
    };
    TabViewItem.prototype[tab_view_common_1.fontInternalProperty.getDefault] = function () {
        return this.nativeView.getTypeface();
    };
    TabViewItem.prototype[tab_view_common_1.fontInternalProperty.setNative] = function (value) {
        this.nativeView.setTypeface(value instanceof font_1.Font ? value.getAndroidTypeface() : value);
    };
    TabViewItem.prototype[text_base_1.textTransformProperty.getDefault] = function () {
        return "default";
    };
    TabViewItem.prototype[text_base_1.textTransformProperty.setNative] = function (value) {
        var tv = this.nativeView;
        if (value === "default") {
            tv.setTransformationMethod(this._defaultTransformationMethod);
            tv.setText(this.title);
        }
        else {
            var result = text_base_1.getTransformedText(this.title, value);
            tv.setText(result);
            tv.setTransformationMethod(null);
        }
    };
    return TabViewItem;
}(tab_view_common_1.TabViewItemBase));
exports.TabViewItem = TabViewItem;
function setElevation(grid, tabLayout) {
    var compat = android.support.v4.view.ViewCompat;
    if (compat.setElevation) {
        var val = DEFAULT_ELEVATION * tab_view_common_1.layout.getDisplayDensity();
        compat.setElevation(grid, val);
        compat.setElevation(tabLayout, val);
    }
}
var TabView = (function (_super) {
    __extends(TabView, _super);
    function TabView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._androidViewId = -1;
        return _this;
    }
    TabView.prototype.onItemsChanged = function (oldItems, newItems) {
        _super.prototype.onItemsChanged.call(this, oldItems, newItems);
        if (oldItems) {
            oldItems.forEach(function (item, i, arr) {
                item.index = 0;
                item.tabItemSpec = null;
                item.setNativeView(null);
            });
        }
    };
    TabView.prototype.createNativeView = function () {
        initializeNativeClasses();
        if (tab_view_common_1.traceEnabled()) {
            tab_view_common_1.traceWrite("TabView._createUI(" + this + ");", tab_view_common_1.traceCategory);
        }
        var context = this._context;
        var nativeView = new org.nativescript.widgets.GridLayout(context);
        nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
        nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
        var tabLayout = new org.nativescript.widgets.TabLayout(context);
        nativeView.addView(tabLayout);
        nativeView.tabLayout = tabLayout;
        setElevation(nativeView, tabLayout);
        var accentColor = getDefaultAccentColor(context);
        if (accentColor) {
            tabLayout.setSelectedIndicatorColors([accentColor]);
        }
        var primaryColor = utils_1.ad.resources.getPalleteColor(PRIMARY_COLOR, context);
        if (primaryColor) {
            tabLayout.setBackgroundColor(primaryColor);
        }
        var viewPager = new android.support.v4.view.ViewPager(context);
        var lp = new org.nativescript.widgets.CommonLayoutParams();
        lp.row = 1;
        viewPager.setLayoutParams(lp);
        nativeView.addView(viewPager);
        nativeView.viewPager = viewPager;
        var listener = new PageChangedListener(this);
        viewPager.addOnPageChangeListener(listener);
        viewPager.listener = listener;
        var adapter = new PagerAdapter(this, null);
        viewPager.setAdapter(adapter);
        viewPager.adapter = adapter;
        return nativeView;
    };
    TabView.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        var nativeView = this.nativeView;
        this._tabLayout = nativeView.tabLayout;
        var viewPager = nativeView.viewPager;
        viewPager.setId(this._androidViewId);
        this._viewPager = viewPager;
        viewPager.listener.owner = this;
        this._pagerAdapter = viewPager.adapter;
        this._pagerAdapter.owner = this;
    };
    TabView.prototype.disposeNativeView = function () {
        this._pagerAdapter.notifyDataSetChanged();
        this._pagerAdapter.owner = null;
        this._pagerAdapter = null;
        this._tabLayout = null;
        this._viewPager.listener.owner = null;
        this._viewPager = null;
        _super.prototype.disposeNativeView.call(this);
    };
    TabView.prototype.setAdapterItems = function (items) {
        this._pagerAdapter.items = items;
        var length = items ? items.length : 0;
        if (length === 0) {
            this._tabLayout.setItems(null, null);
            return;
        }
        var tabItems = new Array();
        items.forEach(function (item, i, arr) {
            var tabItemSpec = createTabItemSpec(item);
            item.index = i;
            item.tabItemSpec = tabItemSpec;
            tabItems.push(tabItemSpec);
        });
        var tabLayout = this._tabLayout;
        tabLayout.setItems(tabItems, this._viewPager);
        items.forEach(function (item, i, arr) {
            var tv = tabLayout.getTextViewForItemAt(i);
            item.setNativeView(tv);
        });
        this._pagerAdapter.notifyDataSetChanged();
    };
    TabView.prototype[tab_view_common_1.androidOffscreenTabLimitProperty.getDefault] = function () {
        return this._viewPager.getOffscreenPageLimit();
    };
    TabView.prototype[tab_view_common_1.androidOffscreenTabLimitProperty.setNative] = function (value) {
        this._viewPager.setOffscreenPageLimit(value);
    };
    TabView.prototype[tab_view_common_1.selectedIndexProperty.getDefault] = function () {
        return -1;
    };
    TabView.prototype[tab_view_common_1.selectedIndexProperty.setNative] = function (value) {
        if (tab_view_common_1.traceEnabled()) {
            tab_view_common_1.traceWrite("TabView this._viewPager.setCurrentItem(" + value + ", true);", tab_view_common_1.traceCategory);
        }
        this._viewPager.setCurrentItem(value, true);
    };
    TabView.prototype[tab_view_common_1.itemsProperty.getDefault] = function () {
        return null;
    };
    TabView.prototype[tab_view_common_1.itemsProperty.setNative] = function (value) {
        this.setAdapterItems(value);
        tab_view_common_1.selectedIndexProperty.coerce(this);
    };
    TabView.prototype[tab_view_common_1.tabBackgroundColorProperty.getDefault] = function () {
        return this._tabLayout.getBackground().getConstantState();
    };
    TabView.prototype[tab_view_common_1.tabBackgroundColorProperty.setNative] = function (value) {
        if (value instanceof tab_view_common_1.Color) {
            this._tabLayout.setBackgroundColor(value.android);
        }
        else {
            this._tabLayout.setBackground(value ? value.newDrawable() : null);
        }
    };
    TabView.prototype[tab_view_common_1.tabTextColorProperty.getDefault] = function () {
        return this._tabLayout.getTabTextColor();
    };
    TabView.prototype[tab_view_common_1.tabTextColorProperty.setNative] = function (value) {
        var color = value instanceof tab_view_common_1.Color ? value.android : value;
        this._tabLayout.setTabTextColor(color);
    };
    TabView.prototype[tab_view_common_1.selectedTabTextColorProperty.getDefault] = function () {
        return this._tabLayout.getSelectedTabTextColor();
    };
    TabView.prototype[tab_view_common_1.selectedTabTextColorProperty.setNative] = function (value) {
        var color = value instanceof tab_view_common_1.Color ? value.android : value;
        this._tabLayout.setSelectedTabTextColor(color);
    };
    TabView.prototype[tab_view_common_1.androidSelectedTabHighlightColorProperty.getDefault] = function () {
        return getDefaultAccentColor(this._context);
    };
    TabView.prototype[tab_view_common_1.androidSelectedTabHighlightColorProperty.setNative] = function (value) {
        var tabLayout = this._tabLayout;
        var color = value instanceof tab_view_common_1.Color ? value.android : value;
        tabLayout.setSelectedIndicatorColors([color]);
    };
    return TabView;
}(tab_view_common_1.TabViewBase));
exports.TabView = TabView;
//# sourceMappingURL=tab-view.js.map