function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils/utils");
var css_value_1 = require("../../css-value");
var file_system_1 = require("../../file-system");
var application_1 = require("../../application");
__export(require("./background-common"));
var ad;
(function (ad) {
    var SDK;
    function getSDK() {
        if (!SDK) {
            SDK = android.os.Build.VERSION.SDK_INT;
        }
        return SDK;
    }
    function isSetColorFilterOnlyWidget(nativeView) {
        return (nativeView instanceof android.widget.Button ||
            (nativeView instanceof android.support.v7.widget.Toolbar
                && getSDK() >= 21));
    }
    function onBackgroundOrBorderPropertyChanged(view) {
        var nativeView = view.nativeView;
        if (!nativeView) {
            return;
        }
        var background = view.style.backgroundInternal;
        var cache = view.nativeView;
        var drawable = nativeView.getBackground();
        var androidView = view;
        if (androidView.background === undefined && drawable) {
            androidView.background = drawable.getConstantState();
        }
        if (isSetColorFilterOnlyWidget(nativeView)
            && drawable
            && !background.hasBorderWidth()
            && !background.hasBorderRadius()
            && !background.clipPath
            && !background.image
            && background.color) {
            var backgroundColor = drawable.backgroundColor = background.color.android;
            drawable.mutate();
            drawable.setColorFilter(backgroundColor, android.graphics.PorterDuff.Mode.SRC_IN);
            drawable.invalidateSelf();
            drawable.backgroundColor = backgroundColor;
        }
        else if (!background.isEmpty()) {
            var backgroundDrawable = drawable;
            if (!(drawable instanceof org.nativescript.widgets.BorderDrawable)) {
                backgroundDrawable = new org.nativescript.widgets.BorderDrawable(utils_1.layout.getDisplayDensity(), view.toString());
                refreshBorderDrawable(view, backgroundDrawable);
                org.nativescript.widgets.ViewHelper.setBackground(nativeView, backgroundDrawable);
            }
            else {
                refreshBorderDrawable(view, backgroundDrawable);
            }
            if ((background.hasBorderWidth() || background.hasBorderRadius() || background.clipPath) && getSDK() < 18) {
                if (cache.layerType === undefined) {
                    cache.layerType = cache.getLayerType();
                    cache.setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null);
                }
            }
        }
        else {
            var defaultDrawable = androidView.background ? androidView.background.newDrawable() : null;
            org.nativescript.widgets.ViewHelper.setBackground(nativeView, defaultDrawable);
            androidView.background = undefined;
            if (cache.layerType !== undefined) {
                cache.setLayerType(cache.layerType, null);
                cache.layerType = undefined;
            }
        }
        var leftPadding = Math.ceil(view.effectiveBorderLeftWidth + view.effectivePaddingLeft);
        var topPadding = Math.ceil(view.effectiveBorderTopWidth + view.effectivePaddingTop);
        var rightPadding = Math.ceil(view.effectiveBorderRightWidth + view.effectivePaddingRight);
        var bottomPadding = Math.ceil(view.effectiveBorderBottomWidth + view.effectivePaddingBottom);
        nativeView.setPadding(leftPadding, topPadding, rightPadding, bottomPadding);
    }
    ad.onBackgroundOrBorderPropertyChanged = onBackgroundOrBorderPropertyChanged;
})(ad = exports.ad || (exports.ad = {}));
function fromBase64(source) {
    var bytes = android.util.Base64.decode(source, android.util.Base64.DEFAULT);
    return android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
}
var pattern = /url\(('|")(.*?)\1\)/;
function refreshBorderDrawable(view, borderDrawable) {
    var nativeView = view.nativeView;
    var context = nativeView.getContext();
    var background = view.style.backgroundInternal;
    if (background) {
        var backgroundPositionParsedCSSValues = createNativeCSSValueArray(background.position);
        var backgroundSizeParsedCSSValues = createNativeCSSValueArray(background.size);
        var blackColor = -16777216;
        var imageUri = background.image;
        if (imageUri) {
            var match = imageUri.match(pattern);
            if (match && match[2]) {
                imageUri = match[2];
            }
        }
        var bitmap = null;
        if (utils_1.isDataURI(imageUri)) {
            var base64Data = imageUri.split(",")[1];
            if (base64Data !== undefined) {
                bitmap = fromBase64(base64Data);
                imageUri = null;
            }
        }
        else if (utils_1.isFileOrResourcePath(imageUri)) {
            if (imageUri.indexOf(utils_1.RESOURCE_PREFIX) !== 0) {
                var fileName = imageUri;
                if (fileName.indexOf("~/") === 0) {
                    fileName = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, fileName.replace("~/", ""));
                }
                imageUri = utils_1.FILE_PREFIX + fileName;
            }
        }
        borderDrawable.refresh(background.borderTopColor ? background.borderTopColor.android : blackColor, background.borderRightColor ? background.borderRightColor.android : blackColor, background.borderBottomColor ? background.borderBottomColor.android : blackColor, background.borderLeftColor ? background.borderLeftColor.android : blackColor, background.borderTopWidth, background.borderRightWidth, background.borderBottomWidth, background.borderLeftWidth, background.borderTopLeftRadius, background.borderTopRightRadius, background.borderBottomRightRadius, background.borderBottomLeftRadius, background.clipPath, background.color ? background.color.android : 0, imageUri, bitmap, context, background.repeat, background.position, backgroundPositionParsedCSSValues, background.size, backgroundSizeParsedCSSValues);
    }
}
function createNativeCSSValueArray(css) {
    if (!css) {
        return null;
    }
    var cssValues = css_value_1.parse(css);
    var nativeArray = Array.create(org.nativescript.widgets.CSSValue, cssValues.length);
    for (var i = 0, length_1 = cssValues.length; i < length_1; i++) {
        nativeArray[i] = new org.nativescript.widgets.CSSValue(cssValues[i].type, cssValues[i].string, cssValues[i].unit, cssValues[i].value);
    }
    return nativeArray;
}
var CacheMode;
(function (CacheMode) {
    CacheMode[CacheMode["none"] = 0] = "none";
    CacheMode[CacheMode["memory"] = 1] = "memory";
    CacheMode[CacheMode["diskAndMemory"] = 2] = "diskAndMemory";
})(CacheMode = exports.CacheMode || (exports.CacheMode = {}));
var currentCacheMode;
var imageFetcher;
function initImageCache(context, mode, memoryCacheSize, diskCacheSize) {
    if (mode === void 0) { mode = CacheMode.diskAndMemory; }
    if (memoryCacheSize === void 0) { memoryCacheSize = 0.25; }
    if (diskCacheSize === void 0) { diskCacheSize = 10 * 1024 * 1024; }
    if (currentCacheMode === mode) {
        return;
    }
    currentCacheMode = mode;
    if (!imageFetcher) {
        imageFetcher = org.nativescript.widgets.image.Fetcher.getInstance(context);
    }
    else {
        imageFetcher.clearCache();
    }
    var params = new org.nativescript.widgets.image.Cache.CacheParams();
    params.memoryCacheEnabled = mode !== CacheMode.none;
    params.setMemCacheSizePercent(memoryCacheSize);
    params.diskCacheEnabled = mode === CacheMode.diskAndMemory;
    params.diskCacheSize = diskCacheSize;
    var imageCache = org.nativescript.widgets.image.Cache.getInstance(params);
    imageFetcher.addImageCache(imageCache);
    imageFetcher.initCache();
}
exports.initImageCache = initImageCache;
application_1.android.on("activityStarted", function (args) {
    if (!imageFetcher) {
        initImageCache(args.activity);
    }
    else {
        imageFetcher.initCache();
    }
});
application_1.android.on("activityStopped", function (args) {
    if (imageFetcher) {
        imageFetcher.closeCache();
    }
});
//# sourceMappingURL=background.js.map