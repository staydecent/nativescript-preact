function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var image_common_1 = require("./image-common");
var file_system_1 = require("../../file-system");
__export(require("./image-common"));
var FILE_PREFIX = "file:///";
var ASYNC = "async";
var AndroidImageView;
var ImageLoadedListener;
function initializeImageLoadedListener() {
    if (ImageLoadedListener) {
        return;
    }
    var ImageLoadedListenerImpl = (function (_super) {
        __extends(ImageLoadedListenerImpl, _super);
        function ImageLoadedListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        ImageLoadedListenerImpl.prototype.onImageLoaded = function (success) {
            var owner = this.owner;
            if (owner) {
                owner.isLoading = false;
            }
        };
        return ImageLoadedListenerImpl;
    }(java.lang.Object));
    ImageLoadedListenerImpl = __decorate([
        Interfaces([org.nativescript.widgets.image.Worker.OnImageLoadedListener])
    ], ImageLoadedListenerImpl);
    ImageLoadedListener = ImageLoadedListenerImpl;
}
var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.decodeWidth = 0;
        _this.decodeHeight = 0;
        _this.useCache = true;
        return _this;
    }
    Image.prototype.createNativeView = function () {
        if (!AndroidImageView) {
            AndroidImageView = org.nativescript.widgets.ImageView;
        }
        initializeImageLoadedListener();
        var imageView = new AndroidImageView(this._context);
        var listener = new ImageLoadedListener(this);
        imageView.setImageLoadedListener(listener);
        imageView.listener = listener;
        return imageView;
    };
    Image.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this.nativeView.listener.owner = this;
    };
    Image.prototype.disposeNativeView = function () {
        this.nativeView.listener.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Image.prototype._createImageSourceFromSrc = function () {
        var imageView = this.nativeView;
        if (!imageView) {
            return;
        }
        var value = this.src;
        if (!value) {
            imageView.setUri(null, 0, 0, false, true);
            return;
        }
        var async = this.loadMode === ASYNC;
        if (typeof value === "string" || value instanceof String) {
            value = value.trim();
            this.isLoading = true;
            if (image_common_1.isDataURI(value)) {
                _super.prototype._createImageSourceFromSrc.call(this);
            }
            else if (image_common_1.isFileOrResourcePath(value)) {
                if (value.indexOf(image_common_1.RESOURCE_PREFIX) === 0) {
                    imageView.setUri(value, this.decodeWidth, this.decodeHeight, this.useCache, async);
                }
                else {
                    var fileName = value;
                    if (fileName.indexOf("~/") === 0) {
                        fileName = file_system_1.knownFolders.currentApp().path + "/" + fileName.replace("~/", "");
                    }
                    imageView.setUri(FILE_PREFIX + fileName, this.decodeWidth, this.decodeHeight, this.useCache, async);
                }
            }
            else {
                imageView.setUri(value, this.decodeWidth, this.decodeHeight, this.useCache, true);
            }
        }
        else {
            _super.prototype._createImageSourceFromSrc.call(this);
        }
    };
    Image.prototype[image_common_1.stretchProperty.getDefault] = function () {
        return "aspectFit";
    };
    Image.prototype[image_common_1.stretchProperty.setNative] = function (value) {
        switch (value) {
            case "aspectFit":
                this.nativeView.setScaleType(android.widget.ImageView.ScaleType.FIT_CENTER);
                break;
            case "aspectFill":
                this.nativeView.setScaleType(android.widget.ImageView.ScaleType.CENTER_CROP);
                break;
            case "fill":
                this.nativeView.setScaleType(android.widget.ImageView.ScaleType.FIT_XY);
                break;
            case "none":
            default:
                this.nativeView.setScaleType(android.widget.ImageView.ScaleType.MATRIX);
                break;
        }
    };
    Image.prototype[image_common_1.tintColorProperty.getDefault] = function () {
        return undefined;
    };
    Image.prototype[image_common_1.tintColorProperty.setNative] = function (value) {
        if (value === undefined) {
            this.nativeView.clearColorFilter();
        }
        else {
            this.nativeView.setColorFilter(value.android);
        }
    };
    Image.prototype[image_common_1.imageSourceProperty.getDefault] = function () {
        return undefined;
    };
    Image.prototype[image_common_1.imageSourceProperty.setNative] = function (value) {
        var nativeView = this.nativeView;
        if (value && value.android) {
            var rotation = value.rotationAngle ? value.rotationAngle : 0;
            nativeView.setRotationAngle(rotation);
            nativeView.setImageBitmap(value.android);
        }
        else {
            nativeView.setRotationAngle(0);
            nativeView.setImageBitmap(null);
        }
    };
    Image.prototype[image_common_1.srcProperty.getDefault] = function () {
        return undefined;
    };
    Image.prototype[image_common_1.srcProperty.setNative] = function (value) {
        this._createImageSourceFromSrc();
    };
    return Image;
}(image_common_1.ImageBase));
exports.Image = Image;
//# sourceMappingURL=image.js.map