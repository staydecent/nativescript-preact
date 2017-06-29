function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var trace_1 = require("../trace");
__export(require("./utils-common"));
var application_1 = require("../application");
var layout;
(function (layout) {
    var density;
    var MODE_SHIFT = 30;
    var MODE_MASK = 0x3 << MODE_SHIFT;
    var sdkVersion;
    var useOldMeasureSpec = false;
    function makeMeasureSpec(size, mode) {
        if (sdkVersion === undefined) {
            sdkVersion = ad.getApplicationContext().getApplicationInfo().targetSdkVersion;
            useOldMeasureSpec = sdkVersion <= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1;
        }
        if (useOldMeasureSpec) {
            return size + mode;
        }
        return (size & ~MODE_MASK) | (mode & MODE_MASK);
    }
    layout.makeMeasureSpec = makeMeasureSpec;
    function getDisplayDensity() {
        if (density === undefined) {
            density = ad.getResources().getDisplayMetrics().density;
        }
        return density;
    }
    layout.getDisplayDensity = getDisplayDensity;
    function toDevicePixels(value) {
        return value * getDisplayDensity();
    }
    layout.toDevicePixels = toDevicePixels;
    function toDeviceIndependentPixels(value) {
        return value / getDisplayDensity();
    }
    layout.toDeviceIndependentPixels = toDeviceIndependentPixels;
    function measureNativeView(nativeView, width, widthMode, height, heightMode) {
        var view = nativeView;
        view.measure(makeMeasureSpec(width, widthMode), makeMeasureSpec(height, heightMode));
        return {
            width: view.getMeasuredWidth(),
            height: view.getMeasuredHeight()
        };
    }
    layout.measureNativeView = measureNativeView;
})(layout = exports.layout || (exports.layout = {}));
var ad;
(function (ad) {
    var application;
    var applicationContext;
    var contextResources;
    var packageName;
    function getApplicationContext() {
        if (!applicationContext) {
            applicationContext = getApplication().getApplicationContext();
        }
        return applicationContext;
    }
    ad.getApplicationContext = getApplicationContext;
    function getApplication() {
        if (!application) {
            application = application_1.getNativeApplication();
        }
        return application;
    }
    ad.getApplication = getApplication;
    function getResources() {
        if (!contextResources) {
            contextResources = getApplication().getResources();
        }
        return contextResources;
    }
    ad.getResources = getResources;
    function getPackageName() {
        if (!packageName) {
            packageName = getApplicationContext().getPackageName();
        }
        return packageName;
    }
    var inputMethodManager;
    function getInputMethodManager() {
        if (!inputMethodManager) {
            inputMethodManager = getApplicationContext().getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
        }
        return inputMethodManager;
    }
    ad.getInputMethodManager = getInputMethodManager;
    function showSoftInput(nativeView) {
        var inputManager = getInputMethodManager();
        if (inputManager && nativeView instanceof android.view.View) {
            inputManager.showSoftInput(nativeView, android.view.inputmethod.InputMethodManager.SHOW_IMPLICIT);
        }
    }
    ad.showSoftInput = showSoftInput;
    function dismissSoftInput(nativeView) {
        var inputManager = getInputMethodManager();
        var windowToken;
        if (nativeView instanceof android.view.View) {
            windowToken = nativeView.getWindowToken();
        }
        else if (application_1.android.foregroundActivity instanceof android.app.Activity) {
            var decorView = application_1.android.foregroundActivity.getWindow().getDecorView();
            windowToken = decorView ? decorView.getWindowToken() : null;
        }
        if (inputManager && windowToken) {
            inputManager.hideSoftInputFromWindow(windowToken, 0);
        }
    }
    ad.dismissSoftInput = dismissSoftInput;
    var collections;
    (function (collections) {
        function stringArrayToStringSet(str) {
            var hashSet = new java.util.HashSet();
            if (str !== undefined) {
                for (var element in str) {
                    hashSet.add('' + str[element]);
                }
            }
            return hashSet;
        }
        collections.stringArrayToStringSet = stringArrayToStringSet;
        function stringSetToStringArray(stringSet) {
            var arr = [];
            if (stringSet !== undefined) {
                var it = stringSet.iterator();
                while (it.hasNext()) {
                    var element = '' + it.next();
                    arr.push(element);
                }
            }
            return arr;
        }
        collections.stringSetToStringArray = stringSetToStringArray;
    })(collections = ad.collections || (ad.collections = {}));
    var resources;
    (function (resources_1) {
        var attr;
        var attrCache = new Map();
        function getDrawableId(name) {
            return getId(":drawable/" + name);
        }
        resources_1.getDrawableId = getDrawableId;
        function getStringId(name) {
            return getId(":string/" + name);
        }
        resources_1.getStringId = getStringId;
        function getId(name) {
            var resources = getResources();
            var packageName = getPackageName();
            var uri = packageName + name;
            return resources.getIdentifier(uri, null, null);
        }
        resources_1.getId = getId;
        function getPalleteColor(name, context) {
            if (attrCache.has(name)) {
                return attrCache.get(name);
            }
            var result = 0;
            try {
                if (!attr) {
                    attr = java.lang.Class.forName("android.support.v7.appcompat.R$attr");
                }
                var colorID = 0;
                var field = attr.getField(name);
                if (field) {
                    colorID = field.getInt(null);
                }
                if (colorID) {
                    var typedValue = new android.util.TypedValue();
                    context.getTheme().resolveAttribute(colorID, typedValue, true);
                    result = typedValue.data;
                }
            }
            catch (ex) {
                trace_1.write("Cannot get pallete color: " + name, trace_1.categories.Error, trace_1.messageType.error);
            }
            attrCache.set(name, result);
            return result;
        }
        resources_1.getPalleteColor = getPalleteColor;
    })(resources = ad.resources || (ad.resources = {}));
})(ad = exports.ad || (exports.ad = {}));
function GC() {
    gc();
}
exports.GC = GC;
function openUrl(location) {
    var context = ad.getApplicationContext();
    try {
        var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(location.trim()));
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }
    catch (e) {
        trace_1.write("Error in OpenURL", trace_1.categories.Error, trace_1.messageType.error);
        return false;
    }
    return true;
}
exports.openUrl = openUrl;
//# sourceMappingURL=utils.js.map