Object.defineProperty(exports, "__esModule", { value: true });
var properties_1 = require("../core/properties");
var animation_1 = require("./animation");
var style_properties_1 = require("../styling/style-properties");
var KeyframeDeclaration = (function () {
    function KeyframeDeclaration() {
    }
    return KeyframeDeclaration;
}());
exports.KeyframeDeclaration = KeyframeDeclaration;
var KeyframeInfo = (function () {
    function KeyframeInfo() {
    }
    return KeyframeInfo;
}());
exports.KeyframeInfo = KeyframeInfo;
var KeyframeAnimationInfo = (function () {
    function KeyframeAnimationInfo() {
        this.name = "";
        this.duration = 0.3;
        this.delay = 0;
        this.iterations = 1;
        this.curve = "ease";
        this.isForwards = false;
        this.isReverse = false;
    }
    return KeyframeAnimationInfo;
}());
exports.KeyframeAnimationInfo = KeyframeAnimationInfo;
var KeyframeAnimation = (function () {
    function KeyframeAnimation() {
        this.delay = 0;
        this.iterations = 1;
    }
    KeyframeAnimation.keyframeAnimationFromInfo = function (info) {
        var animations = new Array();
        var length = info.keyframes.length;
        var startDuration = 0;
        if (info.isReverse) {
            for (var index_1 = length - 1; index_1 >= 0; index_1--) {
                var keyframe = info.keyframes[index_1];
                startDuration = KeyframeAnimation.parseKeyframe(info, keyframe, animations, startDuration);
            }
        }
        else {
            for (var index_2 = 0; index_2 < length; index_2++) {
                var keyframe = info.keyframes[index_2];
                startDuration = KeyframeAnimation.parseKeyframe(info, keyframe, animations, startDuration);
            }
            for (var index_3 = length - 1; index_3 > 0; index_3--) {
                var a1 = animations[index_3];
                var a2 = animations[index_3 - 1];
                if (a2["curve"] !== undefined) {
                    a1["curve"] = a2["curve"];
                    a2["curve"] = undefined;
                }
            }
        }
        for (var index_4 = 1; index_4 < length; index_4++) {
            var a = animations[index_4];
            if (a["curve"] === undefined) {
                a["curve"] = info.curve;
            }
        }
        var animation = new KeyframeAnimation();
        animation.delay = info.delay;
        animation.iterations = info.iterations;
        animation.animations = animations;
        animation._isForwards = info.isForwards;
        return animation;
    };
    KeyframeAnimation.parseKeyframe = function (info, keyframe, animations, startDuration) {
        var animation = {};
        for (var _i = 0, _a = keyframe.declarations; _i < _a.length; _i++) {
            var declaration = _a[_i];
            animation[declaration.property] = declaration.value;
        }
        var duration = keyframe.duration;
        if (duration === 0) {
            duration = 0.01;
        }
        else {
            duration = (info.duration * duration) - startDuration;
            startDuration += duration;
        }
        animation.duration = info.isReverse ? info.duration - duration : duration;
        animation.curve = keyframe.curve;
        animation.forceLayer = true;
        animation.valueSource = "keyframe";
        animations.push(animation);
        return startDuration;
    };
    Object.defineProperty(KeyframeAnimation.prototype, "isPlaying", {
        get: function () {
            return this._isPlaying;
        },
        enumerable: true,
        configurable: true
    });
    KeyframeAnimation.prototype.cancel = function () {
        if (this._isPlaying) {
            this._isPlaying = false;
            for (var i = this._nativeAnimations.length - 1; i >= 0; i--) {
                var animation = this._nativeAnimations[i];
                if (animation.isPlaying) {
                    animation.cancel();
                }
            }
            if (this._nativeAnimations.length > 0) {
                var animation = this._nativeAnimations[0];
                this._resetAnimationValues(this._target, animation);
            }
            this._rejectAnimationFinishedPromise();
        }
    };
    KeyframeAnimation.prototype.play = function (view) {
        var _this = this;
        if (this._isPlaying) {
            throw new Error("Animation is already playing.");
        }
        var animationFinishedPromise = new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
        this._isPlaying = true;
        this._nativeAnimations = new Array();
        this._target = view;
        if (this.delay !== 0) {
            setTimeout(function () { return _this.animate(view, 0, _this.iterations); }, this.delay);
        }
        else {
            this.animate(view, 0, this.iterations);
        }
        return animationFinishedPromise;
    };
    KeyframeAnimation.prototype.animate = function (view, index, iterations) {
        var _this = this;
        if (!this._isPlaying) {
            return;
        }
        if (index === 0) {
            var animation = this.animations[0];
            if ("backgroundColor" in animation) {
                view.style[style_properties_1.backgroundColorProperty.keyframe] = animation.backgroundColor;
            }
            if ("scale" in animation) {
                view.style[style_properties_1.scaleXProperty.keyframe] = animation.scale.x;
                view.style[style_properties_1.scaleYProperty.keyframe] = animation.scale.y;
            }
            if ("translate" in animation) {
                view.style[style_properties_1.translateXProperty.keyframe] = animation.translate.x;
                view.style[style_properties_1.translateYProperty.keyframe] = animation.translate.y;
            }
            if ("rotate" in animation) {
                view.style[style_properties_1.rotateProperty.keyframe] = animation.rotate;
            }
            if ("opacity" in animation) {
                view.style[style_properties_1.opacityProperty.keyframe] = animation.opacity;
            }
            setTimeout(function () { return _this.animate(view, 1, iterations); }, 1);
        }
        else if (index < 0 || index >= this.animations.length) {
            iterations -= 1;
            if (iterations > 0) {
                this.animate(view, 0, iterations);
            }
            else {
                if (this._isForwards === false) {
                    var animation = this.animations[this.animations.length - 1];
                    this._resetAnimationValues(view, animation);
                }
                this._resolveAnimationFinishedPromise();
            }
        }
        else {
            var animationDef = this.animations[index];
            animationDef.target = view;
            var animation = new animation_1.Animation([animationDef]);
            animation.play().then(function () {
                _this.animate(view, index + 1, iterations);
            }).catch(function (error) {
                if (error.message.indexOf("Animation cancelled") < 0) {
                    throw error;
                }
            });
            this._nativeAnimations.push(animation);
        }
    };
    KeyframeAnimation.prototype._resolveAnimationFinishedPromise = function () {
        this._nativeAnimations = new Array();
        this._isPlaying = false;
        this._target = null;
        this._resolve();
    };
    KeyframeAnimation.prototype._rejectAnimationFinishedPromise = function () {
        this._nativeAnimations = new Array();
        this._isPlaying = false;
        this._target = null;
        this._reject(new Error("Animation cancelled."));
    };
    KeyframeAnimation.prototype._resetAnimationValues = function (view, animation) {
        if ("backgroundColor" in animation) {
            view.style[style_properties_1.backgroundColorProperty.keyframe] = properties_1.unsetValue;
        }
        if ("scale" in animation) {
            view.style[style_properties_1.scaleXProperty.keyframe] = properties_1.unsetValue;
            view.style[style_properties_1.scaleYProperty.keyframe] = properties_1.unsetValue;
        }
        if ("translate" in animation) {
            view.style[style_properties_1.translateXProperty.keyframe] = properties_1.unsetValue;
            view.style[style_properties_1.translateYProperty.keyframe] = properties_1.unsetValue;
        }
        if ("rotate" in animation) {
            view.style[style_properties_1.rotateProperty.keyframe] = properties_1.unsetValue;
        }
        if ("opacity" in animation) {
            view.style[style_properties_1.opacityProperty.keyframe] = properties_1.unsetValue;
        }
    };
    return KeyframeAnimation;
}());
exports.KeyframeAnimation = KeyframeAnimation;
//# sourceMappingURL=keyframe-animation.js.map