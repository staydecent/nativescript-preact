Object.defineProperty(exports, "__esModule", { value: true });
var GestureTypes;
(function (GestureTypes) {
    GestureTypes[GestureTypes["tap"] = 1] = "tap";
    GestureTypes[GestureTypes["doubleTap"] = 2] = "doubleTap";
    GestureTypes[GestureTypes["pinch"] = 4] = "pinch";
    GestureTypes[GestureTypes["pan"] = 8] = "pan";
    GestureTypes[GestureTypes["swipe"] = 16] = "swipe";
    GestureTypes[GestureTypes["rotation"] = 32] = "rotation";
    GestureTypes[GestureTypes["longPress"] = 64] = "longPress";
    GestureTypes[GestureTypes["touch"] = 128] = "touch";
})(GestureTypes = exports.GestureTypes || (exports.GestureTypes = {}));
var GestureStateTypes;
(function (GestureStateTypes) {
    GestureStateTypes[GestureStateTypes["cancelled"] = 0] = "cancelled";
    GestureStateTypes[GestureStateTypes["began"] = 1] = "began";
    GestureStateTypes[GestureStateTypes["changed"] = 2] = "changed";
    GestureStateTypes[GestureStateTypes["ended"] = 3] = "ended";
})(GestureStateTypes = exports.GestureStateTypes || (exports.GestureStateTypes = {}));
var SwipeDirection;
(function (SwipeDirection) {
    SwipeDirection[SwipeDirection["right"] = 1] = "right";
    SwipeDirection[SwipeDirection["left"] = 2] = "left";
    SwipeDirection[SwipeDirection["up"] = 4] = "up";
    SwipeDirection[SwipeDirection["down"] = 8] = "down";
})(SwipeDirection = exports.SwipeDirection || (exports.SwipeDirection = {}));
var TouchAction;
(function (TouchAction) {
    TouchAction.down = "down";
    TouchAction.up = "up";
    TouchAction.move = "move";
    TouchAction.cancel = "cancel";
})(TouchAction = exports.TouchAction || (exports.TouchAction = {}));
function toString(type, separator) {
    var types = new Array();
    if (type & GestureTypes.tap) {
        types.push("tap");
    }
    if (type & GestureTypes.doubleTap) {
        types.push("doubleTap");
    }
    if (type & GestureTypes.pinch) {
        types.push("pinch");
    }
    if (type & GestureTypes.pan) {
        types.push("pan");
    }
    if (type & GestureTypes.swipe) {
        types.push("swipe");
    }
    if (type & GestureTypes.rotation) {
        types.push("rotation");
    }
    if (type & GestureTypes.longPress) {
        types.push("longPress");
    }
    if (type & GestureTypes.touch) {
        types.push("touch");
    }
    return types.join(separator);
}
exports.toString = toString;
function fromString(type) {
    var t = type.trim().toLowerCase();
    if (t === "tap") {
        return GestureTypes.tap;
    }
    else if (t === "doubletap") {
        return GestureTypes.doubleTap;
    }
    else if (t === "pinch") {
        return GestureTypes.pinch;
    }
    else if (t === "pan") {
        return GestureTypes.pan;
    }
    else if (t === "swipe") {
        return GestureTypes.swipe;
    }
    else if (t === "rotation") {
        return GestureTypes.rotation;
    }
    else if (t === "longpress") {
        return GestureTypes.longPress;
    }
    else if (t === "touch") {
        return GestureTypes.touch;
    }
    return undefined;
}
exports.fromString = fromString;
var GesturesObserverBase = (function () {
    function GesturesObserverBase(target, callback, context) {
        this._target = target;
        this._callback = callback;
        this._context = context;
    }
    Object.defineProperty(GesturesObserverBase.prototype, "callback", {
        get: function () {
            return this._callback;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GesturesObserverBase.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GesturesObserverBase.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    GesturesObserverBase.prototype.disconnect = function () {
        if (this.target) {
            var list = this.target.getGestureObservers(this.type);
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].callback === this.callback) {
                        break;
                    }
                }
                list.length = 0;
                this.target._gestureObservers[this.type] = undefined;
                delete this.target._gestureObservers[this.type];
            }
        }
        this._target = null;
        this._callback = null;
        this._context = null;
    };
    return GesturesObserverBase;
}());
exports.GesturesObserverBase = GesturesObserverBase;
//# sourceMappingURL=gestures-common.js.map