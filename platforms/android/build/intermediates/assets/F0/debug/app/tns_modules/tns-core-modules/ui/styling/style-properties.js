Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../../color");
var font_1 = require("./font");
var utils_1 = require("../../utils/utils");
var background_1 = require("./background");
var platform_1 = require("../../platform");
var style_1 = require("./style");
var properties_1 = require("../core/properties");
function equalsCommon(a, b) {
    if (a == "auto") {
        return b == "auto";
    }
    if (typeof a === "number") {
        if (b == "auto") {
            return false;
        }
        if (typeof b === "number") {
            return a == b;
        }
        return b.unit == "dip" && a == b.value;
    }
    if (b == "auto") {
        return false;
    }
    if (typeof b === "number") {
        return a.unit == "dip" && a.value == b;
    }
    return a.value == b.value && a.unit == b.unit;
}
function convertToStringCommon(length) {
    if (length == "auto") {
        return "auto";
    }
    if (typeof length === "number") {
        return length.toString();
    }
    var val = length.value;
    if (length.unit === "%") {
        val *= 100;
    }
    return val + length.unit;
}
function toDevicePixelsCommon(length, auto, parentAvailableWidth) {
    if (auto === void 0) { auto = Number.NaN; }
    if (parentAvailableWidth === void 0) { parentAvailableWidth = Number.NaN; }
    if (length == "auto") {
        return auto;
    }
    if (typeof length === "number") {
        return utils_1.layout.round(utils_1.layout.toDevicePixels(length));
    }
    switch (length.unit) {
        case "px":
            return utils_1.layout.round(length.value);
        case "%":
            return utils_1.layout.round(parentAvailableWidth * length.value);
        case "dip":
        default:
            return utils_1.layout.round(utils_1.layout.toDevicePixels(length.value));
    }
}
var PercentLength;
(function (PercentLength) {
    function parse(fromValue) {
        if (fromValue == "auto") {
            return "auto";
        }
        if (typeof fromValue === "string") {
            var stringValue = fromValue.trim();
            var percentIndex = stringValue.indexOf("%");
            if (percentIndex !== -1) {
                var value = void 0;
                if (percentIndex !== (stringValue.length - 1) || percentIndex === 0) {
                    value = Number.NaN;
                }
                else {
                    value = parseFloat(stringValue.substring(0, stringValue.length - 1).trim()) / 100;
                }
                if (isNaN(value) || !isFinite(value)) {
                    throw new Error("Invalid value: " + fromValue);
                }
                return { unit: "%", value: value };
            }
            else if (stringValue.indexOf("px") !== -1) {
                stringValue = stringValue.replace("px", "").trim();
                var value = parseFloat(stringValue);
                if (isNaN(value) || !isFinite(value)) {
                    throw new Error("Invalid value: " + fromValue);
                }
                return { unit: "px", value: value };
            }
            else {
                var value = parseFloat(stringValue);
                if (isNaN(value) || !isFinite(value)) {
                    throw new Error("Invalid value: " + fromValue);
                }
                return value;
            }
        }
        else {
            return fromValue;
        }
    }
    PercentLength.parse = parse;
    PercentLength.equals = equalsCommon;
    PercentLength.toDevicePixels = toDevicePixelsCommon;
    PercentLength.convertToString = convertToStringCommon;
})(PercentLength = exports.PercentLength || (exports.PercentLength = {}));
var Length;
(function (Length) {
    function parse(fromValue) {
        if (fromValue == "auto") {
            return "auto";
        }
        if (typeof fromValue === "string") {
            var stringValue = fromValue.trim();
            if (stringValue.indexOf("px") !== -1) {
                stringValue = stringValue.replace("px", "").trim();
                var value = parseFloat(stringValue);
                if (isNaN(value) || !isFinite(value)) {
                    throw new Error("Invalid value: " + stringValue);
                }
                return { unit: "px", value: value };
            }
            else {
                var value = parseFloat(stringValue);
                if (isNaN(value) || !isFinite(value)) {
                    throw new Error("Invalid value: " + stringValue);
                }
                return value;
            }
        }
        else {
            return fromValue;
        }
    }
    Length.parse = parse;
    Length.equals = equalsCommon;
    Length.toDevicePixels = toDevicePixelsCommon;
    Length.convertToString = convertToStringCommon;
})(Length = exports.Length || (exports.Length = {}));
exports.zeroLength = { value: 0, unit: "px" };
exports.minWidthProperty = new properties_1.CssProperty({
    name: "minWidth", cssName: "min-width", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        target.view.effectiveMinWidth = Length.toDevicePixels(newValue, 0);
    }, valueConverter: Length.parse
});
exports.minWidthProperty.register(style_1.Style);
exports.minHeightProperty = new properties_1.CssProperty({
    name: "minHeight", cssName: "min-height", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        target.view.effectiveMinHeight = Length.toDevicePixels(newValue, 0);
    }, valueConverter: Length.parse
});
exports.minHeightProperty.register(style_1.Style);
exports.widthProperty = new properties_1.CssProperty({ name: "width", cssName: "width", defaultValue: "auto", affectsLayout: platform_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.widthProperty.register(style_1.Style);
exports.heightProperty = new properties_1.CssProperty({ name: "height", cssName: "height", defaultValue: "auto", affectsLayout: platform_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.heightProperty.register(style_1.Style);
var marginProperty = new properties_1.ShorthandProperty({
    name: "margin", cssName: "margin",
    getter: function () {
        if (PercentLength.equals(this.marginTop, this.marginRight) &&
            PercentLength.equals(this.marginTop, this.marginBottom) &&
            PercentLength.equals(this.marginTop, this.marginLeft)) {
            return this.marginTop;
        }
        return PercentLength.convertToString(this.marginTop) + " " + PercentLength.convertToString(this.marginRight) + " " + PercentLength.convertToString(this.marginBottom) + " " + PercentLength.convertToString(this.marginLeft);
    },
    converter: convertToMargins
});
marginProperty.register(style_1.Style);
exports.marginLeftProperty = new properties_1.CssProperty({ name: "marginLeft", cssName: "margin-left", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.marginLeftProperty.register(style_1.Style);
exports.marginRightProperty = new properties_1.CssProperty({ name: "marginRight", cssName: "margin-right", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.marginRightProperty.register(style_1.Style);
exports.marginTopProperty = new properties_1.CssProperty({ name: "marginTop", cssName: "margin-top", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.marginTopProperty.register(style_1.Style);
exports.marginBottomProperty = new properties_1.CssProperty({ name: "marginBottom", cssName: "margin-bottom", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.marginBottomProperty.register(style_1.Style);
var paddingProperty = new properties_1.ShorthandProperty({
    name: "padding", cssName: "padding",
    getter: function () {
        if (Length.equals(this.paddingTop, this.paddingRight) &&
            Length.equals(this.paddingTop, this.paddingBottom) &&
            Length.equals(this.paddingTop, this.paddingLeft)) {
            return this.paddingTop;
        }
        return Length.convertToString(this.paddingTop) + " " + Length.convertToString(this.paddingRight) + " " + Length.convertToString(this.paddingBottom) + " " + Length.convertToString(this.paddingLeft);
    },
    converter: convertToPaddings
});
paddingProperty.register(style_1.Style);
exports.paddingLeftProperty = new properties_1.CssProperty({
    name: "paddingLeft", cssName: "padding-left", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        target.view.effectivePaddingLeft = Length.toDevicePixels(newValue, 0);
    }, valueConverter: Length.parse
});
exports.paddingLeftProperty.register(style_1.Style);
exports.paddingRightProperty = new properties_1.CssProperty({
    name: "paddingRight", cssName: "padding-right", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        target.view.effectivePaddingRight = Length.toDevicePixels(newValue, 0);
    }, valueConverter: Length.parse
});
exports.paddingRightProperty.register(style_1.Style);
exports.paddingTopProperty = new properties_1.CssProperty({
    name: "paddingTop", cssName: "padding-top", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        target.view.effectivePaddingTop = Length.toDevicePixels(newValue, 0);
    }, valueConverter: Length.parse
});
exports.paddingTopProperty.register(style_1.Style);
exports.paddingBottomProperty = new properties_1.CssProperty({
    name: "paddingBottom", cssName: "padding-bottom", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        target.view.effectivePaddingBottom = Length.toDevicePixels(newValue, 0);
    }, valueConverter: Length.parse
});
exports.paddingBottomProperty.register(style_1.Style);
var HorizontalAlignment;
(function (HorizontalAlignment) {
    HorizontalAlignment.LEFT = "left";
    HorizontalAlignment.CENTER = "center";
    HorizontalAlignment.RIGHT = "right";
    HorizontalAlignment.STRETCH = "stretch";
    HorizontalAlignment.isValid = properties_1.makeValidator(HorizontalAlignment.LEFT, HorizontalAlignment.CENTER, HorizontalAlignment.RIGHT, HorizontalAlignment.STRETCH);
    HorizontalAlignment.parse = properties_1.makeParser(HorizontalAlignment.isValid);
})(HorizontalAlignment = exports.HorizontalAlignment || (exports.HorizontalAlignment = {}));
exports.horizontalAlignmentProperty = new properties_1.CssProperty({ name: "horizontalAlignment", cssName: "horizontal-align", defaultValue: HorizontalAlignment.STRETCH, affectsLayout: platform_1.isIOS, valueConverter: HorizontalAlignment.parse });
exports.horizontalAlignmentProperty.register(style_1.Style);
var VerticalAlignment;
(function (VerticalAlignment) {
    VerticalAlignment.TOP = "top";
    VerticalAlignment.MIDDLE = "middle";
    VerticalAlignment.BOTTOM = "bottom";
    VerticalAlignment.STRETCH = "stretch";
    VerticalAlignment.isValid = properties_1.makeValidator(VerticalAlignment.TOP, VerticalAlignment.MIDDLE, VerticalAlignment.BOTTOM, VerticalAlignment.STRETCH);
    VerticalAlignment.parse = function (value) { return value.toLowerCase() === "center" ? VerticalAlignment.MIDDLE : parseStrict(value); };
    var parseStrict = properties_1.makeParser(VerticalAlignment.isValid);
})(VerticalAlignment = exports.VerticalAlignment || (exports.VerticalAlignment = {}));
exports.verticalAlignmentProperty = new properties_1.CssProperty({ name: "verticalAlignment", cssName: "vertical-align", defaultValue: VerticalAlignment.STRETCH, affectsLayout: platform_1.isIOS, valueConverter: VerticalAlignment.parse });
exports.verticalAlignmentProperty.register(style_1.Style);
function parseThickness(value) {
    if (typeof value === "string") {
        var arr = value.split(/[ ,]+/);
        var top_1;
        var right = void 0;
        var bottom = void 0;
        var left = void 0;
        if (arr.length === 1) {
            top_1 = arr[0];
            right = arr[0];
            bottom = arr[0];
            left = arr[0];
        }
        else if (arr.length === 2) {
            top_1 = arr[0];
            bottom = arr[0];
            right = arr[1];
            left = arr[1];
        }
        else if (arr.length === 3) {
            top_1 = arr[0];
            right = arr[1];
            left = arr[1];
            bottom = arr[2];
        }
        else if (arr.length === 4) {
            top_1 = arr[0];
            right = arr[1];
            bottom = arr[2];
            left = arr[3];
        }
        else {
            throw new Error("Expected 1, 2, 3 or 4 parameters. Actual: " + value);
        }
        return {
            top: top_1,
            right: right,
            bottom: bottom,
            left: left
        };
    }
    else {
        return value;
    }
}
function convertToMargins(value) {
    if (typeof value === "string" && value !== "auto") {
        var thickness = parseThickness(value);
        return [
            [exports.marginTopProperty, PercentLength.parse(thickness.top)],
            [exports.marginRightProperty, PercentLength.parse(thickness.right)],
            [exports.marginBottomProperty, PercentLength.parse(thickness.bottom)],
            [exports.marginLeftProperty, PercentLength.parse(thickness.left)]
        ];
    }
    else {
        return [
            [exports.marginTopProperty, value],
            [exports.marginRightProperty, value],
            [exports.marginBottomProperty, value],
            [exports.marginLeftProperty, value]
        ];
    }
}
function convertToPaddings(value) {
    if (typeof value === "string" && value !== "auto") {
        var thickness = parseThickness(value);
        return [
            [exports.paddingTopProperty, Length.parse(thickness.top)],
            [exports.paddingRightProperty, Length.parse(thickness.right)],
            [exports.paddingBottomProperty, Length.parse(thickness.bottom)],
            [exports.paddingLeftProperty, Length.parse(thickness.left)]
        ];
    }
    else {
        return [
            [exports.paddingTopProperty, value],
            [exports.paddingRightProperty, value],
            [exports.paddingBottomProperty, value],
            [exports.paddingLeftProperty, value]
        ];
    }
}
exports.rotateProperty = new properties_1.CssAnimationProperty({ name: "rotate", cssName: "rotate", defaultValue: 0, valueConverter: parseFloat });
exports.rotateProperty.register(style_1.Style);
exports.scaleXProperty = new properties_1.CssAnimationProperty({ name: "scaleX", cssName: "scaleX", defaultValue: 1, valueConverter: parseFloat });
exports.scaleXProperty.register(style_1.Style);
exports.scaleYProperty = new properties_1.CssAnimationProperty({ name: "scaleY", cssName: "scaleY", defaultValue: 1, valueConverter: parseFloat });
exports.scaleYProperty.register(style_1.Style);
function parseDIPs(value) {
    if (value.indexOf("px") !== -1) {
        return utils_1.layout.toDeviceIndependentPixels(parseFloat(value.replace("px", "").trim()));
    }
    else {
        return parseFloat(value.replace("dip", "").trim());
    }
}
exports.translateXProperty = new properties_1.CssAnimationProperty({ name: "translateX", cssName: "translateX", defaultValue: 0, valueConverter: parseDIPs });
exports.translateXProperty.register(style_1.Style);
exports.translateYProperty = new properties_1.CssAnimationProperty({ name: "translateY", cssName: "translateY", defaultValue: 0, valueConverter: parseDIPs });
exports.translateYProperty.register(style_1.Style);
var transformProperty = new properties_1.ShorthandProperty({
    name: "transform", cssName: "transform",
    getter: function () {
        var scaleX = this.scaleX;
        var scaleY = this.scaleY;
        var translateX = this.translateX;
        var translateY = this.translateY;
        var rotate = this.rotate;
        var result = "";
        if (translateX !== 0 || translateY !== 0) {
            result += "translate(" + translateX + ", " + translateY + ") ";
        }
        if (scaleX !== 1 || scaleY !== 1) {
            result += "scale(" + scaleX + ", " + scaleY + ") ";
        }
        if (rotate !== 0) {
            result += "rotate (" + rotate + ")";
        }
        return result.trim();
    },
    converter: convertToTransform
});
transformProperty.register(style_1.Style);
function transformConverter(value) {
    if (value.indexOf("none") !== -1) {
        var operations_1 = {};
        operations_1[value] = value;
        return operations_1;
    }
    var operations = {};
    var operator = "";
    var pos = 0;
    while (pos < value.length) {
        if (value[pos] === " " || value[pos] === ",") {
            pos++;
        }
        else if (value[pos] === "(") {
            var start = pos + 1;
            while (pos < value.length && value[pos] !== ")") {
                pos++;
            }
            var operand = value.substring(start, pos);
            operations[operator] = operand.trim();
            operator = "";
            pos++;
        }
        else {
            operator += value[pos++];
        }
    }
    return operations;
}
function convertToTransform(value) {
    var newTransform = value === properties_1.unsetValue ? { "none": "none" } : transformConverter(value);
    var array = [];
    var values;
    for (var transform in newTransform) {
        switch (transform) {
            case "scaleX":
                array.push([exports.scaleXProperty, newTransform[transform]]);
                break;
            case "scaleY":
                array.push([exports.scaleYProperty, newTransform[transform]]);
                break;
            case "scale":
            case "scale3d":
                values = newTransform[transform].split(",");
                if (values.length >= 2) {
                    array.push([exports.scaleXProperty, values[0]]);
                    array.push([exports.scaleYProperty, values[1]]);
                }
                else if (values.length === 1) {
                    array.push([exports.scaleXProperty, values[0]]);
                    array.push([exports.scaleYProperty, values[0]]);
                }
                break;
            case "translateX":
                array.push([exports.translateXProperty, newTransform[transform]]);
                break;
            case "translateY":
                array.push([exports.translateYProperty, newTransform[transform]]);
                break;
            case "translate":
            case "translate3d":
                values = newTransform[transform].split(",");
                if (values.length >= 2) {
                    array.push([exports.translateXProperty, values[0]]);
                    array.push([exports.translateYProperty, values[1]]);
                }
                else if (values.length === 1) {
                    array.push([exports.translateXProperty, values[0]]);
                    array.push([exports.translateYProperty, values[0]]);
                }
                break;
            case "rotate":
                var text = newTransform[transform];
                var val = parseFloat(text);
                if (text.slice(-3) === "rad") {
                    val = val * (180.0 / Math.PI);
                }
                array.push([exports.rotateProperty, val]);
                break;
            case "none":
                array.push([exports.scaleXProperty, 1]);
                array.push([exports.scaleYProperty, 1]);
                array.push([exports.translateXProperty, 0]);
                array.push([exports.translateYProperty, 0]);
                array.push([exports.rotateProperty, 0]);
                break;
        }
    }
    return array;
}
exports.backgroundInternalProperty = new properties_1.CssProperty({
    name: "backgroundInternal",
    cssName: "_backgroundInternal",
    defaultValue: background_1.Background.default
});
exports.backgroundInternalProperty.register(style_1.Style);
exports.backgroundImageProperty = new properties_1.CssProperty({
    name: "backgroundImage", cssName: "background-image", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withImage(newValue);
    }
});
exports.backgroundImageProperty.register(style_1.Style);
exports.backgroundColorProperty = new properties_1.CssAnimationProperty({
    name: "backgroundColor", cssName: "background-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withColor(newValue);
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.backgroundColorProperty.register(style_1.Style);
var BackgroundRepeat;
(function (BackgroundRepeat) {
    BackgroundRepeat.REPEAT = "repeat";
    BackgroundRepeat.REPEAT_X = "repeat-x";
    BackgroundRepeat.REPEAT_Y = "repeat-y";
    BackgroundRepeat.NO_REPEAT = "no-repeat";
    BackgroundRepeat.isValid = properties_1.makeValidator(BackgroundRepeat.REPEAT, BackgroundRepeat.REPEAT_X, BackgroundRepeat.REPEAT_Y, BackgroundRepeat.NO_REPEAT);
    BackgroundRepeat.parse = properties_1.makeParser(BackgroundRepeat.isValid);
})(BackgroundRepeat = exports.BackgroundRepeat || (exports.BackgroundRepeat = {}));
exports.backgroundRepeatProperty = new properties_1.CssProperty({
    name: "backgroundRepeat", cssName: "background-repeat", valueConverter: BackgroundRepeat.parse,
    valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withRepeat(newValue);
    }
});
exports.backgroundRepeatProperty.register(style_1.Style);
exports.backgroundSizeProperty = new properties_1.CssProperty({
    name: "backgroundSize", cssName: "background-size", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withSize(newValue);
    }
});
exports.backgroundSizeProperty.register(style_1.Style);
exports.backgroundPositionProperty = new properties_1.CssProperty({
    name: "backgroundPosition", cssName: "background-position", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withPosition(newValue);
    }
});
exports.backgroundPositionProperty.register(style_1.Style);
function parseBorderColor(value) {
    var result = { top: undefined, right: undefined, bottom: undefined, left: undefined };
    if (value.indexOf("rgb") === 0) {
        result.top = result.right = result.bottom = result.left = new color_1.Color(value);
        return result;
    }
    var arr = value.split(/[ ,]+/);
    if (arr.length === 1) {
        var arr0 = new color_1.Color(arr[0]);
        result.top = arr0;
        result.right = arr0;
        result.bottom = arr0;
        result.left = arr0;
    }
    else if (arr.length === 2) {
        var arr0 = new color_1.Color(arr[0]);
        var arr1 = new color_1.Color(arr[1]);
        result.top = arr0;
        result.right = arr1;
        result.bottom = arr0;
        result.left = arr1;
    }
    else if (arr.length === 3) {
        var arr0 = new color_1.Color(arr[0]);
        var arr1 = new color_1.Color(arr[1]);
        var arr2 = new color_1.Color(arr[2]);
        result.top = arr0;
        result.right = arr1;
        result.bottom = arr2;
        result.left = arr1;
    }
    else if (arr.length === 4) {
        var arr0 = new color_1.Color(arr[0]);
        var arr1 = new color_1.Color(arr[1]);
        var arr2 = new color_1.Color(arr[2]);
        var arr3 = new color_1.Color(arr[3]);
        result.top = arr0;
        result.right = arr1;
        result.bottom = arr2;
        result.left = arr3;
    }
    else {
        throw new Error("Expected 1, 2, 3 or 4 parameters. Actual: " + value);
    }
    return result;
}
var borderColorProperty = new properties_1.ShorthandProperty({
    name: "borderColor", cssName: "border-color",
    getter: function () {
        if (color_1.Color.equals(this.borderTopColor, this.borderRightColor) &&
            color_1.Color.equals(this.borderTopColor, this.borderBottomColor) &&
            color_1.Color.equals(this.borderTopColor, this.borderLeftColor)) {
            return this.borderTopColor;
        }
        else {
            return this.borderTopColor + " " + this.borderRightColor + " " + this.borderBottomColor + " " + this.borderLeftColor;
        }
    },
    converter: function (value) {
        if (typeof value === "string") {
            var fourColors = parseBorderColor(value);
            return [
                [exports.borderTopColorProperty, fourColors.top],
                [exports.borderRightColorProperty, fourColors.right],
                [exports.borderBottomColorProperty, fourColors.bottom],
                [exports.borderLeftColorProperty, fourColors.left]
            ];
        }
        else {
            return [
                [exports.borderTopColorProperty, value],
                [exports.borderRightColorProperty, value],
                [exports.borderBottomColorProperty, value],
                [exports.borderLeftColorProperty, value]
            ];
        }
    }
});
borderColorProperty.register(style_1.Style);
exports.borderTopColorProperty = new properties_1.CssProperty({
    name: "borderTopColor", cssName: "border-top-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderTopColor(newValue);
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.borderTopColorProperty.register(style_1.Style);
exports.borderRightColorProperty = new properties_1.CssProperty({
    name: "borderRightColor", cssName: "border-right-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderRightColor(newValue);
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.borderRightColorProperty.register(style_1.Style);
exports.borderBottomColorProperty = new properties_1.CssProperty({
    name: "borderBottomColor", cssName: "border-bottom-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderBottomColor(newValue);
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.borderBottomColorProperty.register(style_1.Style);
exports.borderLeftColorProperty = new properties_1.CssProperty({
    name: "borderLeftColor", cssName: "border-left-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderLeftColor(newValue);
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.borderLeftColorProperty.register(style_1.Style);
var borderWidthProperty = new properties_1.ShorthandProperty({
    name: "borderWidth", cssName: "border-width",
    getter: function () {
        if (Length.equals(this.borderTopWidth, this.borderRightWidth) &&
            Length.equals(this.borderTopWidth, this.borderBottomWidth) &&
            Length.equals(this.borderTopWidth, this.borderLeftWidth)) {
            return this.borderTopWidth;
        }
        else {
            return Length.convertToString(this.borderTopWidth) + " " + Length.convertToString(this.borderRightWidth) + " " + Length.convertToString(this.borderBottomWidth) + " " + Length.convertToString(this.borderLeftWidth);
        }
    },
    converter: function (value) {
        if (typeof value === "string" && value !== "auto") {
            var borderWidths = parseThickness(value);
            return [
                [exports.borderTopWidthProperty, borderWidths.top],
                [exports.borderRightWidthProperty, borderWidths.right],
                [exports.borderBottomWidthProperty, borderWidths.bottom],
                [exports.borderLeftWidthProperty, borderWidths.left]
            ];
        }
        else {
            return [
                [exports.borderTopWidthProperty, value],
                [exports.borderRightWidthProperty, value],
                [exports.borderBottomWidthProperty, value],
                [exports.borderLeftWidthProperty, value]
            ];
        }
    }
});
borderWidthProperty.register(style_1.Style);
exports.borderTopWidthProperty = new properties_1.CssProperty({
    name: "borderTopWidth", cssName: "border-top-width", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-top-width should be Non-Negative Finite number. Value: " + value);
        }
        target.view.effectiveBorderTopWidth = value;
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderTopWidth(value);
    }, valueConverter: Length.parse
});
exports.borderTopWidthProperty.register(style_1.Style);
exports.borderRightWidthProperty = new properties_1.CssProperty({
    name: "borderRightWidth", cssName: "border-right-width", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-right-width should be Non-Negative Finite number. Value: " + value);
        }
        target.view.effectiveBorderRightWidth = value;
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderRightWidth(value);
    }, valueConverter: Length.parse
});
exports.borderRightWidthProperty.register(style_1.Style);
exports.borderBottomWidthProperty = new properties_1.CssProperty({
    name: "borderBottomWidth", cssName: "border-bottom-width", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-bottom-width should be Non-Negative Finite number. Value: " + value);
        }
        target.view.effectiveBorderBottomWidth = value;
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderBottomWidth(value);
    }, valueConverter: Length.parse
});
exports.borderBottomWidthProperty.register(style_1.Style);
exports.borderLeftWidthProperty = new properties_1.CssProperty({
    name: "borderLeftWidth", cssName: "border-left-width", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-left-width should be Non-Negative Finite number. Value: " + value);
        }
        target.view.effectiveBorderLeftWidth = value;
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderLeftWidth(value);
    }, valueConverter: Length.parse
});
exports.borderLeftWidthProperty.register(style_1.Style);
var borderRadiusProperty = new properties_1.ShorthandProperty({
    name: "borderRadius", cssName: "border-radius",
    getter: function () {
        if (Length.equals(this.borderTopLeftRadius, this.borderTopRightRadius) &&
            Length.equals(this.borderTopLeftRadius, this.borderBottomRightRadius) &&
            Length.equals(this.borderTopLeftRadius, this.borderBottomLeftRadius)) {
            return this.borderTopLeftRadius;
        }
        return Length.convertToString(this.borderTopLeftRadius) + " " + Length.convertToString(this.borderTopRightRadius) + " " + Length.convertToString(this.borderBottomRightRadius) + " " + Length.convertToString(this.borderBottomLeftRadius);
    },
    converter: function (value) {
        if (typeof value === "string") {
            var borderRadius = parseThickness(value);
            return [
                [exports.borderTopLeftRadiusProperty, borderRadius.top],
                [exports.borderTopRightRadiusProperty, borderRadius.right],
                [exports.borderBottomRightRadiusProperty, borderRadius.bottom],
                [exports.borderBottomLeftRadiusProperty, borderRadius.left]
            ];
        }
        else {
            return [
                [exports.borderTopLeftRadiusProperty, value],
                [exports.borderTopRightRadiusProperty, value],
                [exports.borderBottomRightRadiusProperty, value],
                [exports.borderBottomLeftRadiusProperty, value]
            ];
        }
    }
});
borderRadiusProperty.register(style_1.Style);
exports.borderTopLeftRadiusProperty = new properties_1.CssProperty({
    name: "borderTopLeftRadius", cssName: "border-top-left-radius", defaultValue: 0, affectsLayout: platform_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-top-left-radius should be Non-Negative Finite number. Value: " + value);
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderTopLeftRadius(value);
    }, valueConverter: Length.parse
});
exports.borderTopLeftRadiusProperty.register(style_1.Style);
exports.borderTopRightRadiusProperty = new properties_1.CssProperty({
    name: "borderTopRightRadius", cssName: "border-top-right-radius", defaultValue: 0, affectsLayout: platform_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-top-right-radius should be Non-Negative Finite number. Value: " + value);
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderTopRightRadius(value);
    }, valueConverter: Length.parse
});
exports.borderTopRightRadiusProperty.register(style_1.Style);
exports.borderBottomRightRadiusProperty = new properties_1.CssProperty({
    name: "borderBottomRightRadius", cssName: "border-bottom-right-radius", defaultValue: 0, affectsLayout: platform_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-bottom-right-radius should be Non-Negative Finite number. Value: " + value);
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderBottomRightRadius(value);
    }, valueConverter: Length.parse
});
exports.borderBottomRightRadiusProperty.register(style_1.Style);
exports.borderBottomLeftRadiusProperty = new properties_1.CssProperty({
    name: "borderBottomLeftRadius", cssName: "border-bottom-left-radius", defaultValue: 0, affectsLayout: platform_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-bottom-left-radius should be Non-Negative Finite number. Value: " + value);
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderBottomLeftRadius(value);
    }, valueConverter: Length.parse
});
exports.borderBottomLeftRadiusProperty.register(style_1.Style);
function isNonNegativeFiniteNumber(value) {
    return isFinite(value) && !isNaN(value) && value >= 0;
}
var supportedPaths = ["rect", "circle", "ellipse", "polygon", "inset"];
function isClipPathValid(value) {
    if (!value) {
        return true;
    }
    var functionName = value.substring(0, value.indexOf("(")).trim();
    return supportedPaths.indexOf(functionName) !== -1;
}
exports.clipPathProperty = new properties_1.CssProperty({
    name: "clipPath", cssName: "clip-path", valueChanged: function (target, oldValue, newValue) {
        if (!isClipPathValid(newValue)) {
            throw new Error("clip-path is not valid.");
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withClipPath(newValue);
    }
});
exports.clipPathProperty.register(style_1.Style);
function isFloatValueConverter(value) {
    var newValue = parseFloat(value);
    if (isNaN(newValue)) {
        throw new Error("Invalid value: " + newValue);
    }
    return newValue;
}
exports.zIndexProperty = new properties_1.CssProperty({ name: "zIndex", cssName: "z-index", defaultValue: Number.NaN, valueConverter: isFloatValueConverter });
exports.zIndexProperty.register(style_1.Style);
function opacityConverter(value) {
    var newValue = parseFloat(value);
    if (!isNaN(newValue) && 0 <= newValue && newValue <= 1) {
        return newValue;
    }
    throw new Error("Opacity should be between [0, 1]. Value: " + newValue);
}
exports.opacityProperty = new properties_1.CssAnimationProperty({ name: "opacity", cssName: "opacity", defaultValue: 1, valueConverter: opacityConverter });
exports.opacityProperty.register(style_1.Style);
exports.colorProperty = new properties_1.InheritedCssProperty({ name: "color", cssName: "color", equalityComparer: color_1.Color.equals, valueConverter: function (v) { return new color_1.Color(v); } });
exports.colorProperty.register(style_1.Style);
exports.fontInternalProperty = new properties_1.CssProperty({ name: "fontInternal", cssName: "_fontInternal", defaultValue: font_1.Font.default });
exports.fontInternalProperty.register(style_1.Style);
exports.fontFamilyProperty = new properties_1.InheritedCssProperty({
    name: "fontFamily", cssName: "font-family", affectsLayout: platform_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var currentFont = target.fontInternal;
        if (currentFont.fontFamily !== newValue) {
            var newFont = currentFont.withFontFamily(newValue);
            target.fontInternal = font_1.Font.equals(font_1.Font.default, newFont) ? properties_1.unsetValue : newFont;
        }
    }
});
exports.fontFamilyProperty.register(style_1.Style);
exports.fontSizeProperty = new properties_1.InheritedCssProperty({
    name: "fontSize", cssName: "font-size", affectsLayout: platform_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var currentFont = target.fontInternal;
        if (currentFont.fontSize !== newValue) {
            var newFont = currentFont.withFontSize(newValue);
            target.fontInternal = font_1.Font.equals(font_1.Font.default, newFont) ? properties_1.unsetValue : newFont;
        }
    },
    valueConverter: function (v) { return parseFloat(v); }
});
exports.fontSizeProperty.register(style_1.Style);
exports.fontStyleProperty = new properties_1.InheritedCssProperty({
    name: "fontStyle", cssName: "font-style", affectsLayout: platform_1.isIOS, defaultValue: font_1.FontStyle.NORMAL, valueConverter: font_1.FontStyle.parse, valueChanged: function (target, oldValue, newValue) {
        var currentFont = target.fontInternal;
        if (currentFont.fontStyle !== newValue) {
            var newFont = currentFont.withFontStyle(newValue);
            target.fontInternal = font_1.Font.equals(font_1.Font.default, newFont) ? properties_1.unsetValue : newFont;
        }
    }
});
exports.fontStyleProperty.register(style_1.Style);
exports.fontWeightProperty = new properties_1.InheritedCssProperty({
    name: "fontWeight", cssName: "font-weight", affectsLayout: platform_1.isIOS, defaultValue: font_1.FontWeight.NORMAL, valueConverter: font_1.FontWeight.parse, valueChanged: function (target, oldValue, newValue) {
        var currentFont = target.fontInternal;
        if (currentFont.fontWeight !== newValue) {
            var newFont = currentFont.withFontWeight(newValue);
            target.fontInternal = font_1.Font.equals(font_1.Font.default, newFont) ? properties_1.unsetValue : newFont;
        }
    }
});
exports.fontWeightProperty.register(style_1.Style);
var fontProperty = new properties_1.ShorthandProperty({
    name: "font", cssName: "font",
    getter: function () {
        return this.fontStyle + " " + this.fontWeight + " " + this.fontSize + " " + this.fontFamily;
    },
    converter: function (value) {
        if (value === properties_1.unsetValue) {
            return [
                [exports.fontStyleProperty, properties_1.unsetValue],
                [exports.fontWeightProperty, properties_1.unsetValue],
                [exports.fontSizeProperty, properties_1.unsetValue],
                [exports.fontFamilyProperty, properties_1.unsetValue]
            ];
        }
        else {
            var font = font_1.parseFont(value);
            var fontSize = parseFloat(font.fontSize);
            return [
                [exports.fontStyleProperty, font.fontStyle],
                [exports.fontWeightProperty, font.fontWeight],
                [exports.fontSizeProperty, fontSize],
                [exports.fontFamilyProperty, font.fontFamily]
            ];
        }
    }
});
fontProperty.register(style_1.Style);
var Visibility;
(function (Visibility) {
    Visibility.VISIBLE = "visible";
    Visibility.HIDDEN = "hidden";
    Visibility.COLLAPSE = "collapse";
    Visibility.isValid = properties_1.makeValidator(Visibility.VISIBLE, Visibility.HIDDEN, Visibility.COLLAPSE);
    Visibility.parse = function (value) { return value.toLowerCase() === "collapsed" ? Visibility.COLLAPSE : parseStrict(value); };
    var parseStrict = properties_1.makeParser(Visibility.isValid);
})(Visibility = exports.Visibility || (exports.Visibility = {}));
exports.visibilityProperty = new properties_1.CssProperty({
    name: "visibility", cssName: "visibility", defaultValue: Visibility.VISIBLE, affectsLayout: platform_1.isIOS, valueConverter: Visibility.parse, valueChanged: function (target, oldValue, newValue) {
        target.view.isCollapsed = (newValue === Visibility.COLLAPSE);
    }
});
exports.visibilityProperty.register(style_1.Style);
//# sourceMappingURL=style-properties.js.map