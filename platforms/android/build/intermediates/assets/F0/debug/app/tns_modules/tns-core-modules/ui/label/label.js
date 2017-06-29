function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var text_base_1 = require("../text-base");
__export(require("../text-base"));
var TextView;
var Label = (function (_super) {
    __extends(Label, _super);
    function Label() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Label.prototype, "textWrap", {
        get: function () {
            return this.style.whiteSpace === "normal";
        },
        set: function (value) {
            this.style.whiteSpace = value ? "normal" : "nowrap";
        },
        enumerable: true,
        configurable: true
    });
    Label.prototype.createNativeView = function () {
        if (!TextView) {
            TextView = android.widget.TextView;
        }
        return new TextView(this._context);
    };
    Label.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var textView = this.nativeView;
        textView.setSingleLine(true);
        textView.setEllipsize(android.text.TextUtils.TruncateAt.END);
    };
    Label.prototype[text_base_1.whiteSpaceProperty.setNative] = function (value) {
        var newValue = value === "initial" ? "nowrap" : value;
        _super.prototype[text_base_1.whiteSpaceProperty.setNative].call(this, newValue);
    };
    return Label;
}(text_base_1.TextBase));
exports.Label = Label;
//# sourceMappingURL=label.js.map