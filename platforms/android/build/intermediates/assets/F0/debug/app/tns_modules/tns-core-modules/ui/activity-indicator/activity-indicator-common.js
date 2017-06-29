function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
__export(require("../core/view"));
var ActivityIndicatorBase = (function (_super) {
    __extends(ActivityIndicatorBase, _super);
    function ActivityIndicatorBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ActivityIndicatorBase;
}(view_1.View));
exports.ActivityIndicatorBase = ActivityIndicatorBase;
exports.busyProperty = new view_1.Property({ name: "busy", defaultValue: false, valueConverter: view_1.booleanConverter });
exports.busyProperty.register(ActivityIndicatorBase);
//# sourceMappingURL=activity-indicator-common.js.map