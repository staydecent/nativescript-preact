Object.defineProperty(exports, "__esModule", { value: true });
var common = require("./color-common");
var Color = (function (_super) {
    __extends(Color, _super);
    function Color() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Color.prototype, "android", {
        get: function () {
            return this.argb >> 0;
        },
        enumerable: true,
        configurable: true
    });
    return Color;
}(common.Color));
exports.Color = Color;
//# sourceMappingURL=color.js.map