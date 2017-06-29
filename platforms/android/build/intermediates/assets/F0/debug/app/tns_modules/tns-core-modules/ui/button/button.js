function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var button_common_1 = require("./button-common");
var gestures_1 = require("../gestures");
__export(require("./button-common"));
var ClickListener;
var APILEVEL;
function initializeClickListener() {
    if (ClickListener) {
        return;
    }
    var ClickListenerImpl = (function (_super) {
        __extends(ClickListenerImpl, _super);
        function ClickListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        ClickListenerImpl.prototype.onClick = function (v) {
            this.owner._emit(button_common_1.ButtonBase.tapEvent);
        };
        return ClickListenerImpl;
    }(java.lang.Object));
    ClickListenerImpl = __decorate([
        Interfaces([android.view.View.OnClickListener])
    ], ClickListenerImpl);
    ClickListener = ClickListenerImpl;
    APILEVEL = android.os.Build.VERSION.SDK_INT;
}
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Button.prototype.createNativeView = function () {
        initializeClickListener();
        var button = new android.widget.Button(this._context);
        var clickListener = new ClickListener(this);
        button.setOnClickListener(clickListener);
        button.clickListener = clickListener;
        return button;
    };
    Button.prototype.initNativeView = function () {
        this.nativeView.clickListener.owner = this;
        _super.prototype.initNativeView.call(this);
    };
    Button.prototype.disposeNativeView = function () {
        this.nativeView.clickListener.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Button.prototype._updateHandler = function (subscribe) {
        var _this = this;
        if (subscribe) {
            this._highlightedHandler = this._highlightedHandler || (function (args) {
                switch (args.action) {
                    case gestures_1.TouchAction.up:
                        _this._goToVisualState("normal");
                        break;
                    case gestures_1.TouchAction.down:
                        _this._goToVisualState("highlighted");
                        break;
                }
            });
            this.on(gestures_1.GestureTypes.touch, this._highlightedHandler);
        }
        else {
            this.off(gestures_1.GestureTypes.touch, this._highlightedHandler);
        }
    };
    Button.prototype[button_common_1.paddingTopProperty.getDefault] = function () {
        return { value: this._defaultPaddingTop, unit: "px" };
    };
    Button.prototype[button_common_1.paddingTopProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingTop(this.nativeView, button_common_1.Length.toDevicePixels(value, 0) + button_common_1.Length.toDevicePixels(this.style.borderTopWidth, 0));
    };
    Button.prototype[button_common_1.paddingRightProperty.getDefault] = function () {
        return { value: this._defaultPaddingRight, unit: "px" };
    };
    Button.prototype[button_common_1.paddingRightProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingRight(this.nativeView, button_common_1.Length.toDevicePixels(value, 0) + button_common_1.Length.toDevicePixels(this.style.borderRightWidth, 0));
    };
    Button.prototype[button_common_1.paddingBottomProperty.getDefault] = function () {
        return { value: this._defaultPaddingBottom, unit: "px" };
    };
    Button.prototype[button_common_1.paddingBottomProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingBottom(this.nativeView, button_common_1.Length.toDevicePixels(value, 0) + button_common_1.Length.toDevicePixels(this.style.borderBottomWidth, 0));
    };
    Button.prototype[button_common_1.paddingLeftProperty.getDefault] = function () {
        return { value: this._defaultPaddingLeft, unit: "px" };
    };
    Button.prototype[button_common_1.paddingLeftProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingLeft(this.nativeView, button_common_1.Length.toDevicePixels(value, 0) + button_common_1.Length.toDevicePixels(this.style.borderLeftWidth, 0));
    };
    Button.prototype[button_common_1.zIndexProperty.getDefault] = function () {
        return org.nativescript.widgets.ViewHelper.getZIndex(this.nativeView);
    };
    Button.prototype[button_common_1.zIndexProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setZIndex(this.nativeView, value);
        if (APILEVEL >= 21) {
            this.nativeView.setStateListAnimator(null);
        }
    };
    Button.prototype[button_common_1.textAlignmentProperty.setNative] = function (value) {
        var newValue = value === "initial" ? "center" : value;
        _super.prototype[button_common_1.textAlignmentProperty.setNative].call(this, newValue);
    };
    return Button;
}(button_common_1.ButtonBase));
__decorate([
    button_common_1.PseudoClassHandler("normal", "highlighted", "pressed", "active")
], Button.prototype, "_updateHandler", null);
exports.Button = Button;
//# sourceMappingURL=button.js.map