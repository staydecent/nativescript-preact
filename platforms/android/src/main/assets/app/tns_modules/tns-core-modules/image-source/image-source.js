Object.defineProperty(exports, "__esModule", { value: true });
var file_system_1 = require("../file-system");
var utils_1 = require("../utils/utils");
exports.isFileOrResourcePath = utils_1.isFileOrResourcePath;
var application_1 = require("../application");
var http;
function ensureHttp() {
    if (!http) {
        http = require("../http");
    }
}
var application;
var resources;
function getApplication() {
    if (!application) {
        application = application_1.getNativeApplication();
    }
    return application;
}
function getResources() {
    if (!resources) {
        resources = getApplication().getResources();
    }
    return resources;
}
var ImageSource = (function () {
    function ImageSource() {
    }
    ImageSource.prototype.fromAsset = function (asset) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            asset.getImageAsync(function (image, err) {
                if (image) {
                    _this.setRotationAngleFromFile(asset.android);
                    _this.setNativeSource(image);
                    resolve(_this);
                }
                else {
                    reject(err);
                }
            });
        });
    };
    ImageSource.prototype.loadFromResource = function (name) {
        this.android = null;
        var res = getResources();
        if (res) {
            var identifier = res.getIdentifier(name, 'drawable', getApplication().getPackageName());
            if (0 < identifier) {
                var bitmapDrawable = res.getDrawable(identifier);
                if (bitmapDrawable && bitmapDrawable.getBitmap) {
                    this.android = bitmapDrawable.getBitmap();
                }
            }
        }
        return this.android != null;
    };
    ImageSource.prototype.fromResource = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.loadFromResource(name));
        });
    };
    ImageSource.prototype.setRotationAngleFromFile = function (filename) {
        this.rotationAngle = 0;
        var ei = new android.media.ExifInterface(filename);
        var orientation = ei.getAttributeInt(android.media.ExifInterface.TAG_ORIENTATION, android.media.ExifInterface.ORIENTATION_NORMAL);
        switch (orientation) {
            case android.media.ExifInterface.ORIENTATION_ROTATE_90:
                this.rotationAngle = 90;
                break;
            case android.media.ExifInterface.ORIENTATION_ROTATE_180:
                this.rotationAngle = 180;
                break;
            case android.media.ExifInterface.ORIENTATION_ROTATE_270:
                this.rotationAngle = 270;
                break;
        }
    };
    ImageSource.prototype.loadFromFile = function (path) {
        var fileName = typeof path === "string" ? path.trim() : "";
        if (fileName.indexOf("~/") === 0) {
            fileName = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, fileName.replace("~/", ""));
        }
        this.setRotationAngleFromFile(fileName);
        this.android = android.graphics.BitmapFactory.decodeFile(fileName, null);
        return this.android != null;
    };
    ImageSource.prototype.fromFile = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.loadFromFile(path));
        });
    };
    ImageSource.prototype.loadFromData = function (data) {
        this.android = android.graphics.BitmapFactory.decodeStream(data);
        return this.android != null;
    };
    ImageSource.prototype.fromData = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.loadFromData(data));
        });
    };
    ImageSource.prototype.loadFromBase64 = function (source) {
        if (typeof source === "string") {
            var bytes = android.util.Base64.decode(source, android.util.Base64.DEFAULT);
            this.android = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
        }
        return this.android != null;
    };
    ImageSource.prototype.fromBase64 = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.loadFromBase64(data));
        });
    };
    ImageSource.prototype.setNativeSource = function (source) {
        this.android = source;
        return source != null;
    };
    ImageSource.prototype.saveToFile = function (path, format, quality) {
        if (quality === void 0) { quality = 100; }
        if (!this.android) {
            return false;
        }
        var targetFormat = getTargetFormat(format);
        var outputStream = new java.io.BufferedOutputStream(new java.io.FileOutputStream(path));
        var res = this.android.compress(targetFormat, quality, outputStream);
        outputStream.close();
        return res;
    };
    ImageSource.prototype.toBase64String = function (format, quality) {
        if (quality === void 0) { quality = 100; }
        if (!this.android) {
            return null;
        }
        var targetFormat = getTargetFormat(format);
        var outputStream = new java.io.ByteArrayOutputStream();
        var base64Stream = new android.util.Base64OutputStream(outputStream, android.util.Base64.NO_WRAP);
        this.android.compress(targetFormat, quality, base64Stream);
        base64Stream.close();
        outputStream.close();
        return outputStream.toString();
    };
    Object.defineProperty(ImageSource.prototype, "height", {
        get: function () {
            if (this.android) {
                return this.android.getHeight();
            }
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageSource.prototype, "width", {
        get: function () {
            if (this.android) {
                return this.android.getWidth();
            }
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageSource.prototype, "rotationAngle", {
        get: function () {
            return this._rotationAngle;
        },
        set: function (value) {
            this._rotationAngle = value;
        },
        enumerable: true,
        configurable: true
    });
    return ImageSource;
}());
exports.ImageSource = ImageSource;
function getTargetFormat(format) {
    switch (format) {
        case "jpeg" || "jpg":
            return android.graphics.Bitmap.CompressFormat.JPEG;
        default:
            return android.graphics.Bitmap.CompressFormat.PNG;
    }
}
function fromAsset(asset) {
    var image = new ImageSource();
    return image.fromAsset(asset);
}
exports.fromAsset = fromAsset;
function fromResource(name) {
    var image = new ImageSource();
    return image.loadFromResource(name) ? image : null;
}
exports.fromResource = fromResource;
function fromFile(path) {
    var image = new ImageSource();
    return image.loadFromFile(path) ? image : null;
}
exports.fromFile = fromFile;
function fromData(data) {
    var image = new ImageSource();
    return image.loadFromData(data) ? image : null;
}
exports.fromData = fromData;
function fromBase64(source) {
    var image = new ImageSource();
    return image.loadFromBase64(source) ? image : null;
}
exports.fromBase64 = fromBase64;
function fromNativeSource(source) {
    var image = new ImageSource();
    return image.setNativeSource(source) ? image : null;
}
exports.fromNativeSource = fromNativeSource;
function fromUrl(url) {
    ensureHttp();
    return http.getImage(url);
}
exports.fromUrl = fromUrl;
function fromFileOrResource(path) {
    if (!utils_1.isFileOrResourcePath(path)) {
        throw new Error(path + " is not a valid file or resource.");
    }
    if (path.indexOf(utils_1.RESOURCE_PREFIX) === 0) {
        return fromResource(path.substr(utils_1.RESOURCE_PREFIX.length));
    }
    return fromFile(path);
}
exports.fromFileOrResource = fromFileOrResource;
//# sourceMappingURL=image-source.js.map