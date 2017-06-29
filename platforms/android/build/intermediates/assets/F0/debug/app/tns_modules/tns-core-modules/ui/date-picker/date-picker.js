function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var date_picker_common_1 = require("./date-picker-common");
__export(require("./date-picker-common"));
var DateChangedListener;
function initializeDateChangedListener() {
    if (DateChangedListener) {
        return;
    }
    var DateChangedListenerImpl = (function (_super) {
        __extends(DateChangedListenerImpl, _super);
        function DateChangedListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        DateChangedListenerImpl.prototype.onDateChanged = function (picker, year, month, day) {
            var owner = this.owner;
            var dateChanged = false;
            if (year !== owner.year) {
                date_picker_common_1.yearProperty.nativeValueChange(owner, year);
                dateChanged = true;
            }
            if ((month + 1) !== owner.month) {
                date_picker_common_1.monthProperty.nativeValueChange(owner, month + 1);
                dateChanged = true;
            }
            if (day !== owner.day) {
                date_picker_common_1.dayProperty.nativeValueChange(owner, day);
                dateChanged = true;
            }
            if (dateChanged) {
                date_picker_common_1.dateProperty.nativeValueChange(owner, new Date(year, month, day));
            }
        };
        return DateChangedListenerImpl;
    }(java.lang.Object));
    DateChangedListenerImpl = __decorate([
        Interfaces([android.widget.DatePicker.OnDateChangedListener])
    ], DateChangedListenerImpl);
    DateChangedListener = DateChangedListenerImpl;
}
var DatePicker = (function (_super) {
    __extends(DatePicker, _super);
    function DatePicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DatePicker.prototype.createNativeView = function () {
        initializeDateChangedListener();
        var picker = new android.widget.DatePicker(this._context);
        picker.setCalendarViewShown(false);
        var listener = new DateChangedListener(this);
        picker.init(0, 0, 0, listener);
        picker.listener = listener;
        return picker;
    };
    DatePicker.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this.nativeView.listener.owner = this;
    };
    DatePicker.prototype.disposeNativeView = function () {
        this.nativeView.listener.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    DatePicker.prototype.updateNativeDate = function () {
        var nativeView = this.nativeView;
        var year = typeof this.year === "number" ? this.year : nativeView.getYear();
        var month = typeof this.month === "number" ? (this.month - 1) : nativeView.getMonth();
        var day = typeof this.day === "number" ? this.day : nativeView.getDayOfMonth();
        this.date = new Date(year, month, day);
    };
    DatePicker.prototype[date_picker_common_1.yearProperty.getDefault] = function () {
        return this.nativeView.getYear();
    };
    DatePicker.prototype[date_picker_common_1.yearProperty.setNative] = function (value) {
        if (this.nativeView.getYear() !== value) {
            this.updateNativeDate();
        }
    };
    DatePicker.prototype[date_picker_common_1.monthProperty.getDefault] = function () {
        return this.nativeView.getMonth();
    };
    DatePicker.prototype[date_picker_common_1.monthProperty.setNative] = function (value) {
        if (this.nativeView.getMonth() !== (value - 1)) {
            this.updateNativeDate();
        }
    };
    DatePicker.prototype[date_picker_common_1.dayProperty.getDefault] = function () {
        return this.nativeView.getDayOfMonth();
    };
    DatePicker.prototype[date_picker_common_1.dayProperty.setNative] = function (value) {
        if (this.nativeView.getDayOfMonth() !== value) {
            this.updateNativeDate();
        }
    };
    DatePicker.prototype[date_picker_common_1.dateProperty.getDefault] = function () {
        var nativeView = this.nativeView;
        return new Date(nativeView.getYear(), nativeView.getMonth(), nativeView.getDayOfMonth());
    };
    DatePicker.prototype[date_picker_common_1.dateProperty.setNative] = function (value) {
        var nativeView = this.nativeView;
        if (nativeView.getDayOfMonth() !== value.getDay()
            || nativeView.getMonth() !== value.getMonth()
            || nativeView.getYear() !== value.getFullYear()) {
            nativeView.updateDate(value.getFullYear(), value.getMonth(), value.getDate());
        }
    };
    DatePicker.prototype[date_picker_common_1.maxDateProperty.getDefault] = function () {
        return this.nativeView.getMaxDate();
    };
    DatePicker.prototype[date_picker_common_1.maxDateProperty.setNative] = function (value) {
        var newValue = value instanceof Date ? value.getTime() : value;
        this.nativeView.setMaxDate(newValue);
    };
    DatePicker.prototype[date_picker_common_1.minDateProperty.getDefault] = function () {
        return this.nativeView.getMinDate();
    };
    DatePicker.prototype[date_picker_common_1.minDateProperty.setNative] = function (value) {
        var newValue = value instanceof Date ? value.getTime() : value;
        this.nativeView.setMinDate(newValue);
    };
    return DatePicker;
}(date_picker_common_1.DatePickerBase));
exports.DatePicker = DatePicker;
//# sourceMappingURL=date-picker.js.map