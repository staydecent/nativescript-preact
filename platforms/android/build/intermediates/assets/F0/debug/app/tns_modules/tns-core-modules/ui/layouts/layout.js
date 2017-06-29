function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var layout_base_1 = require("./layout-base");
__export(require("./layout-base"));
var OWNER = Symbol("_owner");
var NativeViewGroup;
function initializeNativeViewGroup() {
    if (NativeViewGroup) {
        return;
    }
    var NativeViewGroupImpl = (function (_super) {
        __extends(NativeViewGroupImpl, _super);
        function NativeViewGroupImpl(context) {
            var _this = _super.call(this, context) || this;
            return global.__native(_this);
        }
        NativeViewGroupImpl.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
            var owner = this[OWNER];
            owner.onMeasure(widthMeasureSpec, heightMeasureSpec);
            this.setMeasuredDimension(owner.getMeasuredWidth(), owner.getMeasuredHeight());
        };
        NativeViewGroupImpl.prototype.onLayout = function (changed, left, top, right, bottom) {
            var owner = this[OWNER];
            owner.onLayout(left, top, right, bottom);
        };
        return NativeViewGroupImpl;
    }(android.view.ViewGroup));
    NativeViewGroup = NativeViewGroupImpl;
}
var Layout = (function (_super) {
    __extends(Layout, _super);
    function Layout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Layout.prototype.createNativeView = function () {
        initializeNativeViewGroup();
        return new NativeViewGroup(this._context);
    };
    Layout.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this.nativeView[OWNER] = this;
    };
    Layout.prototype.disposeNativeView = function () {
        this.nativeView[OWNER] = undefined;
        _super.prototype.disposeNativeView.call(this);
    };
    Layout.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
        var view = this.nativeView;
        if (view) {
            if (layout_base_1.traceEnabled()) {
                layout_base_1.traceWrite(this + " :measure: " + layout_base_1.layout.measureSpecToString(widthMeasureSpec) + ", " + layout_base_1.layout.measureSpecToString(heightMeasureSpec), layout_base_1.traceCategories.Layout);
            }
            view.measure(widthMeasureSpec, heightMeasureSpec);
        }
    };
    Layout.prototype.layout = function (left, top, right, bottom) {
        this._setCurrentLayoutBounds(left, top, right, bottom);
        var view = this.nativeView;
        if (view) {
            this.layoutNativeView(left, top, right, bottom);
            if (layout_base_1.traceEnabled()) {
                layout_base_1.traceWrite(this + " :layout: " + left + ", " + top + ", " + (right - left) + ", " + (bottom - top), layout_base_1.traceCategories.Layout);
            }
        }
    };
    Layout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
    };
    Layout.prototype.onLayout = function (left, top, right, bottom) {
    };
    Layout.prototype.setMeasuredDimension = function (measuredWidth, measuredHeight) {
        _super.prototype.setMeasuredDimension.call(this, measuredWidth, measuredHeight);
        this._measuredWidth = measuredWidth;
        this._measuredHeight = measuredHeight;
    };
    Layout.prototype.getMeasuredWidth = function () {
        return this._measuredWidth;
    };
    Layout.prototype.getMeasuredHeight = function () {
        return this._measuredHeight;
    };
    return Layout;
}(layout_base_1.LayoutBase));
exports.Layout = Layout;
//# sourceMappingURL=layout.js.map