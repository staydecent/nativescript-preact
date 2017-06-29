function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var layout_base_1 = require("../layout-base");
__export(require("../layout-base"));
layout_base_1.View.prototype.effectiveLeft = 0;
layout_base_1.View.prototype.effectiveTop = 0;
function validateArgs(element) {
    if (!element) {
        throw new Error("element cannot be null or undefinied.");
    }
    return element;
}
var AbsoluteLayoutBase = (function (_super) {
    __extends(AbsoluteLayoutBase, _super);
    function AbsoluteLayoutBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbsoluteLayoutBase.getLeft = function (element) {
        return validateArgs(element).left;
    };
    AbsoluteLayoutBase.setLeft = function (element, value) {
        validateArgs(element).left = value;
    };
    AbsoluteLayoutBase.getTop = function (element) {
        return validateArgs(element).top;
    };
    AbsoluteLayoutBase.setTop = function (element, value) {
        validateArgs(element).top = value;
    };
    AbsoluteLayoutBase.prototype.onLeftChanged = function (view, oldValue, newValue) {
    };
    AbsoluteLayoutBase.prototype.onTopChanged = function (view, oldValue, newValue) {
    };
    return AbsoluteLayoutBase;
}(layout_base_1.LayoutBase));
exports.AbsoluteLayoutBase = AbsoluteLayoutBase;
exports.leftProperty = new layout_base_1.Property({
    name: "left", defaultValue: layout_base_1.zeroLength,
    valueChanged: function (target, oldValue, newValue) {
        target.effectiveLeft = layout_base_1.Length.toDevicePixels(newValue, 0);
        var layout = target.parent;
        if (layout instanceof AbsoluteLayoutBase) {
            layout.onLeftChanged(target, oldValue, newValue);
        }
    }, valueConverter: function (v) { return layout_base_1.Length.parse(v); }
});
exports.leftProperty.register(layout_base_1.View);
exports.topProperty = new layout_base_1.Property({
    name: "top", defaultValue: layout_base_1.zeroLength,
    valueChanged: function (target, oldValue, newValue) {
        target.effectiveTop = layout_base_1.Length.toDevicePixels(newValue, 0);
        var layout = target.parent;
        if (layout instanceof AbsoluteLayoutBase) {
            layout.onTopChanged(target, oldValue, newValue);
        }
    }, valueConverter: function (v) { return layout_base_1.Length.parse(v); }
});
exports.topProperty.register(layout_base_1.View);
//# sourceMappingURL=absolute-layout-common.js.map