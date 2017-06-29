Object.defineProperty(exports, "__esModule", { value: true });
var properties_1 = require("../core/properties");
var FontBase = (function () {
    function FontBase(fontFamily, fontSize, fontStyle, fontWeight) {
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.fontStyle = fontStyle;
        this.fontWeight = fontWeight;
    }
    Object.defineProperty(FontBase.prototype, "isItalic", {
        get: function () {
            return this.fontStyle === FontStyle.ITALIC;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FontBase.prototype, "isBold", {
        get: function () {
            return this.fontWeight === FontWeight.BOLD
                || this.fontWeight === "700";
        },
        enumerable: true,
        configurable: true
    });
    FontBase.equals = function (value1, value2) {
        if (!value1 && !value2) {
            return true;
        }
        if (!value1 || !value2) {
            return false;
        }
        return value1.fontFamily === value2.fontFamily &&
            value1.fontSize === value2.fontSize &&
            value1.fontStyle === value2.fontStyle &&
            value1.fontWeight === value2.fontWeight;
    };
    return FontBase;
}());
FontBase.default = undefined;
exports.FontBase = FontBase;
var FontStyle;
(function (FontStyle) {
    FontStyle.NORMAL = "normal";
    FontStyle.ITALIC = "italic";
    FontStyle.isValid = properties_1.makeValidator(FontStyle.NORMAL, FontStyle.ITALIC);
    FontStyle.parse = properties_1.makeParser(FontStyle.isValid);
})(FontStyle = exports.FontStyle || (exports.FontStyle = {}));
var FontWeight;
(function (FontWeight) {
    FontWeight.THIN = "100";
    FontWeight.EXTRA_LIGHT = "200";
    FontWeight.LIGHT = "300";
    FontWeight.NORMAL = "normal";
    FontWeight.MEDIUM = "500";
    FontWeight.SEMI_BOLD = "600";
    FontWeight.BOLD = "bold";
    FontWeight.EXTRA_BOLD = "800";
    FontWeight.BLACK = "900";
    FontWeight.isValid = properties_1.makeValidator(FontWeight.THIN, FontWeight.EXTRA_LIGHT, FontWeight.LIGHT, FontWeight.NORMAL, "400", FontWeight.MEDIUM, FontWeight.SEMI_BOLD, FontWeight.BOLD, "700", FontWeight.EXTRA_BOLD, FontWeight.BLACK);
    FontWeight.parse = properties_1.makeParser(FontWeight.isValid);
})(FontWeight = exports.FontWeight || (exports.FontWeight = {}));
function parseFontFamily(value) {
    var result = new Array();
    if (!value) {
        return result;
    }
    var split = value.split(",");
    for (var i = 0; i < split.length; i++) {
        var str = split[i].trim().replace(/['"]+/g, '');
        if (str) {
            result.push(str);
        }
    }
    return result;
}
exports.parseFontFamily = parseFontFamily;
var genericFontFamilies;
(function (genericFontFamilies) {
    genericFontFamilies.serif = "serif";
    genericFontFamilies.sansSerif = "sans-serif";
    genericFontFamilies.monospace = "monospace";
    genericFontFamilies.system = "system";
})(genericFontFamilies = exports.genericFontFamilies || (exports.genericFontFamilies = {}));
var styles = new Set();
[
    FontStyle.NORMAL,
    FontStyle.ITALIC
].forEach(function (val, i, a) { return styles.add(val); });
var weights = new Set();
[
    FontWeight.THIN,
    FontWeight.EXTRA_LIGHT,
    FontWeight.LIGHT,
    FontWeight.NORMAL,
    "400",
    FontWeight.MEDIUM,
    FontWeight.SEMI_BOLD,
    FontWeight.BOLD,
    "700",
    FontWeight.EXTRA_BOLD,
    FontWeight.BLACK
].forEach(function (val, i, a) { return weights.add(val); });
function parseFont(fontValue) {
    var result = {
        fontStyle: "normal",
        fontVariant: "normal",
        fontWeight: "normal"
    };
    var parts = fontValue.split(/\s+/);
    var part;
    while (part = parts.shift()) {
        if (part === "normal") {
        }
        else if (part === "small-caps") {
            result.fontVariant = part;
        }
        else if (styles.has(part)) {
            result.fontStyle = part;
        }
        else if (weights.has(part)) {
            result.fontWeight = part;
        }
        else if (!result.fontSize) {
            var sizes = part.split("/");
            result.fontSize = sizes[0];
            result.lineHeight = sizes.length > 1 ? sizes[1] : undefined;
        }
        else {
            result.fontFamily = part;
            if (parts.length) {
                result.fontFamily += " " + parts.join(" ");
            }
            break;
        }
    }
    return result;
}
exports.parseFont = parseFont;
//# sourceMappingURL=font-common.js.map