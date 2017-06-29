function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_layout_common_1 = require("./wrap-layout-common");
__export(require("./wrap-layout-common"));
var WrapLayout = (function (_super) {
    __extends(WrapLayout, _super);
    function WrapLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WrapLayout.prototype.createNativeView = function () {
        return new org.nativescript.widgets.WrapLayout(this._context);
    };
    WrapLayout.prototype[wrap_layout_common_1.orientationProperty.setNative] = function (value) {
        this.nativeView.setOrientation(value === "vertical" ? org.nativescript.widgets.Orientation.vertical : org.nativescript.widgets.Orientation.horizontal);
    };
    WrapLayout.prototype[wrap_layout_common_1.itemWidthProperty.setNative] = function (value) {
        this.nativeView.setItemWidth(wrap_layout_common_1.Length.toDevicePixels(value, -1));
    };
    WrapLayout.prototype[wrap_layout_common_1.itemHeightProperty.setNative] = function (value) {
        this.nativeView.setItemHeight(wrap_layout_common_1.Length.toDevicePixels(value, -1));
    };
    return WrapLayout;
}(wrap_layout_common_1.WrapLayoutBase));
exports.WrapLayout = WrapLayout;
//# sourceMappingURL=wrap-layout.js.map