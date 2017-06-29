function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var slider_common_1 = require("./slider-common");
__export(require("./slider-common"));
var SeekBarChangeListener;
function initializeSeekBarChangeListener() {
    if (SeekBarChangeListener) {
        return;
    }
    var SeekBarChangeListenerImpl = (function (_super) {
        __extends(SeekBarChangeListenerImpl, _super);
        function SeekBarChangeListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        SeekBarChangeListenerImpl.prototype.onProgressChanged = function (seekBar, progress, fromUser) {
            var owner = this.owner;
            if (!owner._supressNativeValue) {
                var newValue = seekBar.getProgress() + owner.minValue;
                slider_common_1.valueProperty.nativeValueChange(owner, newValue);
            }
        };
        SeekBarChangeListenerImpl.prototype.onStartTrackingTouch = function (seekBar) {
        };
        SeekBarChangeListenerImpl.prototype.onStopTrackingTouch = function (seekBar) {
        };
        return SeekBarChangeListenerImpl;
    }(java.lang.Object));
    SeekBarChangeListenerImpl = __decorate([
        Interfaces([android.widget.SeekBar.OnSeekBarChangeListener])
    ], SeekBarChangeListenerImpl);
    SeekBarChangeListener = SeekBarChangeListenerImpl;
}
var Slider = (function (_super) {
    __extends(Slider, _super);
    function Slider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Slider.prototype.createNativeView = function () {
        initializeSeekBarChangeListener();
        var listener = new SeekBarChangeListener(this);
        var nativeView = new android.widget.SeekBar(this._context);
        nativeView.setOnSeekBarChangeListener(listener);
        nativeView.listener = listener;
        return nativeView;
    };
    Slider.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeView;
        nativeView.listener.owner = this;
    };
    Slider.prototype.disposeNativeView = function () {
        var nativeView = this.nativeView;
        nativeView.listener.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Slider.prototype.setNativeValuesSilently = function (newValue, newMaxValue) {
        this._supressNativeValue = true;
        var nativeView = this.nativeView;
        try {
            nativeView.setMax(newMaxValue);
            nativeView.setProgress(newValue);
        }
        finally {
            this._supressNativeValue = false;
        }
    };
    Slider.prototype[slider_common_1.valueProperty.getDefault] = function () {
        return 0;
    };
    Slider.prototype[slider_common_1.valueProperty.setNative] = function (value) {
        this.setNativeValuesSilently(value - this.minValue, this.maxValue - this.minValue);
    };
    Slider.prototype[slider_common_1.minValueProperty.getDefault] = function () {
        return 0;
    };
    Slider.prototype[slider_common_1.minValueProperty.setNative] = function (value) {
        this.setNativeValuesSilently(this.value - value, this.maxValue - value);
    };
    Slider.prototype[slider_common_1.maxValueProperty.getDefault] = function () {
        return 100;
    };
    Slider.prototype[slider_common_1.maxValueProperty.setNative] = function (value) {
        this.nativeView.setMax(value - this.minValue);
    };
    Slider.prototype[slider_common_1.colorProperty.getDefault] = function () {
        return -1;
    };
    Slider.prototype[slider_common_1.colorProperty.setNative] = function (value) {
        if (value instanceof slider_common_1.Color) {
            this.nativeView.getThumb().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            this.nativeView.getThumb().clearColorFilter();
        }
    };
    Slider.prototype[slider_common_1.backgroundColorProperty.getDefault] = function () {
        return -1;
    };
    Slider.prototype[slider_common_1.backgroundColorProperty.setNative] = function (value) {
        if (value instanceof slider_common_1.Color) {
            this.nativeView.getProgressDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            this.nativeView.getProgressDrawable().clearColorFilter();
        }
    };
    Slider.prototype[slider_common_1.backgroundInternalProperty.getDefault] = function () {
        return null;
    };
    Slider.prototype[slider_common_1.backgroundInternalProperty.setNative] = function (value) {
    };
    return Slider;
}(slider_common_1.SliderBase));
exports.Slider = Slider;
//# sourceMappingURL=slider.js.map