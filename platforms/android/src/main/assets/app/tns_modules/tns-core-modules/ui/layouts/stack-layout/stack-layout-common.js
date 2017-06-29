function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var layout_base_1 = require("../layout-base");
__export(require("../layout-base"));
var StackLayoutBase = (function (_super) {
    __extends(StackLayoutBase, _super);
    function StackLayoutBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StackLayoutBase;
}(layout_base_1.LayoutBase));
exports.StackLayoutBase = StackLayoutBase;
var converter = layout_base_1.makeParser(layout_base_1.makeValidator("horizontal", "vertical"));
exports.orientationProperty = new layout_base_1.Property({ name: "orientation", defaultValue: "vertical", affectsLayout: layout_base_1.isIOS, valueConverter: converter });
exports.orientationProperty.register(StackLayoutBase);
//# sourceMappingURL=stack-layout-common.js.map