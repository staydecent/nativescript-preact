function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var flexbox_layout_common_1 = require("./flexbox-layout-common");
__export(require("./flexbox-layout-common"));
var widgetFlexboxLayout;
var widgetLayoutParams;
function makeNativeSetter(setter) {
    return function (value) {
        var nativeView = this.nativeView;
        var lp = nativeView.getLayoutParams() || new widgetLayoutParams();
        if (lp instanceof widgetLayoutParams) {
            setter(lp, value);
            nativeView.setLayoutParams(lp);
        }
    };
}
flexbox_layout_common_1.View.prototype[flexbox_layout_common_1.orderProperty.setNative] = makeNativeSetter(function (lp, value) { return lp.order = value; });
flexbox_layout_common_1.View.prototype[flexbox_layout_common_1.flexGrowProperty.setNative] = makeNativeSetter(function (lp, value) { return lp.flexGrow = value; });
flexbox_layout_common_1.View.prototype[flexbox_layout_common_1.flexShrinkProperty.setNative] = makeNativeSetter(function (lp, value) { return lp.flexShrink = value; });
flexbox_layout_common_1.View.prototype[flexbox_layout_common_1.flexWrapBeforeProperty.setNative] = makeNativeSetter(function (lp, value) { return lp.wrapBefore = value; });
flexbox_layout_common_1.View.prototype[flexbox_layout_common_1.alignSelfProperty.setNative] = makeNativeSetter(function (lp, value) { return lp.alignSelf = alignSelfMap[value]; });
var flexDirectionMap = (_a = {},
    _a[flexbox_layout_common_1.FlexDirection.ROW] = 0,
    _a[flexbox_layout_common_1.FlexDirection.ROW_REVERSE] = 1,
    _a[flexbox_layout_common_1.FlexDirection.COLUMN] = 2,
    _a[flexbox_layout_common_1.FlexDirection.COLUMN_REVERSE] = 3,
    _a);
var flexWrapMap = (_b = {},
    _b[flexbox_layout_common_1.FlexWrap.NOWRAP] = 0,
    _b[flexbox_layout_common_1.FlexWrap.WRAP] = 1,
    _b[flexbox_layout_common_1.FlexWrap.WRAP_REVERSE] = 2,
    _b);
var justifyContentMap = (_c = {},
    _c[flexbox_layout_common_1.JustifyContent.FLEX_START] = 0,
    _c[flexbox_layout_common_1.JustifyContent.FLEX_END] = 1,
    _c[flexbox_layout_common_1.JustifyContent.CENTER] = 2,
    _c[flexbox_layout_common_1.JustifyContent.SPACE_BETWEEN] = 3,
    _c[flexbox_layout_common_1.JustifyContent.SPACE_AROUND] = 4,
    _c);
var alignItemsMap = (_d = {},
    _d[flexbox_layout_common_1.AlignItems.FLEX_START] = 0,
    _d[flexbox_layout_common_1.AlignItems.FLEX_END] = 1,
    _d[flexbox_layout_common_1.AlignItems.CENTER] = 2,
    _d[flexbox_layout_common_1.AlignItems.BASELINE] = 3,
    _d[flexbox_layout_common_1.AlignItems.STRETCH] = 4,
    _d);
var alignContentMap = (_e = {},
    _e[flexbox_layout_common_1.AlignContent.FLEX_START] = 0,
    _e[flexbox_layout_common_1.AlignContent.FLEX_END] = 1,
    _e[flexbox_layout_common_1.AlignContent.CENTER] = 2,
    _e[flexbox_layout_common_1.AlignContent.SPACE_BETWEEN] = 3,
    _e[flexbox_layout_common_1.AlignContent.SPACE_AROUND] = 4,
    _e[flexbox_layout_common_1.AlignContent.STRETCH] = 5,
    _e);
var alignSelfMap = (_f = {},
    _f[flexbox_layout_common_1.AlignSelf.AUTO] = -1,
    _f[flexbox_layout_common_1.AlignSelf.FLEX_START] = 0,
    _f[flexbox_layout_common_1.AlignSelf.FLEX_END] = 1,
    _f[flexbox_layout_common_1.AlignSelf.CENTER] = 2,
    _f[flexbox_layout_common_1.AlignSelf.BASELINE] = 3,
    _f[flexbox_layout_common_1.AlignSelf.STRETCH] = 4,
    _f);
var FlexboxLayout = (function (_super) {
    __extends(FlexboxLayout, _super);
    function FlexboxLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlexboxLayout.prototype.createNativeView = function () {
        if (!widgetFlexboxLayout) {
            widgetFlexboxLayout = org.nativescript.widgets.FlexboxLayout;
            widgetLayoutParams = widgetFlexboxLayout.LayoutParams;
        }
        return new widgetFlexboxLayout(this._context);
    };
    FlexboxLayout.prototype.disposeNativeView = function () {
        this.nativeView.invalidateOrdersCache();
        _super.prototype.disposeNativeView.call(this);
    };
    FlexboxLayout.prototype[flexbox_layout_common_1.flexDirectionProperty.getDefault] = function () {
        return flexbox_layout_common_1.flexDirectionProperty.defaultValue;
    };
    FlexboxLayout.prototype[flexbox_layout_common_1.flexDirectionProperty.setNative] = function (flexDirection) {
        this.nativeView.setFlexDirection(flexDirectionMap[flexDirection]);
    };
    FlexboxLayout.prototype[flexbox_layout_common_1.flexWrapProperty.getDefault] = function () {
        return flexbox_layout_common_1.flexWrapProperty.defaultValue;
    };
    FlexboxLayout.prototype[flexbox_layout_common_1.flexWrapProperty.setNative] = function (flexWrap) {
        this.nativeView.setFlexWrap(flexWrapMap[flexWrap]);
    };
    FlexboxLayout.prototype[flexbox_layout_common_1.justifyContentProperty.getDefault] = function () {
        return flexbox_layout_common_1.justifyContentProperty.defaultValue;
    };
    FlexboxLayout.prototype[flexbox_layout_common_1.justifyContentProperty.setNative] = function (justifyContent) {
        this.nativeView.setJustifyContent(justifyContentMap[justifyContent]);
    };
    FlexboxLayout.prototype[flexbox_layout_common_1.alignItemsProperty.getDefault] = function () {
        return flexbox_layout_common_1.alignItemsProperty.defaultValue;
    };
    FlexboxLayout.prototype[flexbox_layout_common_1.alignItemsProperty.setNative] = function (alignItems) {
        this.nativeView.setAlignItems(alignItemsMap[alignItems]);
    };
    FlexboxLayout.prototype[flexbox_layout_common_1.alignContentProperty.getDefault] = function () {
        return flexbox_layout_common_1.alignContentProperty.defaultValue;
    };
    FlexboxLayout.prototype[flexbox_layout_common_1.alignContentProperty.setNative] = function (alignContent) {
        this.nativeView.setAlignContent(alignContentMap[alignContent]);
    };
    FlexboxLayout.prototype._updateNativeLayoutParams = function (child) {
        _super.prototype._updateNativeLayoutParams.call(this, child);
        var lp = child.nativeView.getLayoutParams();
        var style = child.style;
        lp.order = style.order;
        lp.flexGrow = style.flexGrow;
        lp.flexShrink = style.flexShrink;
        lp.wrapBefore = style.flexWrapBefore;
        lp.alignSelf = alignSelfMap[style.alignSelf];
        child.nativeView.setLayoutParams(lp);
    };
    FlexboxLayout.prototype._setChildMinWidthNative = function (child) {
        child._setMinWidthNative(0);
        var nativeView = child.nativeView;
        var lp = nativeView.getLayoutParams();
        if (lp instanceof widgetLayoutParams) {
            lp.minWidth = flexbox_layout_common_1.Length.toDevicePixels(child.style.minWidth, 0);
            nativeView.setLayoutParams(lp);
        }
    };
    FlexboxLayout.prototype._setChildMinHeightNative = function (child) {
        child._setMinHeightNative(0);
        var nativeView = child.nativeView;
        var lp = nativeView.getLayoutParams();
        if (lp instanceof widgetLayoutParams) {
            lp.minHeight = flexbox_layout_common_1.Length.toDevicePixels(child.style.minHeight, 0);
            nativeView.setLayoutParams(lp);
        }
    };
    return FlexboxLayout;
}(flexbox_layout_common_1.FlexboxLayoutBase));
exports.FlexboxLayout = FlexboxLayout;
var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=flexbox-layout.js.map