function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
__export(require("../core/view"));
var ProgressBase = (function (_super) {
    __extends(ProgressBase, _super);
    function ProgressBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ProgressBase;
}(view_1.View));
exports.ProgressBase = ProgressBase;
exports.valueProperty = new view_1.CoercibleProperty({
    name: "value",
    defaultValue: 0,
    coerceValue: function (t, v) {
        return v < 0 ? 0 : Math.min(v, t.maxValue);
    },
    valueConverter: function (v) { return parseInt(v); }
});
exports.valueProperty.register(ProgressBase);
exports.maxValueProperty = new view_1.Property({
    name: "maxValue",
    defaultValue: 100,
    valueChanged: function (target, oldValue, newValue) {
        exports.valueProperty.coerce(target);
    },
    valueConverter: function (v) { return parseInt(v); }
});
exports.maxValueProperty.register(ProgressBase);
//# sourceMappingURL=progress-common.js.map