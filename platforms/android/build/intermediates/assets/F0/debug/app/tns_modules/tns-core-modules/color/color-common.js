Object.defineProperty(exports, "__esModule", { value: true });
var types = require("../utils/types");
var knownColors = require("./known-colors");
var SHARP = "#";
var HEX_REGEX = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)|(^#[0-9A-F]{8}$)/i;
var Color = (function () {
    function Color() {
        if (arguments.length === 1) {
            var arg = arguments[0];
            if (types.isString(arg)) {
                if (isRgbOrRgba(arg)) {
                    this._argb = argbFromRgbOrRgba(arg);
                }
                else if (knownColors.isKnownName(arg)) {
                    var hex = knownColors.getKnownColor(arg);
                    this._name = arg;
                    this._argb = this._argbFromString(hex);
                }
                else if (HEX_REGEX.test(arg)) {
                    var hex = this._normalizeHex(arg);
                    this._argb = this._argbFromString(hex);
                }
                else {
                    throw new Error("Invalid color: " + arg);
                }
            }
            else if (types.isNumber(arg)) {
                this._argb = arg >>> 0;
            }
            else {
                throw new Error("Expected 1 or 4 constructor parameters.");
            }
        }
        else if (arguments.length === 4) {
            this._argb = (arguments[0] & 0xFF) * 0x01000000
                + (arguments[1] & 0xFF) * 0x00010000
                + (arguments[2] & 0xFF) * 0x00000100
                + (arguments[3] & 0xFF) * 0x00000001;
        }
        else {
            throw new Error("Expected 1 or 4 constructor parameters.");
        }
    }
    Object.defineProperty(Color.prototype, "a", {
        get: function () { return (this._argb / 0x01000000) & 0xFF; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "r", {
        get: function () { return (this._argb / 0x00010000) & 0xFF; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "g", {
        get: function () { return (this._argb / 0x00000100) & 0xFF; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "b", {
        get: function () { return (this._argb / 0x00000001) & 0xFF; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "argb", {
        get: function () {
            return this._argb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "hex", {
        get: function () {
            if (this.a === 0xFF) {
                return ("#" + this._componentToHex(this.r) + this._componentToHex(this.g) + this._componentToHex(this.b)).toUpperCase();
            }
            else {
                return ("#" + this._componentToHex(this.a) + this._componentToHex(this.r) + this._componentToHex(this.g) + this._componentToHex(this.b)).toUpperCase();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "ios", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "android", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Color.prototype._argbFromString = function (hex) {
        if (hex.charAt(0) === "#") {
            hex = hex.substr(1);
        }
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        else if (hex.length === 4) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        var intVal = parseInt(hex, 16);
        if (hex.length === 6) {
            intVal = (intVal & 0x00FFFFFF) + 0xFF000000;
        }
        return intVal;
    };
    Color.prototype.equals = function (value) {
        return value && this.argb === value.argb;
    };
    Color.equals = function (value1, value2) {
        if (!value1 && !value2) {
            return true;
        }
        if (!value1 || !value2) {
            return false;
        }
        return value1.equals(value2);
    };
    Color.isValid = function (value) {
        if (types.isNullOrUndefined(value) || value instanceof Color) {
            return true;
        }
        if (!types.isString(value)) {
            return false;
        }
        if (knownColors.isKnownName(value)) {
            return true;
        }
        return HEX_REGEX.test(value) || isRgbOrRgba(value);
    };
    Color.prototype._componentToHex = function (component) {
        var hex = component.toString(16);
        if (hex.length === 1) {
            hex = "0" + hex;
        }
        return hex;
    };
    Color.prototype._normalizeHex = function (hexStr) {
        if (hexStr.charAt(0) === SHARP && hexStr.length === 4) {
            hexStr = hexStr.charAt(0)
                + hexStr.charAt(1) + hexStr.charAt(1)
                + hexStr.charAt(2) + hexStr.charAt(2)
                + hexStr.charAt(3) + hexStr.charAt(3);
        }
        return hexStr;
    };
    Color.prototype.toString = function () {
        return this.hex;
    };
    return Color;
}());
exports.Color = Color;
function isRgbOrRgba(value) {
    var toLower = value.toLowerCase();
    return (toLower.indexOf("rgb(") === 0 || toLower.indexOf("rgba(") === 0) && toLower.indexOf(")") === (toLower.length - 1);
}
function argbFromRgbOrRgba(value) {
    var toLower = value.toLowerCase();
    var parts = toLower.replace("rgba(", "").replace("rgb(", "").replace(")", "").trim().split(",");
    var r = 255;
    var g = 255;
    var b = 255;
    var a = 255;
    if (parts[0]) {
        r = parseInt(parts[0].trim());
    }
    if (parts[1]) {
        g = parseInt(parts[1].trim());
    }
    if (parts[2]) {
        b = parseInt(parts[2].trim());
    }
    if (parts[3]) {
        a = Math.round(parseFloat(parts[3].trim()) * 255);
    }
    return (a & 0xFF) * 0x01000000
        + (r & 0xFF) * 0x00010000
        + (g & 0xFF) * 0x00000100
        + (b & 0xFF) * 0x00000001;
}
//# sourceMappingURL=color-common.js.map