Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../../color");
var keyframe_animation_1 = require("../animation/keyframe-animation");
var converters_1 = require("../styling/converters");
var animationProperties = {
    "animation-name": function (info, declaration) { return info.name = declaration.value; },
    "animation-duration": function (info, declaration) { return info.duration = converters_1.timeConverter(declaration.value); },
    "animation-delay": function (info, declaration) { return info.delay = converters_1.timeConverter(declaration.value); },
    "animation-timing-function": function (info, declaration) { return info.curve = converters_1.animationTimingFunctionConverter(declaration.value); },
    "animation-iteration-count": function (info, declaration) { return declaration.value === "infinite" ? info.iterations = Number.MAX_VALUE : info.iterations = converters_1.numberConverter(declaration.value); },
    "animation-direction": function (info, declaration) { return info.isReverse = declaration.value === "reverse"; },
    "animation-fill-mode": function (info, declaration) { return info.isForwards = declaration.value === "forwards"; }
};
var CssAnimationParser = (function () {
    function CssAnimationParser() {
    }
    CssAnimationParser.keyframeAnimationsFromCSSDeclarations = function (declarations) {
        var animations = new Array();
        var animationInfo = undefined;
        if (declarations === null || declarations === undefined) {
            return undefined;
        }
        for (var _i = 0, declarations_1 = declarations; _i < declarations_1.length; _i++) {
            var declaration = declarations_1[_i];
            if (declaration.property === "animation") {
                keyframeAnimationsFromCSSProperty(declaration.value, animations);
            }
            else {
                var propertyHandler = animationProperties[declaration.property];
                if (propertyHandler) {
                    if (animationInfo === undefined) {
                        animationInfo = new keyframe_animation_1.KeyframeAnimationInfo();
                        animations.push(animationInfo);
                    }
                    propertyHandler(animationInfo, declaration);
                }
            }
        }
        return animations.length === 0 ? undefined : animations;
    };
    CssAnimationParser.keyframesArrayFromCSS = function (cssKeyframes) {
        var parsedKeyframes = new Array();
        for (var _i = 0, _a = cssKeyframes.keyframes; _i < _a.length; _i++) {
            var keyframe = _a[_i];
            var declarations = parseKeyframeDeclarations(keyframe);
            for (var _b = 0, _c = keyframe.values; _b < _c.length; _b++) {
                var time_1 = _c[_b];
                if (time_1 === "from") {
                    time_1 = 0;
                }
                else if (time_1 === "to") {
                    time_1 = 1;
                }
                else {
                    time_1 = parseFloat(time_1) / 100;
                    if (time_1 < 0) {
                        time_1 = 0;
                    }
                    if (time_1 > 100) {
                        time_1 = 100;
                    }
                }
                var current = parsedKeyframes[time_1];
                if (current === undefined) {
                    current = {};
                    current.duration = time_1;
                    parsedKeyframes[time_1] = current;
                }
                for (var _d = 0, _e = keyframe.declarations; _d < _e.length; _d++) {
                    var declaration = _e[_d];
                    if (declaration.property === "animation-timing-function") {
                        current.curve = converters_1.animationTimingFunctionConverter(declaration.value);
                    }
                }
                current.declarations = declarations;
            }
        }
        var array = new Array();
        for (var parsedKeyframe in parsedKeyframes) {
            array.push(parsedKeyframes[parsedKeyframe]);
        }
        array.sort(function (a, b) { return a.duration - b.duration; });
        return array;
    };
    return CssAnimationParser;
}());
exports.CssAnimationParser = CssAnimationParser;
function keyframeAnimationsFromCSSProperty(value, animations) {
    if (typeof value === "string") {
        var values = value.split(/[,]+/);
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var parsedValue = values_1[_i];
            var animationInfo = new keyframe_animation_1.KeyframeAnimationInfo();
            var arr = parsedValue.trim().split(/[ ]+/);
            if (arr.length > 0) {
                animationInfo.name = arr[0];
            }
            if (arr.length > 1) {
                animationInfo.duration = converters_1.timeConverter(arr[1]);
            }
            if (arr.length > 2) {
                animationInfo.curve = converters_1.animationTimingFunctionConverter(arr[2]);
            }
            if (arr.length > 3) {
                animationInfo.delay = converters_1.timeConverter(arr[3]);
            }
            if (arr.length > 4) {
                animationInfo.iterations = parseInt(arr[4]);
            }
            if (arr.length > 5) {
                animationInfo.isReverse = arr[4] === "reverse";
            }
            if (arr.length > 6) {
                animationInfo.isForwards = arr[5] === "forwards";
            }
            if (arr.length > 7) {
                throw new Error("Invalid value for animation: " + value);
            }
            animations.push(animationInfo);
        }
    }
}
function getTransformationValues(value) {
    var newTransform = converters_1.transformConverter(value);
    var array = new Array();
    var values = undefined;
    for (var transform in newTransform) {
        switch (transform) {
            case "scaleX":
                array.push({ propertyName: "scaleX", value: parseFloat(newTransform[transform]) });
                break;
            case "scaleY":
                array.push({ propertyName: "scaleY", value: parseFloat(newTransform[transform]) });
                break;
            case "scale":
            case "scale3d":
                values = newTransform[transform].split(",");
                if (values.length === 2 || values.length === 3) {
                    array.push({ propertyName: "scaleX", value: parseFloat(values[0]) });
                    array.push({ propertyName: "scaleY", value: parseFloat(values[1]) });
                }
                break;
            case "translateX":
                array.push({ propertyName: "translateX", value: parseFloat(newTransform[transform]) });
                break;
            case "translateY":
                array.push({ propertyName: "translateY", value: parseFloat(newTransform[transform]) });
                break;
            case "translate":
            case "translate3d":
                values = newTransform[transform].split(",");
                if (values.length === 2 || values.length === 3) {
                    array.push({ propertyName: "translateX", value: parseFloat(values[0]) });
                    array.push({ propertyName: "translateY", value: parseFloat(values[1]) });
                }
                break;
            case "rotate":
                var text = newTransform[transform];
                var val = parseFloat(text);
                if (text.slice(-3) === "rad") {
                    val = val * (180.0 / Math.PI);
                }
                array.push({ propertyName: "rotate", value: val });
                break;
            case "none":
                array.push({ propertyName: "scaleX", value: 1 });
                array.push({ propertyName: "scaleY", value: 1 });
                array.push({ propertyName: "translateX", value: 0 });
                array.push({ propertyName: "translateY", value: 0 });
                array.push({ propertyName: "rotate", value: 0 });
                break;
        }
    }
    return array;
}
function parseKeyframeDeclarations(keyframe) {
    var declarations = {};
    var transforms = { scale: undefined, translate: undefined };
    for (var _i = 0, _a = keyframe.declarations; _i < _a.length; _i++) {
        var declaration = _a[_i];
        var propertyName = declaration.property;
        var value = declaration.value;
        if (propertyName === "opacity") {
            declarations[propertyName] = parseFloat(value);
        }
        else if (propertyName === "transform") {
            var values = getTransformationValues(value);
            if (values) {
                for (var _b = 0, values_2 = values; _b < values_2.length; _b++) {
                    var pair = values_2[_b];
                    if (!preprocessAnimationValues(pair.propertyName, pair.value, transforms)) {
                        declarations[pair.propertyName] = pair.value;
                    }
                }
            }
            delete declarations[propertyName];
        }
        else if (propertyName === "backgroundColor" || propertyName === "background-color") {
            declarations["backgroundColor"] = new color_1.Color(value);
        }
        else {
            declarations[propertyName] = value;
        }
    }
    if (transforms.scale !== undefined) {
        declarations["scale"] = transforms.scale;
    }
    if (transforms.translate !== undefined) {
        declarations["translate"] = transforms.translate;
    }
    var array = new Array();
    for (var declaration in declarations) {
        var keyframeDeclaration = {};
        keyframeDeclaration.property = declaration;
        keyframeDeclaration.value = declarations[declaration];
        array.push(keyframeDeclaration);
    }
    return array;
}
function preprocessAnimationValues(propertyName, value, transforms) {
    if (propertyName === "scaleX") {
        if (transforms.scale === undefined) {
            transforms.scale = { x: 1, y: 1 };
        }
        transforms.scale.x = value;
        return true;
    }
    if (propertyName === "scaleY") {
        if (transforms.scale === undefined) {
            transforms.scale = { x: 1, y: 1 };
        }
        transforms.scale.y = value;
        return true;
    }
    if (propertyName === "translateX") {
        if (transforms.translate === undefined) {
            transforms.translate = { x: 0, y: 0 };
        }
        transforms.translate.x = value;
        return true;
    }
    if (propertyName === "translateY") {
        if (transforms.translate === undefined) {
            transforms.translate = { x: 0, y: 0 };
        }
        transforms.translate.y = value;
        return true;
    }
    return false;
}
//# sourceMappingURL=css-animation-parser.js.map