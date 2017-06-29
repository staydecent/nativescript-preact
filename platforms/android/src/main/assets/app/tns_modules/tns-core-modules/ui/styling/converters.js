Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../../color");
var animation_1 = require("../animation");
function colorConverter(value) {
    return new color_1.Color(value);
}
exports.colorConverter = colorConverter;
function floatConverter(value) {
    var result = parseFloat(value);
    return result;
}
exports.floatConverter = floatConverter;
function fontSizeConverter(value) {
    return floatConverter(value);
}
exports.fontSizeConverter = fontSizeConverter;
exports.numberConverter = parseFloat;
function opacityConverter(value) {
    var result = parseFloat(value);
    result = Math.max(0.0, result);
    result = Math.min(1.0, result);
    return result;
}
exports.opacityConverter = opacityConverter;
function timeConverter(value) {
    var result = parseFloat(value);
    if (value.indexOf("ms") === -1) {
        result = result * 1000;
    }
    return Math.max(0.0, result);
}
exports.timeConverter = timeConverter;
function bezieArgumentConverter(value) {
    var result = parseFloat(value);
    result = Math.max(0.0, result);
    result = Math.min(1.0, result);
    return result;
}
exports.bezieArgumentConverter = bezieArgumentConverter;
function animationTimingFunctionConverter(value) {
    var result = "ease";
    switch (value) {
        case "ease":
            result = "ease";
            break;
        case "linear":
            result = "linear";
            break;
        case "ease-in":
            result = "easeIn";
            break;
        case "ease-out":
            result = "easeOut";
            break;
        case "ease-in-out":
            result = "easeInOut";
            break;
        case "spring":
            result = "spring";
            break;
        default:
            if (value.indexOf("cubic-bezier(") === 0) {
                var bezierArr = value.substring(13).split(/[,]+/);
                if (bezierArr.length !== 4) {
                    throw new Error("Invalid value for animation: " + value);
                }
                result = new animation_1.CubicBezierAnimationCurve(bezieArgumentConverter(bezierArr[0]), bezieArgumentConverter(bezierArr[1]), bezieArgumentConverter(bezierArr[2]), bezieArgumentConverter(bezierArr[3]));
            }
            else {
                throw new Error("Invalid value for animation: " + value);
            }
            break;
    }
    return result;
}
exports.animationTimingFunctionConverter = animationTimingFunctionConverter;
function transformConverter(value) {
    if (value === "none") {
        var operations = {};
        operations[value] = value;
        return operations;
    }
    else if (typeof value === "string") {
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
    else {
        return undefined;
    }
}
exports.transformConverter = transformConverter;
//# sourceMappingURL=converters.js.map