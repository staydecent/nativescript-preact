Object.defineProperty(exports, "__esModule", { value: true });
var content_view_1 = require("../content-view");
var Border = (function (_super) {
    __extends(Border, _super);
    function Border() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Border.prototype, "cornerRadius", {
        get: function () {
            if (typeof this.borderRadius === "number") {
                return this.borderRadius;
            }
            return 0;
        },
        set: function (value) {
            this.borderRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Border.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = content_view_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = content_view_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = content_view_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = content_view_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var horizontalBorderLength = this.effectiveBorderLeftWidth + this.effectiveBorderRightWidth;
        var verticalBorderLength = this.effectiveBorderTopWidth + this.effectiveBorderBottomWidth;
        var result = content_view_1.View.measureChild(this, this.layoutView, content_view_1.layout.makeMeasureSpec(width - horizontalBorderLength, widthMode), content_view_1.layout.makeMeasureSpec(height - verticalBorderLength, heightMode));
        var widthAndState = content_view_1.View.resolveSizeAndState(result.measuredWidth + horizontalBorderLength, width, widthMode, 0);
        var heightAndState = content_view_1.View.resolveSizeAndState(result.measuredHeight + verticalBorderLength, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Border.prototype.onLayout = function (left, top, right, bottom) {
        var horizontalBorderLength = this.effectiveBorderLeftWidth + this.effectiveBorderRightWidth;
        var verticalBorderLength = this.effectiveBorderTopWidth + this.effectiveBorderBottomWidth;
        content_view_1.View.layoutChild(this, this.layoutView, this.effectiveBorderLeftWidth, this.effectiveBorderTopWidth, right - left - horizontalBorderLength, bottom - top - verticalBorderLength);
    };
    return Border;
}(content_view_1.ContentView));
Border = __decorate([
    Deprecated
], Border);
exports.Border = Border;
//# sourceMappingURL=border.js.map