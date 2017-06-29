function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
__export(require("../core/view"));
var SliderBase = (function (_super) {
    __extends(SliderBase, _super);
    function SliderBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SliderBase;
}(view_1.View));
exports.SliderBase = SliderBase;
exports.valueProperty = new view_1.CoercibleProperty({
    name: "value", defaultValue: 0, coerceValue: function (target, value) {
        value = Math.max(value, target.minValue);
        value = Math.min(value, target.maxValue);
        return value;
    }, valueConverter: function (v) { return view_1.isIOS ? parseFloat(v) : parseInt(v); }
});
exports.valueProperty.register(SliderBase);
exports.minValueProperty = new view_1.Property({
    name: "minValue", defaultValue: 0, valueChanged: function (target, oldValue, newValue) {
        exports.maxValueProperty.coerce(target);
        exports.valueProperty.coerce(target);
    }, valueConverter: function (v) { return view_1.isIOS ? parseFloat(v) : parseInt(v); }
});
exports.minValueProperty.register(SliderBase);
exports.maxValueProperty = new view_1.CoercibleProperty({
    name: "maxValue", defaultValue: 100, coerceValue: function (target, value) {
        var minValue = target.minValue;
        if (value < minValue) {
            value = minValue;
        }
        return value;
    },
    valueChanged: function (target, oldValue, newValue) { return exports.valueProperty.coerce(target); },
    valueConverter: function (v) { return view_1.isIOS ? parseFloat(v) : parseInt(v); }
});
exports.maxValueProperty.register(SliderBase);
//# sourceMappingURL=slider-common.js.map