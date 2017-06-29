function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var switch_common_1 = require("./switch-common");
__export(require("./switch-common"));
var CheckedChangeListener;
function initializeCheckedChangeListener() {
    if (CheckedChangeListener) {
        return;
    }
    var CheckedChangeListenerImpl = (function (_super) {
        __extends(CheckedChangeListenerImpl, _super);
        function CheckedChangeListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        CheckedChangeListenerImpl.prototype.onCheckedChanged = function (buttonView, isChecked) {
            var owner = this.owner;
            switch_common_1.checkedProperty.nativeValueChange(owner, isChecked);
        };
        return CheckedChangeListenerImpl;
    }(java.lang.Object));
    CheckedChangeListenerImpl = __decorate([
        Interfaces([android.widget.CompoundButton.OnCheckedChangeListener])
    ], CheckedChangeListenerImpl);
    CheckedChangeListener = CheckedChangeListenerImpl;
}
var Switch = (function (_super) {
    __extends(Switch, _super);
    function Switch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Switch.prototype.createNativeView = function () {
        initializeCheckedChangeListener();
        var nativeView = new android.widget.Switch(this._context);
        var listener = new CheckedChangeListener(this);
        nativeView.setOnCheckedChangeListener(listener);
        nativeView.listener = listener;
        return nativeView;
    };
    Switch.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeView;
        nativeView.listener.owner = this;
    };
    Switch.prototype.disposeNativeView = function () {
        var nativeView = this.nativeView;
        nativeView.listener.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Switch.prototype[switch_common_1.checkedProperty.getDefault] = function () {
        return false;
    };
    Switch.prototype[switch_common_1.checkedProperty.setNative] = function (value) {
        this.nativeView.setChecked(value);
    };
    Switch.prototype[switch_common_1.colorProperty.getDefault] = function () {
        return -1;
    };
    Switch.prototype[switch_common_1.colorProperty.setNative] = function (value) {
        if (value instanceof switch_common_1.Color) {
            this.nativeView.getThumbDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            this.nativeView.getThumbDrawable().clearColorFilter();
        }
    };
    Switch.prototype[switch_common_1.backgroundColorProperty.getDefault] = function () {
        return -1;
    };
    Switch.prototype[switch_common_1.backgroundColorProperty.setNative] = function (value) {
        if (value instanceof switch_common_1.Color) {
            this.nativeView.getTrackDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            this.nativeView.getTrackDrawable().clearColorFilter();
        }
    };
    Switch.prototype[switch_common_1.backgroundInternalProperty.getDefault] = function () {
        return null;
    };
    Switch.prototype[switch_common_1.backgroundInternalProperty.setNative] = function (value) {
    };
    return Switch;
}(switch_common_1.SwitchBase));
exports.Switch = Switch;
//# sourceMappingURL=switch.js.map