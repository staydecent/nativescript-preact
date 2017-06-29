Object.defineProperty(exports, "__esModule", { value: true });
var platform = require("../platform");
var common = require("./image-asset-common");
global.moduleMerge(common, exports);
var ImageAsset = (function (_super) {
    __extends(ImageAsset, _super);
    function ImageAsset(asset) {
        var _this = _super.call(this) || this;
        _this.android = asset;
        return _this;
    }
    ImageAsset.prototype.getImageAsync = function (callback) {
        var bitmapOptions = new android.graphics.BitmapFactory.Options();
        bitmapOptions.inJustDecodeBounds = true;
        var bitmap = android.graphics.BitmapFactory.decodeFile(this.android, bitmapOptions);
        var sourceSize = {
            width: bitmapOptions.outWidth,
            height: bitmapOptions.outHeight
        };
        var requestedSize = common.getRequestedImageSize(sourceSize, this.options);
        var sampleSize = calculateInSampleSize(bitmapOptions.outWidth, bitmapOptions.outHeight, requestedSize.width, requestedSize.height);
        var finalBitmapOptions = new android.graphics.BitmapFactory.Options();
        finalBitmapOptions.inSampleSize = sampleSize;
        try {
            bitmap = android.graphics.BitmapFactory.decodeFile(this.android, finalBitmapOptions);
            callback(bitmap, null);
        }
        catch (ex) {
            callback(null, ex);
        }
    };
    return ImageAsset;
}(common.ImageAsset));
exports.ImageAsset = ImageAsset;
var calculateInSampleSize = function (imageWidth, imageHeight, reqWidth, reqHeight) {
    var sampleSize = 1;
    var displayWidth = platform.screen.mainScreen.widthDIPs;
    var displayHeigth = platform.screen.mainScreen.heightDIPs;
    reqWidth = (reqWidth > 0 && reqWidth < displayWidth) ? reqWidth : displayWidth;
    reqHeight = (reqHeight > 0 && reqHeight < displayHeigth) ? reqHeight : displayHeigth;
    if (imageWidth > reqWidth && imageHeight > reqHeight) {
        var halfWidth = imageWidth / 2;
        var halfHeight = imageHeight / 2;
        while ((halfWidth / sampleSize) > reqWidth && (halfHeight / sampleSize) > reqHeight) {
            sampleSize *= 2;
        }
    }
    return sampleSize;
};
//# sourceMappingURL=image-asset.js.map