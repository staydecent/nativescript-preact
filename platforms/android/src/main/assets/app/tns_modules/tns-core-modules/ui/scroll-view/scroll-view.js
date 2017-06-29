function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var scroll_view_common_1 = require("./scroll-view-common");
__export(require("./scroll-view-common"));
var ScrollView = (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._androidViewId = -1;
        _this._lastScrollX = -1;
        _this._lastScrollY = -1;
        return _this;
    }
    Object.defineProperty(ScrollView.prototype, "horizontalOffset", {
        get: function () {
            var nativeView = this.nativeView;
            if (!nativeView) {
                return 0;
            }
            return nativeView.getScrollX() / scroll_view_common_1.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "verticalOffset", {
        get: function () {
            var nativeView = this.nativeView;
            if (!nativeView) {
                return 0;
            }
            return nativeView.getScrollY() / scroll_view_common_1.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableWidth", {
        get: function () {
            var nativeView = this.nativeView;
            if (!nativeView || this.orientation !== "horizontal") {
                return 0;
            }
            return nativeView.getScrollableLength() / scroll_view_common_1.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableHeight", {
        get: function () {
            var nativeView = this.nativeView;
            if (!nativeView || this.orientation !== "vertical") {
                return 0;
            }
            return nativeView.getScrollableLength() / scroll_view_common_1.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    ScrollView.prototype.scrollToVerticalOffset = function (value, animated) {
        var nativeView = this.nativeView;
        if (nativeView && this.orientation === "vertical") {
            value *= scroll_view_common_1.layout.getDisplayDensity();
            if (animated) {
                nativeView.smoothScrollTo(0, value);
            }
            else {
                nativeView.scrollTo(0, value);
            }
        }
    };
    ScrollView.prototype.scrollToHorizontalOffset = function (value, animated) {
        var nativeView = this.nativeView;
        if (nativeView && this.orientation === "horizontal") {
            value *= scroll_view_common_1.layout.getDisplayDensity();
            if (animated) {
                nativeView.smoothScrollTo(value, 0);
            }
            else {
                nativeView.scrollTo(value, 0);
            }
        }
    };
    ScrollView.prototype.createNativeView = function () {
        var nativeView = this.orientation === "horizontal" ? new org.nativescript.widgets.HorizontalScrollView(this._context) : new org.nativescript.widgets.VerticalScrollView(this._context);
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        nativeView.setId(this._androidViewId);
        return nativeView;
    };
    ScrollView.prototype._onOrientationChanged = function () {
        if (this.nativeView) {
            var parent_1 = this.parent;
            if (parent_1) {
                parent_1._removeView(this);
                parent_1._addView(this);
            }
        }
    };
    ScrollView.prototype.attachNative = function () {
        var that = new WeakRef(this);
        this.handler = new android.view.ViewTreeObserver.OnScrollChangedListener({
            onScrollChanged: function () {
                var owner = that.get();
                if (owner) {
                    owner._onScrollChanged();
                }
            }
        });
        this.nativeView.getViewTreeObserver().addOnScrollChangedListener(this.handler);
    };
    ScrollView.prototype._onScrollChanged = function () {
        var nativeView = this.nativeView;
        if (nativeView) {
            var newScrollX = nativeView.getScrollX();
            var newScrollY = nativeView.getScrollY();
            if (newScrollX !== this._lastScrollX || newScrollY !== this._lastScrollY) {
                this.notify({
                    object: this,
                    eventName: ScrollView.scrollEvent,
                    scrollX: newScrollX / scroll_view_common_1.layout.getDisplayDensity(),
                    scrollY: newScrollY / scroll_view_common_1.layout.getDisplayDensity()
                });
                this._lastScrollX = newScrollX;
                this._lastScrollY = newScrollY;
            }
        }
    };
    ScrollView.prototype.dettachNative = function () {
        this.nativeView.getViewTreeObserver().removeOnScrollChangedListener(this.handler);
        this.handler = null;
    };
    return ScrollView;
}(scroll_view_common_1.ScrollViewBase));
exports.ScrollView = ScrollView;
//# sourceMappingURL=scroll-view.js.map