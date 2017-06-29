function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var time_picker_common_1 = require("./time-picker-common");
__export(require("./time-picker-common"));
var TimeChangedListener;
function initializeTimeChangedListener() {
    if (TimeChangedListener) {
        return;
    }
    apiLevel = android.os.Build.VERSION.SDK_INT;
    var TimeChangedListenerImpl = (function (_super) {
        __extends(TimeChangedListenerImpl, _super);
        function TimeChangedListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        TimeChangedListenerImpl.prototype.onTimeChanged = function (picker, hour, minute) {
            var timePicker = this.owner;
            if (timePicker.updatingNativeValue) {
                return;
            }
            var validTime = time_picker_common_1.getValidTime(timePicker, hour, minute);
            time_picker_common_1.timeProperty.nativeValueChange(timePicker, new Date(0, 0, 0, validTime.hour, validTime.minute));
        };
        return TimeChangedListenerImpl;
    }(java.lang.Object));
    TimeChangedListenerImpl = __decorate([
        Interfaces([android.widget.TimePicker.OnTimeChangedListener])
    ], TimeChangedListenerImpl);
    TimeChangedListener = TimeChangedListenerImpl;
}
var apiLevel;
var TimePicker = (function (_super) {
    __extends(TimePicker, _super);
    function TimePicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimePicker.prototype.createNativeView = function () {
        initializeTimeChangedListener();
        var nativeView = new android.widget.TimePicker(this._context);
        var listener = new TimeChangedListener(this);
        nativeView.setOnTimeChangedListener(listener);
        nativeView.listener = listener;
        nativeView.calendar = java.util.Calendar.getInstance();
        return nativeView;
    };
    TimePicker.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeView;
        nativeView.listener.owner = this;
        var calendar = nativeView.calendar;
        var hour = time_picker_common_1.hourProperty.isSet(this) ? this.hour : calendar.get(java.util.Calendar.HOUR_OF_DAY);
        var minute = time_picker_common_1.minuteProperty.isSet(this) ? this.minute : calendar.get(java.util.Calendar.MINUTE);
        var validTime = time_picker_common_1.getValidTime(this, hour, minute);
        if (!time_picker_common_1.timeProperty.isSet(this)) {
            this.time = new Date(0, 0, 0, validTime.hour, validTime.minute);
        }
    };
    TimePicker.prototype[time_picker_common_1.minuteProperty.setNative] = function (value) {
        this.updatingNativeValue = true;
        try {
            if (apiLevel >= 23) {
                this.nativeView.setMinute(value);
            }
            else {
                this.nativeView.setCurrentMinute(new java.lang.Integer(value));
            }
        }
        finally {
            this.updatingNativeValue = false;
        }
    };
    TimePicker.prototype[time_picker_common_1.hourProperty.setNative] = function (value) {
        this.updatingNativeValue = true;
        try {
            if (apiLevel >= 23) {
                this.nativeView.setHour(value);
            }
            else {
                this.nativeView.setCurrentHour(new java.lang.Integer(value));
            }
        }
        finally {
            this.updatingNativeValue = false;
        }
    };
    return TimePicker;
}(time_picker_common_1.TimePickerBase));
exports.TimePicker = TimePicker;
//# sourceMappingURL=time-picker.js.map