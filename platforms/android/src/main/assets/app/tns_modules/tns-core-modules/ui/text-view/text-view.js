function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var editable_text_base_1 = require("../editable-text-base");
__export(require("../text-base"));
var TextView = (function (_super) {
    __extends(TextView, _super);
    function TextView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextView.prototype._configureEditText = function (editText) {
        editText.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_NORMAL | android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES | android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE);
        editText.setGravity(android.view.Gravity.TOP | android.view.Gravity.LEFT);
    };
    return TextView;
}(editable_text_base_1.EditableTextBase));
exports.TextView = TextView;
//# sourceMappingURL=text-view.js.map