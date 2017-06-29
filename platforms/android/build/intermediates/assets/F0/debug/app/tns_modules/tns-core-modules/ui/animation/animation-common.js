Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../../color");
exports.Color = color_1.Color;
var trace_1 = require("../../trace");
exports.traceEnabled = trace_1.isEnabled;
exports.traceWrite = trace_1.write;
exports.traceCategories = trace_1.categories;
var Properties;
(function (Properties) {
    Properties.opacity = "opacity";
    Properties.backgroundColor = "backgroundColor";
    Properties.translate = "translate";
    Properties.rotate = "rotate";
    Properties.scale = "scale";
})(Properties = exports.Properties || (exports.Properties = {}));
var CubicBezierAnimationCurve = (function () {
    function CubicBezierAnimationCurve(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    return CubicBezierAnimationCurve;
}());
exports.CubicBezierAnimationCurve = CubicBezierAnimationCurve;
var AnimationBase = (function () {
    function AnimationBase(animationDefinitions, playSequentially) {
        if (!animationDefinitions || animationDefinitions.length === 0) {
            throw new Error("No animation definitions specified");
        }
        if (trace_1.isEnabled()) {
            trace_1.write("Analyzing " + animationDefinitions.length + " animation definitions...", trace_1.categories.Animation);
        }
        this._propertyAnimations = new Array();
        for (var i = 0, length_1 = animationDefinitions.length; i < length_1; i++) {
            if (animationDefinitions[i].curve) {
                animationDefinitions[i].curve = this._resolveAnimationCurve(animationDefinitions[i].curve);
            }
            this._propertyAnimations = this._propertyAnimations.concat(AnimationBase._createPropertyAnimations(animationDefinitions[i]));
        }
        if (this._propertyAnimations.length === 0) {
            throw new Error("Nothing to animate.");
        }
        if (trace_1.isEnabled()) {
            trace_1.write("Created " + this._propertyAnimations.length + " individual property animations.", trace_1.categories.Animation);
        }
        this._playSequentially = playSequentially;
    }
    AnimationBase.prototype.play = function () {
        var _this = this;
        if (this.isPlaying) {
            throw new Error("Animation is already playing.");
        }
        var animationFinishedPromise = new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
        this.fixupAnimationPromise(animationFinishedPromise);
        this._isPlaying = true;
        return animationFinishedPromise;
    };
    AnimationBase.prototype.fixupAnimationPromise = function (promise) {
        var _this = this;
        promise.cancel = function () {
            _this.cancel();
        };
        var _then = promise.then;
        promise.then = function () {
            var r = _then.apply(promise, arguments);
            _this.fixupAnimationPromise(r);
            return r;
        };
        var _catch = promise.catch;
        promise.catch = function () {
            var r = _catch.apply(promise, arguments);
            _this.fixupAnimationPromise(r);
            return r;
        };
    };
    AnimationBase.prototype.cancel = function () {
        if (!this.isPlaying) {
            throw new Error("Animation is not currently playing.");
        }
    };
    Object.defineProperty(AnimationBase.prototype, "isPlaying", {
        get: function () {
            return this._isPlaying;
        },
        enumerable: true,
        configurable: true
    });
    AnimationBase.prototype._resolveAnimationFinishedPromise = function () {
        this._isPlaying = false;
        this._resolve();
    };
    AnimationBase.prototype._rejectAnimationFinishedPromise = function () {
        this._isPlaying = false;
        this._reject(new Error("Animation cancelled."));
    };
    AnimationBase._createPropertyAnimations = function (animationDefinition) {
        if (!animationDefinition.target) {
            throw new Error("No animation target specified.");
        }
        for (var item in animationDefinition) {
            if (animationDefinition[item] === undefined) {
                continue;
            }
            if ((item === Properties.opacity ||
                item === Properties.rotate ||
                item === "duration" ||
                item === "delay" ||
                item === "iterations") && typeof animationDefinition[item] !== "number") {
                throw new Error("Property " + item + " must be valid number. Value: " + animationDefinition[item]);
            }
            else if ((item === Properties.scale || item === Properties.translate) &&
                (typeof animationDefinition[item].x !== "number" || typeof animationDefinition[item].y !== "number")) {
                throw new Error("Property " + item + " must be valid Pair. Value: " + animationDefinition[item]);
            }
            else if (item === Properties.backgroundColor && !color_1.Color.isValid(animationDefinition.backgroundColor)) {
                throw new Error("Property " + item + " must be valid color. Value: " + animationDefinition[item]);
            }
        }
        var propertyAnimations = new Array();
        if (animationDefinition.opacity !== undefined) {
            propertyAnimations.push({
                target: animationDefinition.target,
                property: Properties.opacity,
                value: animationDefinition.opacity,
                duration: animationDefinition.duration,
                delay: animationDefinition.delay,
                iterations: animationDefinition.iterations,
                curve: animationDefinition.curve
            });
        }
        if (animationDefinition.backgroundColor !== undefined) {
            propertyAnimations.push({
                target: animationDefinition.target,
                property: Properties.backgroundColor,
                value: typeof animationDefinition.backgroundColor === "string" ?
                    new color_1.Color(animationDefinition.backgroundColor) : animationDefinition.backgroundColor,
                duration: animationDefinition.duration,
                delay: animationDefinition.delay,
                iterations: animationDefinition.iterations,
                curve: animationDefinition.curve
            });
        }
        if (animationDefinition.translate !== undefined) {
            propertyAnimations.push({
                target: animationDefinition.target,
                property: Properties.translate,
                value: animationDefinition.translate,
                duration: animationDefinition.duration,
                delay: animationDefinition.delay,
                iterations: animationDefinition.iterations,
                curve: animationDefinition.curve
            });
        }
        if (animationDefinition.scale !== undefined) {
            propertyAnimations.push({
                target: animationDefinition.target,
                property: Properties.scale,
                value: animationDefinition.scale,
                duration: animationDefinition.duration,
                delay: animationDefinition.delay,
                iterations: animationDefinition.iterations,
                curve: animationDefinition.curve
            });
        }
        if (animationDefinition.rotate !== undefined) {
            propertyAnimations.push({
                target: animationDefinition.target,
                property: Properties.rotate,
                value: animationDefinition.rotate,
                duration: animationDefinition.duration,
                delay: animationDefinition.delay,
                iterations: animationDefinition.iterations,
                curve: animationDefinition.curve
            });
        }
        if (propertyAnimations.length === 0) {
            throw new Error("No animation property specified.");
        }
        return propertyAnimations;
    };
    AnimationBase._getAnimationInfo = function (animation) {
        return JSON.stringify({
            target: animation.target.id,
            property: animation.property,
            value: animation.value,
            duration: animation.duration,
            delay: animation.delay,
            iterations: animation.iterations,
            curve: animation.curve
        });
    };
    return AnimationBase;
}());
exports.AnimationBase = AnimationBase;
//# sourceMappingURL=animation-common.js.map