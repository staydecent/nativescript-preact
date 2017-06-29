function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var application_common_1 = require("./application-common");
__export(require("./application-common"));
var ActivityCreated = "activityCreated";
var ActivityDestroyed = "activityDestroyed";
var ActivityStarted = "activityStarted";
var ActivityPaused = "activityPaused";
var ActivityResumed = "activityResumed";
var ActivityStopped = "activityStopped";
var SaveActivityState = "saveActivityState";
var ActivityResult = "activityResult";
var ActivityBackPressed = "activityBackPressed";
var ActivityRequestPermissions = "activityRequestPermissions";
var AndroidApplication = (function (_super) {
    __extends(AndroidApplication, _super);
    function AndroidApplication() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._registeredReceivers = {};
        _this._pendingReceiverRegistrations = new Array();
        return _this;
    }
    Object.defineProperty(AndroidApplication.prototype, "currentContext", {
        get: function () {
            return this.foregroundActivity;
        },
        enumerable: true,
        configurable: true
    });
    AndroidApplication.prototype.init = function (nativeApp) {
        if (this.nativeApp === nativeApp) {
            return;
        }
        if (this.nativeApp) {
            throw new Error("application.android already initialized.");
        }
        this.nativeApp = nativeApp;
        this.packageName = nativeApp.getPackageName();
        this.context = nativeApp.getApplicationContext();
        var lifecycleCallbacks = initLifecycleCallbacks();
        var componentCallbacks = initComponentCallbacks();
        this.nativeApp.registerActivityLifecycleCallbacks(lifecycleCallbacks);
        this.nativeApp.registerComponentCallbacks(componentCallbacks);
        this._registerPendingReceivers();
    };
    AndroidApplication.prototype._registerPendingReceivers = function () {
        var _this = this;
        this._pendingReceiverRegistrations.forEach(function (func) { return func(_this.context); });
        this._pendingReceiverRegistrations.length = 0;
    };
    AndroidApplication.prototype.registerBroadcastReceiver = function (intentFilter, onReceiveCallback) {
        ensureBroadCastReceiverClass();
        var that = this;
        var registerFunc = function (context) {
            var receiver = new BroadcastReceiverClass(onReceiveCallback);
            context.registerReceiver(receiver, new android.content.IntentFilter(intentFilter));
            that._registeredReceivers[intentFilter] = receiver;
        };
        if (this.context) {
            registerFunc(this.context);
        }
        else {
            this._pendingReceiverRegistrations.push(registerFunc);
        }
    };
    AndroidApplication.prototype.unregisterBroadcastReceiver = function (intentFilter) {
        var receiver = this._registeredReceivers[intentFilter];
        if (receiver) {
            this.context.unregisterReceiver(receiver);
            this._registeredReceivers[intentFilter] = undefined;
            delete this._registeredReceivers[intentFilter];
        }
    };
    return AndroidApplication;
}(application_common_1.Observable));
AndroidApplication.activityCreatedEvent = ActivityCreated;
AndroidApplication.activityDestroyedEvent = ActivityDestroyed;
AndroidApplication.activityStartedEvent = ActivityStarted;
AndroidApplication.activityPausedEvent = ActivityPaused;
AndroidApplication.activityResumedEvent = ActivityResumed;
AndroidApplication.activityStoppedEvent = ActivityStopped;
AndroidApplication.saveActivityStateEvent = SaveActivityState;
AndroidApplication.activityResultEvent = ActivityResult;
AndroidApplication.activityBackPressedEvent = ActivityBackPressed;
AndroidApplication.activityRequestPermissionsEvent = ActivityRequestPermissions;
exports.AndroidApplication = AndroidApplication;
var androidApp = new AndroidApplication();
exports.android = androidApp;
application_common_1.setApplication(androidApp);
var mainEntry;
var started = false;
function start(entry) {
    if (started) {
        throw new Error("Application is already started.");
    }
    started = true;
    mainEntry = typeof entry === "string" ? { moduleName: entry } : entry;
    if (!androidApp.nativeApp) {
        var nativeApp = getNativeApplication();
        androidApp.init(nativeApp);
    }
}
exports.start = start;
function getMainEntry() {
    return mainEntry;
}
exports.getMainEntry = getMainEntry;
function getNativeApplication() {
    var nativeApp = androidApp.nativeApp;
    if (!nativeApp) {
        if (!nativeApp && com.tns.NativeScriptApplication) {
            nativeApp = com.tns.NativeScriptApplication.getInstance();
        }
        if (!nativeApp) {
            var clazz = java.lang.Class.forName("android.app.ActivityThread");
            if (clazz) {
                var method = clazz.getMethod("currentApplication", null);
                if (method) {
                    nativeApp = method.invoke(null, null);
                }
            }
        }
        if (!nativeApp) {
            throw new Error("Failed to retrieve native Android Application object. If you have a custom android.app.Application type implemented make sure that you've called the '<application-module>.android.init' method.");
        }
    }
    return nativeApp;
}
exports.getNativeApplication = getNativeApplication;
global.__onLiveSync = function () {
    if (androidApp && androidApp.paused) {
        return;
    }
    application_common_1.livesync();
};
function initLifecycleCallbacks() {
    var lifecycleCallbacks = new android.app.Application.ActivityLifecycleCallbacks({
        onActivityCreated: function (activity, savedInstanceState) {
            var activityInfo = activity.getPackageManager().getActivityInfo(activity.getComponentName(), android.content.pm.PackageManager.GET_META_DATA);
            if (activityInfo.metaData) {
                var setThemeOnLaunch = activityInfo.metaData.getInt("SET_THEME_ON_LAUNCH", -1);
                if (setThemeOnLaunch !== -1) {
                    activity.setTheme(setThemeOnLaunch);
                }
            }
            if (!androidApp.startActivity) {
                androidApp.startActivity = activity;
            }
            androidApp.notify({ eventName: ActivityCreated, object: androidApp, activity: activity, bundle: savedInstanceState });
            if (application_common_1.hasListeners(application_common_1.displayedEvent)) {
                var rootView_1 = activity.findViewById(android.R.id.content);
                var onGlobalLayoutListener_1 = new android.view.ViewTreeObserver.OnGlobalLayoutListener({
                    onGlobalLayout: function () {
                        application_common_1.notify({ eventName: application_common_1.displayedEvent, object: androidApp, activity: activity });
                        var viewTreeObserver = rootView_1.getViewTreeObserver();
                        viewTreeObserver.removeOnGlobalLayoutListener(onGlobalLayoutListener_1);
                    }
                });
                rootView_1.getViewTreeObserver().addOnGlobalLayoutListener(onGlobalLayoutListener_1);
            }
        },
        onActivityDestroyed: function (activity) {
            if (activity === androidApp.foregroundActivity) {
                androidApp.foregroundActivity = undefined;
            }
            if (activity === androidApp.startActivity) {
                androidApp.startActivity = undefined;
            }
            androidApp.notify({ eventName: ActivityDestroyed, object: androidApp, activity: activity });
            gc();
        },
        onActivityPaused: function (activity) {
            if (activity.isNativeScriptActivity) {
                androidApp.paused = true;
                application_common_1.notify({ eventName: application_common_1.suspendEvent, object: androidApp, android: activity });
            }
            androidApp.notify({ eventName: ActivityPaused, object: androidApp, activity: activity });
        },
        onActivityResumed: function (activity) {
            androidApp.foregroundActivity = activity;
            if (activity.isNativeScriptActivity) {
                application_common_1.notify({ eventName: application_common_1.resumeEvent, object: androidApp, android: activity });
                androidApp.paused = false;
            }
            androidApp.notify({ eventName: ActivityResumed, object: androidApp, activity: activity });
        },
        onActivitySaveInstanceState: function (activity, outState) {
            androidApp.notify({ eventName: SaveActivityState, object: androidApp, activity: activity, bundle: outState });
        },
        onActivityStarted: function (activity) {
            androidApp.notify({ eventName: ActivityStarted, object: androidApp, activity: activity });
        },
        onActivityStopped: function (activity) {
            androidApp.notify({ eventName: ActivityStopped, object: androidApp, activity: activity });
        }
    });
    return lifecycleCallbacks;
}
var currentOrientation;
function initComponentCallbacks() {
    var componentCallbacks = new android.content.ComponentCallbacks2({
        onLowMemory: function () {
            gc();
            java.lang.System.gc();
            application_common_1.notify({ eventName: application_common_1.lowMemoryEvent, object: this, android: this });
        },
        onTrimMemory: function (level) {
        },
        onConfigurationChanged: function (newConfig) {
            var newOrientation = newConfig.orientation;
            if (newOrientation === currentOrientation) {
                return;
            }
            currentOrientation = newOrientation;
            var newValue;
            switch (newOrientation) {
                case android.content.res.Configuration.ORIENTATION_LANDSCAPE:
                    newValue = "landscape";
                    break;
                case android.content.res.Configuration.ORIENTATION_PORTRAIT:
                    newValue = "portrait";
                    break;
                default:
                    newValue = "unknown";
                    break;
            }
            application_common_1.notify({
                eventName: application_common_1.orientationChangedEvent,
                android: androidApp.nativeApp,
                newValue: newValue,
                object: androidApp
            });
        }
    });
    return componentCallbacks;
}
var BroadcastReceiverClass;
function ensureBroadCastReceiverClass() {
    if (BroadcastReceiverClass) {
        return;
    }
    var BroadcastReceiver = (function (_super) {
        __extends(BroadcastReceiver, _super);
        function BroadcastReceiver(onReceiveCallback) {
            var _this = _super.call(this) || this;
            _this._onReceiveCallback = onReceiveCallback;
            return global.__native(_this);
        }
        BroadcastReceiver.prototype.onReceive = function (context, intent) {
            if (this._onReceiveCallback) {
                this._onReceiveCallback(context, intent);
            }
        };
        return BroadcastReceiver;
    }(android.content.BroadcastReceiver));
    BroadcastReceiverClass = BroadcastReceiver;
}
//# sourceMappingURL=application.js.map