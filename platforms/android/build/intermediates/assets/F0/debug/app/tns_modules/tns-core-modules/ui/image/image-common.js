function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
var image_asset_1 = require("../../image-asset");
var image_source_1 = require("../../image-source");
exports.ImageSource = image_source_1.ImageSource;
exports.fromAsset = image_source_1.fromAsset;
exports.fromNativeSource = image_source_1.fromNativeSource;
exports.fromUrl = image_source_1.fromUrl;
var utils_1 = require("../../utils/utils");
exports.isDataURI = utils_1.isDataURI;
exports.isFileOrResourcePath = utils_1.isFileOrResourcePath;
exports.RESOURCE_PREFIX = utils_1.RESOURCE_PREFIX;
__export(require("../core/view"));
var ImageBase = (function (_super) {
    __extends(ImageBase, _super);
    function ImageBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ImageBase.prototype, "tintColor", {
        get: function () {
            return this.style.tintColor;
        },
        set: function (value) {
            this.style.tintColor = value;
        },
        enumerable: true,
        configurable: true
    });
    ImageBase.prototype._createImageSourceFromSrc = function () {
        var _this = this;
        var value = this.src;
        var originalValue = value;
        var sync = this.loadMode === "sync";
        if (typeof value === "string" || value instanceof String) {
            value = value.trim();
            this.imageSource = null;
            this["_url"] = value;
            this.isLoading = true;
            var source_1 = new image_source_1.ImageSource();
            var imageLoaded = function () {
                var currentValue = _this.src;
                if (currentValue !== originalValue) {
                    return;
                }
                _this.imageSource = source_1;
                _this.isLoading = false;
            };
            if (utils_1.isDataURI(value)) {
                var base64Data = value.split(",")[1];
                if (base64Data !== undefined) {
                    if (sync) {
                        source_1.loadFromBase64(base64Data);
                        imageLoaded();
                    }
                    else {
                        source_1.fromBase64(base64Data).then(imageLoaded);
                    }
                }
            }
            else if (utils_1.isFileOrResourcePath(value)) {
                if (value.indexOf(utils_1.RESOURCE_PREFIX) === 0) {
                    var resPath = value.substr(utils_1.RESOURCE_PREFIX.length);
                    if (sync) {
                        source_1.loadFromResource(resPath);
                        imageLoaded();
                    }
                    else {
                        this.imageSource = null;
                        source_1.fromResource(resPath).then(imageLoaded);
                    }
                }
                else {
                    if (sync) {
                        source_1.loadFromFile(value);
                        imageLoaded();
                    }
                    else {
                        this.imageSource = null;
                        source_1.fromFile(value).then(imageLoaded);
                    }
                }
            }
            else {
                this.imageSource = null;
                image_source_1.fromUrl(value).then(function (r) {
                    if (_this["_url"] === value) {
                        _this.imageSource = r;
                        _this.isLoading = false;
                    }
                });
            }
        }
        else if (value instanceof image_source_1.ImageSource) {
            this.imageSource = value;
            this.isLoading = false;
        }
        else if (value instanceof image_asset_1.ImageAsset) {
            image_source_1.fromAsset(value).then(function (result) {
                _this.imageSource = result;
                _this.isLoading = false;
            });
        }
        else {
            this.imageSource = image_source_1.fromNativeSource(value);
            this.isLoading = false;
        }
    };
    return ImageBase;
}(view_1.View));
exports.ImageBase = ImageBase;
exports.imageSourceProperty = new view_1.Property({ name: "imageSource" });
exports.imageSourceProperty.register(ImageBase);
exports.srcProperty = new view_1.Property({ name: "src" });
exports.srcProperty.register(ImageBase);
exports.loadModeProperty = new view_1.Property({ name: "loadMode", defaultValue: "sync" });
exports.loadModeProperty.register(ImageBase);
exports.isLoadingProperty = new view_1.Property({ name: "isLoading", defaultValue: false, valueConverter: view_1.booleanConverter });
exports.isLoadingProperty.register(ImageBase);
exports.stretchProperty = new view_1.Property({ name: "stretch", defaultValue: "aspectFit", affectsLayout: view_1.isIOS });
exports.stretchProperty.register(ImageBase);
exports.tintColorProperty = new view_1.InheritedCssProperty({ name: "tintColor", cssName: "tint-color", equalityComparer: view_1.Color.equals, valueConverter: function (value) { return new view_1.Color(value); } });
exports.tintColorProperty.register(view_1.Style);
//# sourceMappingURL=image-common.js.map