function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var background_1 = require("../../styling/background");
var view_common_1 = require("./view-common");
var style_properties_1 = require("../../styling/style-properties");
__export(require("./view-common"));
var TouchListener;
var disableUserInteractionListener;
function initializeDisabledListener() {
    if (disableUserInteractionListener) {
        return;
    }
    disableUserInteractionListener = new org.nativescript.widgets.DisableUserInteractionListener();
}
function initializeTouchListener() {
    if (TouchListener) {
        return;
    }
    var TouchListenerImpl = (function (_super) {
        __extends(TouchListenerImpl, _super);
        function TouchListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        TouchListenerImpl.prototype.onTouch = function (view, event) {
            var owner = this.owner;
            for (var type in owner._gestureObservers) {
                var list = owner._gestureObservers[type];
                list.forEach(function (element) {
                    element.androidOnTouchEvent(event);
                });
            }
            var nativeView = owner.nativeView;
            if (!nativeView || !nativeView.onTouchEvent) {
                return false;
            }
            return nativeView.onTouchEvent(event);
        };
        return TouchListenerImpl;
    }(java.lang.Object));
    TouchListenerImpl = __decorate([
        Interfaces([android.view.View.OnTouchListener])
    ], TouchListenerImpl);
    TouchListener = TouchListenerImpl;
}
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    View.prototype.observe = function (type, callback, thisArg) {
        _super.prototype.observe.call(this, type, callback, thisArg);
        if (this.isLoaded && !this.touchListenerIsSet) {
            this.setOnTouchListener();
        }
    };
    View.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.setOnTouchListener();
    };
    View.prototype.onUnloaded = function () {
        if (this.touchListenerIsSet) {
            this.nativeView.setOnTouchListener(null);
            this.touchListenerIsSet = false;
        }
        this._cancelAllAnimations();
        _super.prototype.onUnloaded.call(this);
    };
    View.prototype.hasGestureObservers = function () {
        return this._gestureObservers && Object.keys(this._gestureObservers).length > 0;
    };
    View.prototype.setOnTouchListener = function () {
        if (this.nativeView && this.hasGestureObservers()) {
            this.touchListenerIsSet = true;
            if (this.nativeView.setClickable) {
                this.nativeView.setClickable(true);
            }
            initializeTouchListener();
            this.touchListener = this.touchListener || new TouchListener(this);
            this.nativeView.setOnTouchListener(this.touchListener);
        }
    };
    Object.defineProperty(View.prototype, "isLayoutRequired", {
        get: function () {
            return !this.isLayoutValid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "isLayoutValid", {
        get: function () {
            if (this.nativeView) {
                return !this.nativeView.isLayoutRequested();
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    View.prototype.layoutNativeView = function (left, top, right, bottom) {
        if (this.nativeView) {
            this.nativeView.layout(left, top, right, bottom);
        }
    };
    View.prototype.requestLayout = function () {
        _super.prototype.requestLayout.call(this);
        if (this.nativeView) {
            return this.nativeView.requestLayout();
        }
    };
    View.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        _super.prototype.measure.call(this, widthMeasureSpec, heightMeasureSpec);
        this.onMeasure(widthMeasureSpec, heightMeasureSpec);
    };
    View.prototype.layout = function (left, top, right, bottom) {
        _super.prototype.layout.call(this, left, top, right, bottom);
        this.onLayout(left, top, right, bottom);
    };
    View.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var view = this.nativeView;
        if (view) {
            view.measure(widthMeasureSpec, heightMeasureSpec);
            this.setMeasuredDimension(view.getMeasuredWidth(), view.getMeasuredHeight());
        }
    };
    View.prototype.onLayout = function (left, top, right, bottom) {
        var view = this.nativeView;
        if (view) {
            this.layoutNativeView(left, top, right, bottom);
        }
    };
    View.prototype._getCurrentLayoutBounds = function () {
        if (this.nativeView && !this.isCollapsed) {
            return {
                left: this.nativeView.getLeft(),
                top: this.nativeView.getTop(),
                right: this.nativeView.getRight(),
                bottom: this.nativeView.getBottom()
            };
        }
        else {
            return { left: 0, top: 0, right: 0, bottom: 0 };
        }
    };
    View.prototype.getMeasuredWidth = function () {
        if (this.nativeView) {
            return this.nativeView.getMeasuredWidth();
        }
        return _super.prototype.getMeasuredWidth.call(this);
    };
    View.prototype.getMeasuredHeight = function () {
        if (this.nativeView) {
            return this.nativeView.getMeasuredHeight();
        }
        return _super.prototype.getMeasuredHeight.call(this);
    };
    View.prototype.focus = function () {
        if (this.nativeView) {
            return this.nativeView.requestFocus();
        }
        return false;
    };
    View.prototype.getLocationInWindow = function () {
        if (!this.nativeView || !this.nativeView.getWindowToken()) {
            return undefined;
        }
        var nativeArray = Array.create("int", 2);
        this.nativeView.getLocationInWindow(nativeArray);
        return {
            x: view_common_1.layout.toDeviceIndependentPixels(nativeArray[0]),
            y: view_common_1.layout.toDeviceIndependentPixels(nativeArray[1]),
        };
    };
    View.prototype.getLocationOnScreen = function () {
        if (!this.nativeView || !this.nativeView.getWindowToken()) {
            return undefined;
        }
        var nativeArray = Array.create("int", 2);
        this.nativeView.getLocationOnScreen(nativeArray);
        return {
            x: view_common_1.layout.toDeviceIndependentPixels(nativeArray[0]),
            y: view_common_1.layout.toDeviceIndependentPixels(nativeArray[1]),
        };
    };
    View.prototype.getLocationRelativeTo = function (otherView) {
        if (!this.nativeView || !this.nativeView.getWindowToken() ||
            !otherView.nativeView || !otherView.nativeView.getWindowToken() ||
            this.nativeView.getWindowToken() !== otherView.nativeView.getWindowToken()) {
            return undefined;
        }
        var myArray = Array.create("int", 2);
        this.nativeView.getLocationOnScreen(myArray);
        var otherArray = Array.create("int", 2);
        otherView.nativeView.getLocationOnScreen(otherArray);
        return {
            x: view_common_1.layout.toDeviceIndependentPixels(myArray[0] - otherArray[0]),
            y: view_common_1.layout.toDeviceIndependentPixels(myArray[1] - otherArray[1]),
        };
    };
    View.resolveSizeAndState = function (size, specSize, specMode, childMeasuredState) {
        var result = size;
        switch (specMode) {
            case view_common_1.layout.UNSPECIFIED:
                result = size;
                break;
            case view_common_1.layout.AT_MOST:
                if (specSize < size) {
                    result = specSize | view_common_1.layout.MEASURED_STATE_TOO_SMALL;
                }
                break;
            case view_common_1.layout.EXACTLY:
                result = specSize;
                break;
        }
        return result | (childMeasuredState & view_common_1.layout.MEASURED_STATE_MASK);
    };
    View.prototype[view_common_1.isEnabledProperty.getDefault] = function () {
        return this.nativeView.isEnabled();
    };
    View.prototype[view_common_1.isEnabledProperty.setNative] = function (value) {
        this.nativeView.setEnabled(value);
    };
    View.prototype[view_common_1.originXProperty.getDefault] = function () {
        return this.nativeView.getPivotX();
    };
    View.prototype[view_common_1.originXProperty.setNative] = function (value) {
        org.nativescript.widgets.OriginPoint.setX(this.nativeView, value);
    };
    View.prototype[view_common_1.originYProperty.getDefault] = function () {
        return this.nativeView.getPivotY();
    };
    View.prototype[view_common_1.originYProperty.setNative] = function (value) {
        org.nativescript.widgets.OriginPoint.setY(this.nativeView, value);
    };
    View.prototype[view_common_1.automationTextProperty.getDefault] = function () {
        return this.nativeView.getContentDescription();
    };
    View.prototype[view_common_1.automationTextProperty.setNative] = function (value) {
        this.nativeView.setContentDescription(value);
    };
    View.prototype[view_common_1.isUserInteractionEnabledProperty.getDefault] = function () {
        return true;
    };
    View.prototype[view_common_1.isUserInteractionEnabledProperty.setNative] = function (value) {
        if (!value) {
            initializeDisabledListener();
            this.nativeView.setOnTouchListener(disableUserInteractionListener);
        }
        else {
            this.setOnTouchListener();
        }
    };
    View.prototype[style_properties_1.visibilityProperty.getDefault] = function () {
        var nativeVisibility = this.nativeView.getVisibility();
        switch (nativeVisibility) {
            case android.view.View.VISIBLE:
                return "visible";
            case android.view.View.INVISIBLE:
                return "hidden";
            case android.view.View.GONE:
                return "collapse";
            default:
                throw new Error("Unsupported android.view.View visibility: " + nativeVisibility + ". Currently supported values are android.view.View.VISIBLE, android.view.View.INVISIBLE, android.view.View.GONE.");
        }
    };
    View.prototype[style_properties_1.visibilityProperty.setNative] = function (value) {
        switch (value) {
            case "visible":
                this.nativeView.setVisibility(android.view.View.VISIBLE);
                break;
            case "hidden":
                this.nativeView.setVisibility(android.view.View.INVISIBLE);
                break;
            case "collapse":
                this.nativeView.setVisibility(android.view.View.GONE);
                break;
            default:
                throw new Error("Invalid visibility value: " + value + ". Valid values are: visible, hidden, collapse.");
        }
    };
    View.prototype[style_properties_1.opacityProperty.getDefault] = function () {
        return this.nativeView.getAlpha();
    };
    View.prototype[style_properties_1.opacityProperty.setNative] = function (value) {
        this.nativeView.setAlpha(float(value));
    };
    View.prototype[style_properties_1.horizontalAlignmentProperty.getDefault] = function () {
        return org.nativescript.widgets.ViewHelper.getHorizontalAlignment(this.nativeView);
    };
    View.prototype[style_properties_1.horizontalAlignmentProperty.setNative] = function (value) {
        var nativeView = this.nativeView;
        var lp = nativeView.getLayoutParams() || new org.nativescript.widgets.CommonLayoutParams();
        if (lp.gravity !== undefined) {
            switch (value) {
                case "left":
                    lp.gravity = android.view.Gravity.LEFT | (lp.gravity & android.view.Gravity.VERTICAL_GRAVITY_MASK);
                    break;
                case "center":
                    lp.gravity = android.view.Gravity.CENTER_HORIZONTAL | (lp.gravity & android.view.Gravity.VERTICAL_GRAVITY_MASK);
                    break;
                case "right":
                    lp.gravity = android.view.Gravity.RIGHT | (lp.gravity & android.view.Gravity.VERTICAL_GRAVITY_MASK);
                    break;
                case "stretch":
                    lp.gravity = android.view.Gravity.FILL_HORIZONTAL | (lp.gravity & android.view.Gravity.VERTICAL_GRAVITY_MASK);
                    break;
            }
            nativeView.setLayoutParams(lp);
        }
    };
    View.prototype[style_properties_1.verticalAlignmentProperty.getDefault] = function () {
        return org.nativescript.widgets.ViewHelper.getVerticalAlignment(this.nativeView);
    };
    View.prototype[style_properties_1.verticalAlignmentProperty.setNative] = function (value) {
        var nativeView = this.nativeView;
        var lp = nativeView.getLayoutParams() || new org.nativescript.widgets.CommonLayoutParams();
        if (lp.gravity !== undefined) {
            switch (value) {
                case "top":
                    lp.gravity = android.view.Gravity.TOP | (lp.gravity & android.view.Gravity.HORIZONTAL_GRAVITY_MASK);
                    break;
                case "middle":
                    lp.gravity = android.view.Gravity.CENTER_VERTICAL | (lp.gravity & android.view.Gravity.HORIZONTAL_GRAVITY_MASK);
                    break;
                case "bottom":
                    lp.gravity = android.view.Gravity.BOTTOM | (lp.gravity & android.view.Gravity.HORIZONTAL_GRAVITY_MASK);
                    break;
                case "stretch":
                    lp.gravity = android.view.Gravity.FILL_VERTICAL | (lp.gravity & android.view.Gravity.HORIZONTAL_GRAVITY_MASK);
                    break;
            }
            nativeView.setLayoutParams(lp);
        }
    };
    View.prototype[style_properties_1.rotateProperty.getDefault] = function () {
        return org.nativescript.widgets.ViewHelper.getRotate(this.nativeView);
    };
    View.prototype[style_properties_1.rotateProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setRotate(this.nativeView, float(value));
    };
    View.prototype[style_properties_1.scaleXProperty.getDefault] = function () {
        return org.nativescript.widgets.ViewHelper.getScaleX(this.nativeView);
    };
    View.prototype[style_properties_1.scaleXProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setScaleX(this.nativeView, float(value));
    };
    View.prototype[style_properties_1.scaleYProperty.getDefault] = function () {
        return org.nativescript.widgets.ViewHelper.getScaleY(this.nativeView);
    };
    View.prototype[style_properties_1.scaleYProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setScaleY(this.nativeView, float(value));
    };
    View.prototype[style_properties_1.translateXProperty.getDefault] = function () {
        return view_common_1.layout.toDeviceIndependentPixels(org.nativescript.widgets.ViewHelper.getTranslateX(this.nativeView));
    };
    View.prototype[style_properties_1.translateXProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setTranslateX(this.nativeView, view_common_1.layout.toDevicePixels(value));
    };
    View.prototype[style_properties_1.translateYProperty.getDefault] = function () {
        return view_common_1.layout.toDeviceIndependentPixels(org.nativescript.widgets.ViewHelper.getTranslateY(this.nativeView));
    };
    View.prototype[style_properties_1.translateYProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setTranslateY(this.nativeView, view_common_1.layout.toDevicePixels(value));
    };
    View.prototype[style_properties_1.zIndexProperty.getDefault] = function () {
        return org.nativescript.widgets.ViewHelper.getZIndex(this.nativeView);
    };
    View.prototype[style_properties_1.zIndexProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setZIndex(this.nativeView, value);
    };
    View.prototype[style_properties_1.backgroundInternalProperty.getDefault] = function () {
        return this.nativeView.getBackground();
    };
    View.prototype[style_properties_1.backgroundInternalProperty.setNative] = function (value) {
        if (value instanceof android.graphics.drawable.Drawable) {
            this.nativeView.setBackground(value);
        }
        else {
            background_1.ad.onBackgroundOrBorderPropertyChanged(this);
        }
    };
    View.prototype[style_properties_1.minWidthProperty.setNative] = function (value) {
        if (this.parent instanceof CustomLayoutView && this.parent.nativeView) {
            this.parent._setChildMinWidthNative(this);
        }
        else {
            this._setMinWidthNative(this.minWidth);
        }
    };
    View.prototype[style_properties_1.minHeightProperty.setNative] = function (value) {
        if (this.parent instanceof CustomLayoutView && this.parent.nativeView) {
            this.parent._setChildMinHeightNative(this);
        }
        else {
            this._setMinHeightNative(this.minHeight);
        }
    };
    return View;
}(view_common_1.ViewCommon));
exports.View = View;
var CustomLayoutView = (function (_super) {
    __extends(CustomLayoutView, _super);
    function CustomLayoutView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomLayoutView.prototype.createNativeView = function () {
        return new org.nativescript.widgets.ContentLayout(this._context);
    };
    CustomLayoutView.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        if (atIndex === void 0) { atIndex = -1; }
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (this.nativeView && child.nativeView) {
            if (view_common_1.traceEnabled()) {
                view_common_1.traceWrite(this + ".nativeView.addView(" + child + ".nativeView, " + atIndex + ")", view_common_1.traceCategories.VisualTreeEvents);
            }
            this.nativeView.addView(child.nativeView, atIndex);
            if (child instanceof View) {
                this._updateNativeLayoutParams(child);
            }
            return true;
        }
        return false;
    };
    CustomLayoutView.prototype._updateNativeLayoutParams = function (child) {
        this._setChildMinWidthNative(child);
        this._setChildMinHeightNative(child);
    };
    CustomLayoutView.prototype._setChildMinWidthNative = function (child) {
        child._setMinWidthNative(child.minWidth);
    };
    CustomLayoutView.prototype._setChildMinHeightNative = function (child) {
        child._setMinHeightNative(child.minHeight);
    };
    CustomLayoutView.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (this.nativeView && child.nativeView) {
            this.nativeView.removeView(child.nativeView);
            if (view_common_1.traceEnabled()) {
                view_common_1.traceWrite(this + ".nativeView.removeView(" + child + ".nativeView)", view_common_1.traceCategories.VisualTreeEvents);
                view_common_1.traceNotifyEvent(child, "childInLayoutRemovedFromNativeVisualTree");
            }
        }
    };
    return CustomLayoutView;
}(View));
exports.CustomLayoutView = CustomLayoutView;
var percentNotSupported = function (view, value) { throw new Error("PercentLength is not supported."); };
function createNativePercentLengthProperty(options) {
    var getter = options.getter, setter = options.setter, _a = options.auto, auto = _a === void 0 ? 0 : _a;
    var setPixels, getPixels, setPercent;
    if (getter) {
        View.prototype[getter] = function () {
            if (options) {
                setPixels = options.setPixels;
                getPixels = options.getPixels;
                setPercent = options.setPercent || percentNotSupported;
                options = null;
            }
            var value = getPixels(this.nativeView);
            if (value == auto) {
                return "auto";
            }
            else {
                return { value: value, unit: "px" };
            }
        };
    }
    if (setter) {
        View.prototype[setter] = function (length) {
            if (options) {
                setPixels = options.setPixels;
                getPixels = options.getPixels;
                setPercent = options.setPercent || percentNotSupported;
                options = null;
            }
            if (length == "auto") {
                setPixels(this.nativeView, auto);
            }
            else if (typeof length === "number") {
                setPixels(this.nativeView, view_common_1.layout.round(view_common_1.layout.toDevicePixels(length)));
            }
            else if (length.unit == "dip") {
                setPixels(this.nativeView, view_common_1.layout.round(view_common_1.layout.toDevicePixels(length.value)));
            }
            else if (length.unit == "px") {
                setPixels(this.nativeView, view_common_1.layout.round(length.value));
            }
            else if (length.unit == "%") {
                setPercent(this.nativeView, length.value);
            }
            else {
                throw new Error("Unsupported PercentLength " + length);
            }
        };
    }
}
createNativePercentLengthProperty({
    getter: style_properties_1.marginTopProperty.getDefault,
    setter: style_properties_1.marginTopProperty.setNative,
    get getPixels() { return org.nativescript.widgets.ViewHelper.getMarginTop; },
    get setPixels() { return org.nativescript.widgets.ViewHelper.setMarginTop; },
    get setPercent() { return org.nativescript.widgets.ViewHelper.setMarginTopPercent; }
});
createNativePercentLengthProperty({
    getter: style_properties_1.marginRightProperty.getDefault,
    setter: style_properties_1.marginRightProperty.setNative,
    get getPixels() { return org.nativescript.widgets.ViewHelper.getMarginRight; },
    get setPixels() { return org.nativescript.widgets.ViewHelper.setMarginRight; },
    get setPercent() { return org.nativescript.widgets.ViewHelper.setMarginRightPercent; }
});
createNativePercentLengthProperty({
    getter: style_properties_1.marginBottomProperty.getDefault,
    setter: style_properties_1.marginBottomProperty.setNative,
    get getPixels() { return org.nativescript.widgets.ViewHelper.getMarginBottom; },
    get setPixels() { return org.nativescript.widgets.ViewHelper.setMarginBottom; },
    get setPercent() { return org.nativescript.widgets.ViewHelper.setMarginBottomPercent; }
});
createNativePercentLengthProperty({
    getter: style_properties_1.marginLeftProperty.getDefault,
    setter: style_properties_1.marginLeftProperty.setNative,
    get getPixels() { return org.nativescript.widgets.ViewHelper.getMarginLeft; },
    get setPixels() { return org.nativescript.widgets.ViewHelper.setMarginLeft; },
    get setPercent() { return org.nativescript.widgets.ViewHelper.setMarginLeftPercent; }
});
createNativePercentLengthProperty({
    getter: style_properties_1.widthProperty.getDefault,
    setter: style_properties_1.widthProperty.setNative,
    auto: -1,
    get getPixels() { return org.nativescript.widgets.ViewHelper.getWidth; },
    get setPixels() { return org.nativescript.widgets.ViewHelper.setWidth; },
    get setPercent() { return org.nativescript.widgets.ViewHelper.setWidthPercent; }
});
createNativePercentLengthProperty({
    getter: style_properties_1.heightProperty.getDefault,
    setter: style_properties_1.heightProperty.setNative,
    auto: -1,
    get getPixels() { return org.nativescript.widgets.ViewHelper.getHeight; },
    get setPixels() { return org.nativescript.widgets.ViewHelper.setHeight; },
    get setPercent() { return org.nativescript.widgets.ViewHelper.setHeightPercent; }
});
createNativePercentLengthProperty({
    setter: "_setMinWidthNative",
    get setPixels() { return org.nativescript.widgets.ViewHelper.setMinWidth; }
});
createNativePercentLengthProperty({
    setter: "_setMinHeightNative",
    get setPixels() { return org.nativescript.widgets.ViewHelper.setMinHeight; }
});
//# sourceMappingURL=view.js.map