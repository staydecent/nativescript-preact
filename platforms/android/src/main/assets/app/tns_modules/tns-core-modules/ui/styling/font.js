function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var font_common_1 = require("./font-common");
var trace_1 = require("../../trace");
var application = require("../../application");
var fs = require("../../file-system");
__export(require("./font-common"));
var FONTS_BASE_PATH = "/fonts/";
var typefaceCache = new Map();
var appAssets;
var Font = (function (_super) {
    __extends(Font, _super);
    function Font(family, size, style, weight) {
        return _super.call(this, family, size, style, weight) || this;
    }
    Font.prototype.withFontFamily = function (family) {
        return new Font(family, this.fontSize, this.fontStyle, this.fontWeight);
    };
    Font.prototype.withFontStyle = function (style) {
        return new Font(this.fontFamily, this.fontSize, style, this.fontWeight);
    };
    Font.prototype.withFontWeight = function (weight) {
        return new Font(this.fontFamily, this.fontSize, this.fontStyle, weight);
    };
    Font.prototype.withFontSize = function (size) {
        return new Font(this.fontFamily, size, this.fontStyle, this.fontWeight);
    };
    Font.prototype.getAndroidTypeface = function () {
        if (!this._typeface) {
            var fontStyle = 0;
            if (this.isBold) {
                fontStyle |= android.graphics.Typeface.BOLD;
            }
            if (this.isItalic) {
                fontStyle |= android.graphics.Typeface.ITALIC;
            }
            this._typeface = createTypeface(this, fontStyle);
        }
        return this._typeface;
    };
    Font.prototype.getUIFont = function (defaultFont) {
        return undefined;
    };
    return Font;
}(font_common_1.FontBase));
Font.default = new Font(undefined, undefined, "normal", "normal");
exports.Font = Font;
function loadFontFromFile(fontFamily) {
    appAssets = appAssets || application.android.context.getAssets();
    if (!appAssets) {
        return null;
    }
    var result = typefaceCache.get(fontFamily);
    if (result === undefined) {
        result = null;
        var fontAssetPath = void 0;
        var basePath = fs.path.join(fs.knownFolders.currentApp().path, "fonts", fontFamily);
        if (fs.File.exists(basePath + ".ttf")) {
            fontAssetPath = FONTS_BASE_PATH + fontFamily + ".ttf";
        }
        else if (fs.File.exists(basePath + ".otf")) {
            fontAssetPath = FONTS_BASE_PATH + fontFamily + ".otf";
        }
        else {
            if (trace_1.isEnabled()) {
                trace_1.write("Could not find font file for " + fontFamily, trace_1.categories.Error, trace_1.messageType.error);
            }
        }
        if (fontAssetPath) {
            try {
                fontAssetPath = fs.path.join(fs.knownFolders.currentApp().path, fontAssetPath);
                result = android.graphics.Typeface.createFromFile(fontAssetPath);
            }
            catch (e) {
                if (trace_1.isEnabled()) {
                    trace_1.write("Error loading font asset: " + fontAssetPath, trace_1.categories.Error, trace_1.messageType.error);
                }
            }
        }
        typefaceCache.set(fontFamily, result);
    }
    return result;
}
function createTypeface(font, fontStyle) {
    var fonts = font_common_1.parseFontFamily(font.fontFamily);
    var result = null;
    for (var i = 0; i < fonts.length && !result; i++) {
        switch (fonts[i].toLowerCase()) {
            case font_common_1.genericFontFamilies.serif:
                result = android.graphics.Typeface.create("serif" + getFontWeightSuffix(font.fontWeight), fontStyle);
                break;
            case font_common_1.genericFontFamilies.sansSerif:
            case font_common_1.genericFontFamilies.system:
                result = android.graphics.Typeface.create("sans-serif" + getFontWeightSuffix(font.fontWeight), fontStyle);
                break;
            case font_common_1.genericFontFamilies.monospace:
                result = android.graphics.Typeface.create("monospace" + getFontWeightSuffix(font.fontWeight), fontStyle);
                break;
            default:
                result = loadFontFromFile(fonts[i]);
                if (fontStyle) {
                    result = android.graphics.Typeface.create(result, fontStyle);
                }
                break;
        }
    }
    if (fontStyle && !result) {
        result = android.graphics.Typeface.create(result, fontStyle);
    }
    return result;
}
function getFontWeightSuffix(fontWeight) {
    switch (fontWeight) {
        case font_common_1.FontWeight.THIN:
            return android.os.Build.VERSION.SDK_INT >= 16 ? "-thin" : "";
        case font_common_1.FontWeight.EXTRA_LIGHT:
        case font_common_1.FontWeight.LIGHT:
            return android.os.Build.VERSION.SDK_INT >= 16 ? "-light" : "";
        case font_common_1.FontWeight.NORMAL:
        case "400":
        case undefined:
        case null:
            return "";
        case font_common_1.FontWeight.MEDIUM:
        case font_common_1.FontWeight.SEMI_BOLD:
            return android.os.Build.VERSION.SDK_INT >= 21 ? "-medium" : "";
        case font_common_1.FontWeight.BOLD:
        case "700":
        case font_common_1.FontWeight.EXTRA_BOLD:
            return "";
        case font_common_1.FontWeight.BLACK:
            return android.os.Build.VERSION.SDK_INT >= 21 ? "-black" : "";
        default:
            throw new Error("Invalid font weight: \"" + fontWeight + "\"");
    }
}
//# sourceMappingURL=font.js.map