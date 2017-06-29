Object.defineProperty(exports, "__esModule", { value: true });
var appModule = require("../application");
var MIN_TABLET_PIXELS = 600;
var platformNames;
(function (platformNames) {
    platformNames.android = "Android";
    platformNames.ios = "iOS";
})(platformNames = exports.platformNames || (exports.platformNames = {}));
var Device = (function () {
    function Device() {
    }
    Object.defineProperty(Device.prototype, "os", {
        get: function () {
            return platformNames.android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Device.prototype, "manufacturer", {
        get: function () {
            if (!this._manufacturer) {
                this._manufacturer = android.os.Build.MANUFACTURER;
            }
            return this._manufacturer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Device.prototype, "osVersion", {
        get: function () {
            if (!this._osVersion) {
                this._osVersion = android.os.Build.VERSION.RELEASE;
            }
            return this._osVersion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Device.prototype, "model", {
        get: function () {
            if (!this._model) {
                this._model = android.os.Build.MODEL;
            }
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Device.prototype, "sdkVersion", {
        get: function () {
            if (!this._sdkVersion) {
                this._sdkVersion = android.os.Build.VERSION.SDK;
            }
            return this._sdkVersion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Device.prototype, "deviceType", {
        get: function () {
            if (!this._deviceType) {
                var dips = Math.min(screen.mainScreen.widthPixels, screen.mainScreen.heightPixels) / screen.mainScreen.scale;
                if (dips >= MIN_TABLET_PIXELS) {
                    this._deviceType = "Tablet";
                }
                else {
                    this._deviceType = "Phone";
                }
            }
            return this._deviceType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Device.prototype, "uuid", {
        get: function () {
            if (!this._uuid) {
                var nativeApp = appModule.android.nativeApp;
                this._uuid = android.provider.Settings.Secure.getString(nativeApp.getContentResolver(), android.provider.Settings.Secure.ANDROID_ID);
            }
            return this._uuid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Device.prototype, "language", {
        get: function () {
            if (!this._language) {
                this._language = java.util.Locale.getDefault().getLanguage().replace("_", "-");
            }
            return this._language;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Device.prototype, "region", {
        get: function () {
            if (!this._region) {
                this._region = java.util.Locale.getDefault().getCountry();
            }
            return this._region;
        },
        enumerable: true,
        configurable: true
    });
    return Device;
}());
var MainScreen = (function () {
    function MainScreen() {
    }
    MainScreen.prototype.cssChanged = function (args) {
        if (!this._metrics) {
            this._metrics = new android.util.DisplayMetrics();
        }
        this.initMetrics();
    };
    MainScreen.prototype.initMetrics = function () {
        var nativeApp = appModule.getNativeApplication();
        nativeApp.getSystemService(android.content.Context.WINDOW_SERVICE).getDefaultDisplay().getRealMetrics(this._metrics);
    };
    Object.defineProperty(MainScreen.prototype, "metrics", {
        get: function () {
            if (!this._metrics) {
                appModule.on("cssChanged", this.cssChanged, this);
                this._metrics = new android.util.DisplayMetrics();
                this.initMetrics();
            }
            return this._metrics;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainScreen.prototype, "widthPixels", {
        get: function () {
            return this.metrics.widthPixels;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainScreen.prototype, "heightPixels", {
        get: function () {
            return this.metrics.heightPixels;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainScreen.prototype, "scale", {
        get: function () {
            return this.metrics.density;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainScreen.prototype, "widthDIPs", {
        get: function () {
            return this.metrics.widthPixels / this.metrics.density;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainScreen.prototype, "heightDIPs", {
        get: function () {
            return this.metrics.heightPixels / this.metrics.density;
        },
        enumerable: true,
        configurable: true
    });
    return MainScreen;
}());
exports.device = new Device();
var screen;
(function (screen) {
    screen.mainScreen = new MainScreen();
})(screen = exports.screen || (exports.screen = {}));
exports.isAndroid = true;
//# sourceMappingURL=platform.js.map