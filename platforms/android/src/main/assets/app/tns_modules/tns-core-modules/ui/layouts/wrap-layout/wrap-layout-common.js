function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var layout_base_1 = require("../layout-base");
__export(require("../layout-base"));
var WrapLayoutBase = (function (_super) {
    __extends(WrapLayoutBase, _super);
    function WrapLayoutBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WrapLayoutBase;
}(layout_base_1.LayoutBase));
exports.WrapLayoutBase = WrapLayoutBase;
exports.itemWidthProperty = new layout_base_1.Property({
    name: "itemWidth", defaultValue: "auto", affectsLayout: layout_base_1.isIOS, valueConverter: function (v) { return layout_base_1.Length.parse(v); },
    valueChanged: function (target, oldValue, newValue) { return target.effectiveItemWidth = layout_base_1.Length.toDevicePixels(newValue, -1); }
});
exports.itemWidthProperty.register(WrapLayoutBase);
exports.itemHeightProperty = new layout_base_1.Property({
    name: "itemHeight", defaultValue: "auto", affectsLayout: layout_base_1.isIOS, valueConverter: function (v) { return layout_base_1.Length.parse(v); },
    valueChanged: function (target, oldValue, newValue) { return target.effectiveItemHeight = layout_base_1.Length.toDevicePixels(newValue, -1); }
});
exports.itemHeightProperty.register(WrapLayoutBase);
var converter = layout_base_1.makeParser(layout_base_1.makeValidator("horizontal", "vertical"));
exports.orientationProperty = new layout_base_1.Property({ name: "orientation", defaultValue: "horizontal", affectsLayout: layout_base_1.isIOS, valueConverter: converter });
exports.orientationProperty.register(WrapLayoutBase);
//# sourceMappingURL=wrap-layout-common.js.map