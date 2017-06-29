function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var activity_indicator_common_1 = require("./activity-indicator-common");
__export(require("./activity-indicator-common"));
var ActivityIndicator = (function (_super) {
    __extends(ActivityIndicator, _super);
    function ActivityIndicator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActivityIndicator.prototype.createNativeView = function () {
        var progressBar = new android.widget.ProgressBar(this._context);
        progressBar.setVisibility(android.view.View.INVISIBLE);
        progressBar.setIndeterminate(true);
        return progressBar;
    };
    ActivityIndicator.prototype[activity_indicator_common_1.busyProperty.getDefault] = function () {
        return false;
    };
    ActivityIndicator.prototype[activity_indicator_common_1.busyProperty.setNative] = function (value) {
        if (this.visibility === activity_indicator_common_1.Visibility.VISIBLE) {
            this.nativeView.setVisibility(value ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
        }
    };
    ActivityIndicator.prototype[activity_indicator_common_1.visibilityProperty.getDefault] = function () {
        return activity_indicator_common_1.Visibility.HIDDEN;
    };
    ActivityIndicator.prototype[activity_indicator_common_1.visibilityProperty.setNative] = function (value) {
        switch (value) {
            case activity_indicator_common_1.Visibility.VISIBLE:
                this.nativeView.setVisibility(this.busy ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
                break;
            case activity_indicator_common_1.Visibility.HIDDEN:
                this.nativeView.setVisibility(android.view.View.INVISIBLE);
                break;
            case activity_indicator_common_1.Visibility.COLLAPSE:
                this.nativeView.setVisibility(android.view.View.GONE);
                break;
            default:
                throw new Error("Invalid visibility value: " + value + ". Valid values are: \"" + activity_indicator_common_1.Visibility.VISIBLE + "\", \"" + activity_indicator_common_1.Visibility.HIDDEN + "\", \"" + activity_indicator_common_1.Visibility.COLLAPSE + "\".");
        }
    };
    ActivityIndicator.prototype[activity_indicator_common_1.colorProperty.getDefault] = function () {
        return -1;
    };
    ActivityIndicator.prototype[activity_indicator_common_1.colorProperty.setNative] = function (value) {
        if (value instanceof activity_indicator_common_1.Color) {
            this.nativeView.getIndeterminateDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            this.nativeView.getIndeterminateDrawable().clearColorFilter();
        }
    };
    return ActivityIndicator;
}(activity_indicator_common_1.ActivityIndicatorBase));
exports.ActivityIndicator = ActivityIndicator;
//# sourceMappingURL=activity-indicator.js.map