Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../../color");
var Background = (function () {
    function Background() {
        this.borderTopWidth = 0;
        this.borderRightWidth = 0;
        this.borderBottomWidth = 0;
        this.borderLeftWidth = 0;
        this.borderTopLeftRadius = 0;
        this.borderTopRightRadius = 0;
        this.borderBottomLeftRadius = 0;
        this.borderBottomRightRadius = 0;
    }
    Background.prototype.clone = function () {
        var clone = new Background();
        clone.color = this.color;
        clone.image = this.image;
        clone.repeat = this.repeat;
        clone.position = this.position;
        clone.size = this.size;
        clone.borderTopColor = this.borderTopColor;
        clone.borderRightColor = this.borderRightColor;
        clone.borderBottomColor = this.borderBottomColor;
        clone.borderLeftColor = this.borderLeftColor;
        clone.borderTopWidth = this.borderTopWidth;
        clone.borderRightWidth = this.borderRightWidth;
        clone.borderBottomWidth = this.borderBottomWidth;
        clone.borderLeftWidth = this.borderLeftWidth;
        clone.borderTopLeftRadius = this.borderTopLeftRadius;
        clone.borderTopRightRadius = this.borderTopRightRadius;
        clone.borderBottomRightRadius = this.borderBottomRightRadius;
        clone.borderBottomLeftRadius = this.borderBottomLeftRadius;
        clone.clipPath = this.clipPath;
        return clone;
    };
    Background.prototype.withColor = function (value) {
        var clone = this.clone();
        clone.color = value;
        return clone;
    };
    Background.prototype.withImage = function (value) {
        var clone = this.clone();
        clone.image = value;
        return clone;
    };
    Background.prototype.withRepeat = function (value) {
        var clone = this.clone();
        clone.repeat = value;
        return clone;
    };
    Background.prototype.withPosition = function (value) {
        var clone = this.clone();
        clone.position = value;
        return clone;
    };
    Background.prototype.withSize = function (value) {
        var clone = this.clone();
        clone.size = value;
        return clone;
    };
    Background.prototype.withBorderTopColor = function (value) {
        var clone = this.clone();
        clone.borderTopColor = value;
        return clone;
    };
    Background.prototype.withBorderRightColor = function (value) {
        var clone = this.clone();
        clone.borderRightColor = value;
        return clone;
    };
    Background.prototype.withBorderBottomColor = function (value) {
        var clone = this.clone();
        clone.borderBottomColor = value;
        return clone;
    };
    Background.prototype.withBorderLeftColor = function (value) {
        var clone = this.clone();
        clone.borderLeftColor = value;
        return clone;
    };
    Background.prototype.withBorderTopWidth = function (value) {
        var clone = this.clone();
        clone.borderTopWidth = value;
        return clone;
    };
    Background.prototype.withBorderRightWidth = function (value) {
        var clone = this.clone();
        clone.borderRightWidth = value;
        return clone;
    };
    Background.prototype.withBorderBottomWidth = function (value) {
        var clone = this.clone();
        clone.borderBottomWidth = value;
        return clone;
    };
    Background.prototype.withBorderLeftWidth = function (value) {
        var clone = this.clone();
        clone.borderLeftWidth = value;
        return clone;
    };
    Background.prototype.withBorderTopLeftRadius = function (value) {
        var clone = this.clone();
        clone.borderTopLeftRadius = value;
        return clone;
    };
    Background.prototype.withBorderTopRightRadius = function (value) {
        var clone = this.clone();
        clone.borderTopRightRadius = value;
        return clone;
    };
    Background.prototype.withBorderBottomRightRadius = function (value) {
        var clone = this.clone();
        clone.borderBottomRightRadius = value;
        return clone;
    };
    Background.prototype.withBorderBottomLeftRadius = function (value) {
        var clone = this.clone();
        clone.borderBottomLeftRadius = value;
        return clone;
    };
    Background.prototype.withClipPath = function (value) {
        var clone = this.clone();
        clone.clipPath = value;
        return clone;
    };
    Background.prototype.isEmpty = function () {
        return !this.color
            && !this.image
            && !this.hasBorderWidth()
            && !this.hasBorderRadius()
            && !this.clipPath;
    };
    Background.equals = function (value1, value2) {
        if (!value1 && !value2) {
            return true;
        }
        if (!value1 || !value2) {
            return false;
        }
        return color_1.Color.equals(value1.color, value2.color)
            && value1.image === value2.image
            && value1.position === value2.position
            && value1.repeat === value2.repeat
            && value1.size === value2.size
            && color_1.Color.equals(value1.borderTopColor, value2.borderTopColor)
            && color_1.Color.equals(value1.borderRightColor, value2.borderRightColor)
            && color_1.Color.equals(value1.borderBottomColor, value2.borderBottomColor)
            && color_1.Color.equals(value1.borderLeftColor, value2.borderLeftColor)
            && value1.borderTopWidth === value2.borderTopWidth
            && value1.borderRightWidth === value2.borderRightWidth
            && value1.borderBottomWidth === value2.borderBottomWidth
            && value1.borderLeftWidth === value2.borderLeftWidth
            && value1.borderTopLeftRadius === value2.borderTopLeftRadius
            && value1.borderTopRightRadius === value2.borderTopRightRadius
            && value1.borderBottomRightRadius === value2.borderBottomRightRadius
            && value1.borderBottomLeftRadius === value2.borderBottomLeftRadius
            && value1.clipPath === value2.clipPath;
    };
    Background.prototype.hasBorderColor = function () {
        return !!this.borderTopColor || !!this.borderRightColor || !!this.borderBottomColor || !!this.borderLeftColor;
    };
    Background.prototype.hasBorderWidth = function () {
        return this.borderTopWidth > 0
            || this.borderRightWidth > 0
            || this.borderBottomWidth > 0
            || this.borderLeftWidth > 0;
    };
    Background.prototype.hasBorderRadius = function () {
        return this.borderTopLeftRadius > 0
            || this.borderTopRightRadius > 0
            || this.borderBottomRightRadius > 0
            || this.borderBottomLeftRadius > 0;
    };
    Background.prototype.hasUniformBorderColor = function () {
        return color_1.Color.equals(this.borderTopColor, this.borderRightColor)
            && color_1.Color.equals(this.borderTopColor, this.borderBottomColor)
            && color_1.Color.equals(this.borderTopColor, this.borderLeftColor);
    };
    Background.prototype.hasUniformBorderWidth = function () {
        return this.borderTopWidth === this.borderRightWidth
            && this.borderTopWidth === this.borderBottomWidth
            && this.borderTopWidth === this.borderLeftWidth;
    };
    Background.prototype.hasUniformBorderRadius = function () {
        return this.borderTopLeftRadius === this.borderTopRightRadius
            && this.borderTopLeftRadius === this.borderBottomRightRadius
            && this.borderTopLeftRadius === this.borderBottomLeftRadius;
    };
    Background.prototype.hasUniformBorder = function () {
        return this.hasUniformBorderColor()
            && this.hasUniformBorderWidth()
            && this.hasUniformBorderRadius();
    };
    Background.prototype.getUniformBorderColor = function () {
        if (this.hasUniformBorderColor()) {
            return this.borderTopColor;
        }
        return undefined;
    };
    ;
    Background.prototype.getUniformBorderWidth = function () {
        if (this.hasUniformBorderWidth()) {
            return this.borderTopWidth;
        }
        return 0;
    };
    ;
    Background.prototype.getUniformBorderRadius = function () {
        if (this.hasUniformBorderRadius()) {
            return this.borderTopLeftRadius;
        }
        return 0;
    };
    ;
    Background.prototype.toString = function () {
        return "isEmpty: " + this.isEmpty() + "; color: " + this.color + "; image: " + this.image + "; repeat: " + this.repeat + "; position: " + this.position + "; size: " + this.size + "; borderTopColor: " + this.borderTopColor + "; borderRightColor: " + this.borderRightColor + "; borderBottomColor: " + this.borderBottomColor + "; borderLeftColor: " + this.borderLeftColor + "; borderTopWidth: " + this.borderTopWidth + "; borderRightWidth: " + this.borderRightWidth + "; borderBottomWidth: " + this.borderBottomWidth + "; borderLeftWidth: " + this.borderLeftWidth + "; borderTopLeftRadius: " + this.borderTopLeftRadius + "; borderTopRightRadius: " + this.borderTopRightRadius + "; borderBottomRightRadius: " + this.borderBottomRightRadius + "; borderBottomLeftRadius: " + this.borderBottomLeftRadius + "; clipPath: " + this.clipPath + ";";
    };
    return Background;
}());
Background.default = new Background();
exports.Background = Background;
//# sourceMappingURL=background-common.js.map