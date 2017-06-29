function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var layout_base_common_1 = require("./layout-base-common");
__export(require("./layout-base-common"));
var LayoutBase = (function (_super) {
    __extends(LayoutBase, _super);
    function LayoutBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LayoutBase.prototype[layout_base_common_1.clipToBoundsProperty.getDefault] = function () {
        return true;
    };
    LayoutBase.prototype[layout_base_common_1.clipToBoundsProperty.setNative] = function (value) {
        console.warn("clipToBounds with value false is not supported on Android. You can use this.android.getParent().setClipChildren(false) as an alternative");
    };
    LayoutBase.prototype[layout_base_common_1.paddingTopProperty.getDefault] = function () {
        return { value: this._defaultPaddingTop, unit: "px" };
    };
    LayoutBase.prototype[layout_base_common_1.paddingTopProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingTop(this.nativeView, layout_base_common_1.Length.toDevicePixels(value, 0) + layout_base_common_1.Length.toDevicePixels(this.style.borderTopWidth, 0));
    };
    LayoutBase.prototype[layout_base_common_1.paddingRightProperty.getDefault] = function () {
        return { value: this._defaultPaddingRight, unit: "px" };
    };
    LayoutBase.prototype[layout_base_common_1.paddingRightProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingRight(this.nativeView, layout_base_common_1.Length.toDevicePixels(value, 0) + layout_base_common_1.Length.toDevicePixels(this.style.borderRightWidth, 0));
    };
    LayoutBase.prototype[layout_base_common_1.paddingBottomProperty.getDefault] = function () {
        return { value: this._defaultPaddingBottom, unit: "px" };
    };
    LayoutBase.prototype[layout_base_common_1.paddingBottomProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingBottom(this.nativeView, layout_base_common_1.Length.toDevicePixels(value, 0) + layout_base_common_1.Length.toDevicePixels(this.style.borderBottomWidth, 0));
    };
    LayoutBase.prototype[layout_base_common_1.paddingLeftProperty.getDefault] = function () {
        return { value: this._defaultPaddingLeft, unit: "px" };
    };
    LayoutBase.prototype[layout_base_common_1.paddingLeftProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingLeft(this.nativeView, layout_base_common_1.Length.toDevicePixels(value, 0) + layout_base_common_1.Length.toDevicePixels(this.style.borderLeftWidth, 0));
    };
    return LayoutBase;
}(layout_base_common_1.LayoutBaseCommon));
exports.LayoutBase = LayoutBase;
//# sourceMappingURL=layout-base.js.map