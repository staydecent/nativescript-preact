Object.defineProperty(exports, "__esModule", { value: true });
exports.STRING = "string";
exports.PROMPT = "Prompt";
exports.CONFIRM = "Confirm";
exports.ALERT = "Alert";
exports.LOGIN = "Login";
exports.OK = "OK";
exports.CANCEL = "Cancel";
var inputType;
(function (inputType) {
    inputType.text = "text";
    inputType.password = "password";
    inputType.email = "email";
})(inputType = exports.inputType || (exports.inputType = {}));
var frame;
function getCurrentPage() {
    if (!frame) {
        frame = require("ui/frame");
    }
    var topmostFrame = frame.topmost();
    if (topmostFrame) {
        return topmostFrame.currentPage;
    }
    return undefined;
}
exports.getCurrentPage = getCurrentPage;
function applySelectors(view) {
    var currentPage = getCurrentPage();
    if (currentPage) {
        var styleScope = currentPage._getStyleScope();
        if (styleScope) {
            styleScope.applySelectors(view);
        }
    }
}
var buttonColor;
var buttonBackgroundColor;
function getButtonColors() {
    var Button = require("ui/button").Button;
    var btn = new Button();
    applySelectors(btn);
    buttonColor = btn.color;
    buttonBackgroundColor = btn.backgroundColor;
    btn.onUnloaded();
}
function getButtonColor() {
    if (!buttonColor) {
        getButtonColors();
    }
    return buttonColor;
}
exports.getButtonColor = getButtonColor;
function getButtonBackgroundColor() {
    if (!buttonBackgroundColor) {
        getButtonColors();
    }
    return buttonBackgroundColor;
}
exports.getButtonBackgroundColor = getButtonBackgroundColor;
var textFieldColor;
function getTextFieldColor() {
    if (!textFieldColor) {
        var TextField = require("ui/text-field").TextField;
        var tf = new TextField();
        applySelectors(tf);
        textFieldColor = tf.color;
        tf.onUnloaded();
    }
    return textFieldColor;
}
exports.getTextFieldColor = getTextFieldColor;
var labelColor;
function getLabelColor() {
    if (!labelColor) {
        var Label = require("ui/label").Label;
        var lbl = new Label();
        applySelectors(lbl);
        labelColor = lbl.color;
        lbl.onUnloaded();
    }
    return labelColor;
}
exports.getLabelColor = getLabelColor;
function isDialogOptions(arg) {
    return arg && (arg.message || arg.title);
}
exports.isDialogOptions = isDialogOptions;
//# sourceMappingURL=dialogs-common.js.map