function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var absolute_layout_common_1 = require("./absolute-layout-common");
__export(require("./absolute-layout-common"));
function makeNativeSetter(setter) {
    return function (value) {
        var nativeView = this.nativeView;
        var lp = nativeView.getLayoutParams() || new org.nativescript.widgets.CommonLayoutParams();
        if (lp instanceof org.nativescript.widgets.CommonLayoutParams) {
            setter.call(this, lp, value);
            nativeView.setLayoutParams(lp);
        }
    };
}
absolute_layout_common_1.View.prototype[absolute_layout_common_1.topProperty.setNative] = makeNativeSetter(function (lp, value) { lp.top = absolute_layout_common_1.Length.toDevicePixels(value, 0); });
absolute_layout_common_1.View.prototype[absolute_layout_common_1.leftProperty.setNative] = makeNativeSetter(function (lp, value) { lp.left = absolute_layout_common_1.Length.toDevicePixels(value, 0); });
var AbsoluteLayout = (function (_super) {
    __extends(AbsoluteLayout, _super);
    function AbsoluteLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbsoluteLayout.prototype.createNativeView = function () {
        return new org.nativescript.widgets.AbsoluteLayout(this._context);
    };
    return AbsoluteLayout;
}(absolute_layout_common_1.AbsoluteLayoutBase));
exports.AbsoluteLayout = AbsoluteLayout;
//# sourceMappingURL=absolute-layout.js.map