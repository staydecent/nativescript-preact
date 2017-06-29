function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var stack_layout_common_1 = require("./stack-layout-common");
__export(require("./stack-layout-common"));
var StackLayout = (function (_super) {
    __extends(StackLayout, _super);
    function StackLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackLayout.prototype.createNativeView = function () {
        return new org.nativescript.widgets.StackLayout(this._context);
    };
    StackLayout.prototype[stack_layout_common_1.orientationProperty.setNative] = function (value) {
        this.nativeView.setOrientation(value === "vertical" ? org.nativescript.widgets.Orientation.vertical : org.nativescript.widgets.Orientation.horizontal);
    };
    return StackLayout;
}(stack_layout_common_1.StackLayoutBase));
exports.StackLayout = StackLayout;
//# sourceMappingURL=stack-layout.js.map