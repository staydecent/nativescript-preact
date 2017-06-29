Object.defineProperty(exports, "__esModule", { value: true });
var observable = require("../data/observable");
var platform = require("../platform");
var ImageAsset = (function (_super) {
    __extends(ImageAsset, _super);
    function ImageAsset() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ImageAsset.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (value) {
            this._options = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageAsset.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        set: function (value) {
            this._ios = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageAsset.prototype, "android", {
        get: function () {
            return this._android;
        },
        set: function (value) {
            this._android = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageAsset.prototype, "nativeImage", {
        get: function () {
            return this._nativeImage;
        },
        set: function (value) {
            this._nativeImage = value;
        },
        enumerable: true,
        configurable: true
    });
    ImageAsset.prototype.getImageAsync = function (callback) {
    };
    return ImageAsset;
}(observable.Observable));
exports.ImageAsset = ImageAsset;
function getAspectSafeDimensions(sourceWidth, sourceHeight, reqWidth, reqHeight) {
    var widthCoef = sourceWidth / reqWidth;
    var heightCoef = sourceHeight / reqHeight;
    var aspectCoef = widthCoef > heightCoef ? widthCoef : heightCoef;
    return {
        width: Math.floor(sourceWidth / aspectCoef),
        height: Math.floor(sourceHeight / aspectCoef)
    };
}
exports.getAspectSafeDimensions = getAspectSafeDimensions;
function getRequestedImageSize(src, options) {
    var reqWidth = platform.screen.mainScreen.widthDIPs;
    var reqHeight = platform.screen.mainScreen.heightDIPs;
    if (options && options.width) {
        reqWidth = (options.width > 0 && options.width < reqWidth) ? options.width : reqWidth;
    }
    if (options && options.height) {
        reqHeight = (options.height > 0 && options.height < reqHeight) ? options.height : reqHeight;
    }
    if (options && options.keepAspectRatio) {
        var safeAspectSize = getAspectSafeDimensions(src.width, src.height, reqWidth, reqHeight);
        reqWidth = safeAspectSize.width;
        reqHeight = safeAspectSize.height;
    }
    return {
        width: reqWidth,
        height: reqHeight
    };
}
exports.getRequestedImageSize = getRequestedImageSize;
//# sourceMappingURL=image-asset-common.js.map