function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var text_base_1 = require("../text-base");
__export(require("../text-base"));
var ButtonBase = (function (_super) {
    __extends(ButtonBase, _super);
    function ButtonBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ButtonBase.prototype, "textWrap", {
        get: function () {
            return this.style.whiteSpace === "normal";
        },
        set: function (value) {
            this.style.whiteSpace = value ? "normal" : "nowrap";
        },
        enumerable: true,
        configurable: true
    });
    return ButtonBase;
}(text_base_1.TextBase));
ButtonBase.tapEvent = "tap";
exports.ButtonBase = ButtonBase;
//# sourceMappingURL=button-common.js.map