Object.defineProperty(exports, "__esModule", { value: true });
var layout_base_1 = require("../layouts/layout-base");
var ProxyViewContainer = (function (_super) {
    __extends(ProxyViewContainer, _super);
    function ProxyViewContainer() {
        var _this = _super.call(this) || this;
        _this.nativeView = undefined;
        return _this;
    }
    Object.defineProperty(ProxyViewContainer.prototype, "ios", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyViewContainer.prototype, "android", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyViewContainer.prototype, "isLayoutRequested", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    ProxyViewContainer.prototype.createNativeView = function () {
        return undefined;
    };
    ProxyViewContainer.prototype._getNativeViewsCount = function () {
        var result = 0;
        this.eachChildView(function (cv) {
            result += cv._getNativeViewsCount();
            return true;
        });
        return result;
    };
    ProxyViewContainer.prototype._eachLayoutView = function (callback) {
        this.eachChildView(function (cv) {
            if (!cv.isCollapsed) {
                cv._eachLayoutView(callback);
            }
            return true;
        });
    };
    ProxyViewContainer.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        if (layout_base_1.traceEnabled()) {
            layout_base_1.traceWrite("ViewContainer._addViewToNativeVisualTree for a child " + child + " ViewContainer.parent: " + this.parent, layout_base_1.traceCategories.ViewHierarchy);
        }
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        var parent = this.parent;
        if (parent instanceof layout_base_1.View) {
            var baseIndex = 0;
            var insideIndex = 0;
            if (parent instanceof layout_base_1.LayoutBase) {
                baseIndex = parent._childIndexToNativeChildIndex(parent.getChildIndex(this));
            }
            if (atIndex !== undefined) {
                insideIndex = this._childIndexToNativeChildIndex(atIndex);
            }
            else {
                insideIndex = this._getNativeViewsCount();
            }
            if (layout_base_1.traceEnabled()) {
                layout_base_1.traceWrite("ProxyViewContainer._addViewToNativeVisualTree at: " + atIndex + " base: " + baseIndex + " additional: " + insideIndex, layout_base_1.traceCategories.ViewHierarchy);
            }
            return parent._addViewToNativeVisualTree(child, baseIndex + insideIndex);
        }
        return false;
    };
    ProxyViewContainer.prototype._removeViewFromNativeVisualTree = function (child) {
        if (layout_base_1.traceEnabled()) {
            layout_base_1.traceWrite("ProxyViewContainer._removeViewFromNativeVisualTree for a child " + child + " ViewContainer.parent: " + this.parent, layout_base_1.traceCategories.ViewHierarchy);
        }
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        var parent = this.parent;
        if (parent instanceof layout_base_1.View) {
            return parent._removeViewFromNativeVisualTree(child);
        }
    };
    ProxyViewContainer.prototype._registerLayoutChild = function (child) {
        var parent = this.parent;
        if (parent instanceof layout_base_1.LayoutBase) {
            parent._registerLayoutChild(child);
        }
    };
    ProxyViewContainer.prototype._unregisterLayoutChild = function (child) {
        var parent = this.parent;
        if (parent instanceof layout_base_1.LayoutBase) {
            parent._unregisterLayoutChild(child);
        }
    };
    ProxyViewContainer.prototype._parentChanged = function (oldParent) {
        _super.prototype._parentChanged.call(this, oldParent);
        var addingToParent = this.parent && !oldParent;
        var newLayout = this.parent;
        var oldLayout = oldParent;
        if (addingToParent && newLayout instanceof layout_base_1.LayoutBase) {
            this.eachChildView(function (child) {
                newLayout._registerLayoutChild(child);
                return true;
            });
        }
        else if (oldLayout instanceof layout_base_1.LayoutBase) {
            this.eachChildView(function (child) {
                oldLayout._unregisterLayoutChild(child);
                return true;
            });
        }
    };
    return ProxyViewContainer;
}(layout_base_1.LayoutBase));
exports.ProxyViewContainer = ProxyViewContainer;
//# sourceMappingURL=proxy-view-container.js.map