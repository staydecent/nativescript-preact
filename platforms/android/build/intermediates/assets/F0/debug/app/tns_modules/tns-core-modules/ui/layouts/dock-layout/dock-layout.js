function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var dock_layout_common_1 = require("./dock-layout-common");
__export(require("./dock-layout-common"));
dock_layout_common_1.View.prototype[dock_layout_common_1.dockProperty.setNative] = function (value) {
    var nativeView = this.nativeView;
    var lp = nativeView.getLayoutParams() || new org.nativescript.widgets.CommonLayoutParams();
    if (lp instanceof org.nativescript.widgets.CommonLayoutParams) {
        switch (value) {
            case "left":
                lp.dock = org.nativescript.widgets.Dock.left;
                break;
            case "top":
                lp.dock = org.nativescript.widgets.Dock.top;
                break;
            case "right":
                lp.dock = org.nativescript.widgets.Dock.right;
                break;
            case "bottom":
                lp.dock = org.nativescript.widgets.Dock.bottom;
                break;
            default:
                throw new Error("Invalid value for dock property: " + value);
        }
        nativeView.setLayoutParams(lp);
    }
};
var DockLayout = (function (_super) {
    __extends(DockLayout, _super);
    function DockLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DockLayout.prototype.createNativeView = function () {
        return new org.nativescript.widgets.DockLayout(this._context);
    };
    DockLayout.prototype[dock_layout_common_1.stretchLastChildProperty.getDefault] = function () {
        return true;
    };
    DockLayout.prototype[dock_layout_common_1.stretchLastChildProperty.setNative] = function (value) {
        this.nativeView.setStretchLastChild(value);
    };
    return DockLayout;
}(dock_layout_common_1.DockLayoutBase));
exports.DockLayout = DockLayout;
//# sourceMappingURL=dock-layout.js.map