function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var layout_base_1 = require("../layout-base");
function validateArgs(element) {
    if (!element) {
        throw new Error("element cannot be null or undefinied.");
    }
    return element;
}
__export(require("../layout-base"));
var DockLayoutBase = (function (_super) {
    __extends(DockLayoutBase, _super);
    function DockLayoutBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DockLayoutBase.getDock = function (element) {
        return validateArgs(element).dock;
    };
    DockLayoutBase.setDock = function (element, value) {
        validateArgs(element).dock = value;
    };
    DockLayoutBase.prototype.onDockChanged = function (view, oldValue, newValue) {
    };
    return DockLayoutBase;
}(layout_base_1.LayoutBase));
exports.DockLayoutBase = DockLayoutBase;
var dockConverter = layout_base_1.makeParser(layout_base_1.makeValidator("left", "top", "right", "bottom"));
exports.dockProperty = new layout_base_1.Property({
    name: "dock", defaultValue: "left", valueChanged: function (target, oldValue, newValue) {
        if (target instanceof layout_base_1.View) {
            var layout = target.parent;
            if (layout instanceof DockLayoutBase) {
                layout.onDockChanged(target, oldValue, newValue);
            }
        }
    }, valueConverter: dockConverter
});
exports.dockProperty.register(layout_base_1.View);
exports.stretchLastChildProperty = new layout_base_1.Property({
    name: "stretchLastChild", defaultValue: true, affectsLayout: layout_base_1.isIOS, valueConverter: layout_base_1.booleanConverter
});
exports.stretchLastChildProperty.register(DockLayoutBase);
//# sourceMappingURL=dock-layout-common.js.map