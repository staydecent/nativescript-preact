function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var progress_common_1 = require("./progress-common");
__export(require("./progress-common"));
var R_ATTR_PROGRESS_BAR_STYLE_HORIZONTAL = 0x01010078;
var Progress = (function (_super) {
    __extends(Progress, _super);
    function Progress() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Progress.prototype.createNativeView = function () {
        return new android.widget.ProgressBar(this._context, null, R_ATTR_PROGRESS_BAR_STYLE_HORIZONTAL);
    };
    Progress.prototype[progress_common_1.valueProperty.getDefault] = function () {
        return 0;
    };
    Progress.prototype[progress_common_1.valueProperty.setNative] = function (value) {
        this.nativeView.setProgress(value);
    };
    Progress.prototype[progress_common_1.maxValueProperty.getDefault] = function () {
        return 100;
    };
    Progress.prototype[progress_common_1.maxValueProperty.setNative] = function (value) {
        this.nativeView.setMax(value);
    };
    Progress.prototype[progress_common_1.colorProperty.getDefault] = function () {
        return null;
    };
    Progress.prototype[progress_common_1.colorProperty.setNative] = function (value) {
        var progressDrawable = this.nativeView.getProgressDrawable();
        if (!progressDrawable) {
            return;
        }
        if (value instanceof progress_common_1.Color) {
            progressDrawable.setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            progressDrawable.clearColorFilter();
        }
    };
    Progress.prototype[progress_common_1.backgroundColorProperty.getDefault] = function () {
        return null;
    };
    Progress.prototype[progress_common_1.backgroundColorProperty.setNative] = function (value) {
        var progressDrawable = this.nativeView.getProgressDrawable();
        if (!progressDrawable) {
            return;
        }
        if (progressDrawable instanceof android.graphics.drawable.LayerDrawable && progressDrawable.getNumberOfLayers() > 0) {
            var backgroundDrawable = progressDrawable.getDrawable(0);
            if (backgroundDrawable) {
                if (value instanceof progress_common_1.Color) {
                    backgroundDrawable.setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
                }
                else {
                    backgroundDrawable.clearColorFilter();
                }
            }
        }
    };
    Progress.prototype[progress_common_1.backgroundInternalProperty.getDefault] = function () {
        return null;
    };
    Progress.prototype[progress_common_1.backgroundInternalProperty.setNative] = function (value) {
    };
    return Progress;
}(progress_common_1.ProgressBase));
exports.Progress = Progress;
//# sourceMappingURL=progress.js.map