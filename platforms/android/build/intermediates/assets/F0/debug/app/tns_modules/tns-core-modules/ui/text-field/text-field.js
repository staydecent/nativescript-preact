function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var text_field_common_1 = require("./text-field-common");
__export(require("./text-field-common"));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextField.prototype._configureEditText = function (editText) {
        editText.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_NORMAL | android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);
        editText.setLines(1);
        editText.setMaxLines(1);
        editText.setHorizontallyScrolling(true);
    };
    TextField.prototype._onReturnPress = function () {
        this.notify({ eventName: TextField.returnPressEvent, object: this });
    };
    TextField.prototype[text_field_common_1.secureProperty.getDefault] = function () {
        return false;
    };
    TextField.prototype[text_field_common_1.secureProperty.setNative] = function (value) {
        var nativeView = this.nativeView;
        var currentInputType = nativeView.getInputType();
        var currentClass = currentInputType & android.text.InputType.TYPE_MASK_CLASS;
        var currentFlags = currentInputType & android.text.InputType.TYPE_MASK_FLAGS;
        var newInputType = currentInputType;
        if (value) {
            if (currentClass === android.text.InputType.TYPE_CLASS_TEXT) {
                newInputType = currentClass | currentFlags | android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD;
            }
            else if (currentClass === android.text.InputType.TYPE_CLASS_NUMBER) {
                newInputType = currentClass | currentFlags | android.text.InputType.TYPE_NUMBER_VARIATION_PASSWORD;
            }
            newInputType = newInputType & ~28672;
        }
        else {
            if (currentClass === android.text.InputType.TYPE_CLASS_TEXT) {
                newInputType = currentClass | currentFlags | android.text.InputType.TYPE_TEXT_VARIATION_NORMAL;
            }
            else if (currentClass === android.text.InputType.TYPE_CLASS_NUMBER) {
                newInputType = currentClass | currentFlags | android.text.InputType.TYPE_NUMBER_VARIATION_NORMAL;
            }
        }
        this._setInputType(newInputType);
    };
    TextField.prototype[text_field_common_1.whiteSpaceProperty.getDefault] = function () {
        return "nowrap";
    };
    TextField.prototype[text_field_common_1.whiteSpaceProperty.setNative] = function (value) {
    };
    return TextField;
}(text_field_common_1.TextFieldBase));
exports.TextField = TextField;
//# sourceMappingURL=text-field.js.map