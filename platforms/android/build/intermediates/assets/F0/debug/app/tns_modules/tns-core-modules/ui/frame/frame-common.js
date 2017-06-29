function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
var file_name_resolver_1 = require("../../file-system/file-name-resolver");
var file_system_1 = require("../../file-system");
var builder_1 = require("../builder");
var application = require("../../application");
exports.application = application;
__export(require("../core/view"));
function onLivesync(args) {
    setTimeout(function () {
        var g = global;
        if (g.errorPage) {
            g.errorPage.closeModal();
            g.errorPage = undefined;
        }
        try {
            g.__onLiveSyncCore();
        }
        catch (ex) {
            g.errorPage = builder_1.parse("<Page><ScrollView><Label text=\"" + ex + "\" textWrap=\"true\" style=\"color: red;\" /></ScrollView></Page>");
            g.errorPage.showModal();
        }
    });
}
application.on("livesync", onLivesync);
var frameStack = [];
function buildEntryFromArgs(arg) {
    var entry;
    if (typeof arg === "string") {
        entry = {
            moduleName: arg
        };
    }
    else if (typeof arg === "function") {
        entry = {
            create: arg
        };
    }
    else {
        entry = arg;
    }
    return entry;
}
function reloadPage() {
    var frame = topmost();
    if (frame) {
        if (frame.currentPage && frame.currentPage.modal) {
            frame.currentPage.modal.closeModal();
        }
        var currentEntry = frame._currentEntry.entry;
        var newEntry = {
            animated: false,
            clearHistory: true,
            context: currentEntry.context,
            create: currentEntry.create,
            moduleName: currentEntry.moduleName,
            backstackVisible: currentEntry.backstackVisible
        };
        frame.navigate(newEntry);
    }
}
exports.reloadPage = reloadPage;
global.__onLiveSyncCore = reloadPage;
function resolvePageFromEntry(entry) {
    var page;
    if (entry.create) {
        page = entry.create();
        if (!page) {
            throw new Error("Failed to create Page with entry.create() function.");
        }
        page._refreshCss();
    }
    else if (entry.moduleName) {
        var currentAppPath = file_system_1.knownFolders.currentApp().path;
        var moduleNamePath = file_system_1.path.join(currentAppPath, entry.moduleName);
        view_1.traceWrite("frame module path: " + moduleNamePath, view_1.traceCategories.Navigation);
        view_1.traceWrite("frame module module: " + entry.moduleName, view_1.traceCategories.Navigation);
        var moduleExports = void 0;
        if (global.moduleExists(entry.moduleName)) {
            if (view_1.traceEnabled()) {
                view_1.traceWrite("Loading pre-registered JS module: " + entry.moduleName, view_1.traceCategories.Navigation);
            }
            moduleExports = global.loadModule(entry.moduleName);
        }
        else {
            var moduleExportsResolvedPath = file_name_resolver_1.resolveFileName(moduleNamePath, "js");
            if (moduleExportsResolvedPath) {
                if (view_1.traceEnabled()) {
                    view_1.traceWrite("Loading JS file: " + moduleExportsResolvedPath, view_1.traceCategories.Navigation);
                }
                moduleExportsResolvedPath = moduleExportsResolvedPath.substr(0, moduleExportsResolvedPath.length - 3);
                moduleExports = global.loadModule(moduleExportsResolvedPath);
            }
        }
        if (moduleExports && moduleExports.createPage) {
            if (view_1.traceEnabled()) {
                view_1.traceWrite("Calling createPage()", view_1.traceCategories.Navigation);
            }
            page = moduleExports.createPage();
            var cssFileName = file_name_resolver_1.resolveFileName(moduleNamePath, "css");
            if (cssFileName) {
                page.addCssFile(cssFileName);
            }
        }
        else {
            page = pageFromBuilder(moduleNamePath, moduleExports);
        }
        if (!page) {
            throw new Error("Failed to load Page from entry.moduleName: " + entry.moduleName);
        }
    }
    return page;
}
exports.resolvePageFromEntry = resolvePageFromEntry;
function pageFromBuilder(moduleNamePath, moduleExports) {
    var page;
    var fileName = file_name_resolver_1.resolveFileName(moduleNamePath, "xml");
    if (fileName) {
        if (view_1.traceEnabled()) {
            view_1.traceWrite("Loading XML file: " + fileName, view_1.traceCategories.Navigation);
        }
        page = builder_1.loadPage(moduleNamePath, fileName, moduleExports);
    }
    return page;
}
var FrameBase = (function (_super) {
    __extends(FrameBase, _super);
    function FrameBase() {
        var _this = _super.call(this) || this;
        _this._isInFrameStack = false;
        _this._backStack = new Array();
        _this._navigationQueue = new Array();
        return _this;
    }
    FrameBase.prototype.canGoBack = function () {
        return this._backStack.length > 0;
    };
    FrameBase.prototype.goBack = function (backstackEntry) {
        if (view_1.traceEnabled()) {
            view_1.traceWrite("GO BACK", view_1.traceCategories.Navigation);
        }
        if (!this.canGoBack()) {
            return;
        }
        if (!backstackEntry) {
            backstackEntry = this._backStack.pop();
        }
        else {
            var backIndex = this._backStack.indexOf(backstackEntry);
            if (backIndex < 0) {
                return;
            }
            this._backStack.splice(backIndex);
        }
        var navigationContext = {
            entry: backstackEntry,
            isBackNavigation: true
        };
        this._navigationQueue.push(navigationContext);
        if (this._navigationQueue.length === 1) {
            this._processNavigationContext(navigationContext);
        }
        else {
            if (view_1.traceEnabled()) {
                view_1.traceWrite("Going back scheduled", view_1.traceCategories.Navigation);
            }
        }
    };
    FrameBase.prototype.navigate = function (param) {
        if (view_1.traceEnabled()) {
            view_1.traceWrite("NAVIGATE", view_1.traceCategories.Navigation);
        }
        var entry = buildEntryFromArgs(param);
        var page = resolvePageFromEntry(entry);
        this._pushInFrameStack();
        var backstackEntry = {
            entry: entry,
            resolvedPage: page,
            navDepth: undefined,
            fragmentTag: undefined,
            isBack: undefined,
            isNavigation: true
        };
        var navigationContext = {
            entry: backstackEntry,
            isBackNavigation: false
        };
        this._navigationQueue.push(navigationContext);
        if (this._navigationQueue.length === 1) {
            this._processNavigationContext(navigationContext);
        }
        else {
            if (view_1.traceEnabled()) {
                view_1.traceWrite("Navigation scheduled", view_1.traceCategories.Navigation);
            }
        }
    };
    FrameBase.prototype._processNavigationQueue = function (page) {
        if (this._navigationQueue.length === 0) {
            return;
        }
        var entry = this._navigationQueue[0].entry;
        var currentNavigationPage = entry.resolvedPage;
        if (page !== currentNavigationPage) {
            throw new Error("Corrupted navigation stack; page: " + page + "; currentNavigationPage: " + currentNavigationPage);
        }
        this._navigationQueue.shift();
        if (this._navigationQueue.length > 0) {
            var navigationContext = this._navigationQueue[0];
            this._processNavigationContext(navigationContext);
        }
        this._updateActionBar();
    };
    FrameBase.prototype.navigationQueueIsEmpty = function () {
        return this._navigationQueue.length === 0;
    };
    FrameBase._isEntryBackstackVisible = function (entry) {
        if (!entry) {
            return false;
        }
        var backstackVisibleValue = entry.entry.backstackVisible;
        var backstackHidden = backstackVisibleValue !== undefined && !backstackVisibleValue;
        return !backstackHidden;
    };
    FrameBase.prototype._updateActionBar = function (page, disableNavBarAnimation) {
    };
    FrameBase.prototype._processNavigationContext = function (navigationContext) {
        if (navigationContext.isBackNavigation) {
            this.performGoBack(navigationContext);
        }
        else {
            this.performNavigation(navigationContext);
        }
    };
    FrameBase.prototype.performNavigation = function (navigationContext) {
        var navContext = navigationContext.entry;
        if (navigationContext.entry.entry.clearHistory) {
            this._backStack.length = 0;
        }
        else if (FrameBase._isEntryBackstackVisible(this._currentEntry)) {
            this._backStack.push(this._currentEntry);
        }
        this._onNavigatingTo(navContext, navigationContext.isBackNavigation);
        this._navigateCore(navContext);
    };
    FrameBase.prototype.performGoBack = function (navigationContext) {
        var navContext = navigationContext.entry;
        this._onNavigatingTo(navContext, navigationContext.isBackNavigation);
        this._goBackCore(navContext);
    };
    FrameBase.prototype._goBackCore = function (backstackEntry) {
        if (view_1.traceEnabled()) {
            view_1.traceWrite("GO BACK CORE(" + this._backstackEntryTrace(backstackEntry) + "); currentPage: " + this.currentPage, view_1.traceCategories.Navigation);
        }
    };
    FrameBase.prototype._navigateCore = function (backstackEntry) {
        if (view_1.traceEnabled()) {
            view_1.traceWrite("NAVIGATE CORE(" + this._backstackEntryTrace(backstackEntry) + "); currentPage: " + this.currentPage, view_1.traceCategories.Navigation);
        }
    };
    FrameBase.prototype._onNavigatingTo = function (backstackEntry, isBack) {
        if (this.currentPage) {
            this.currentPage.onNavigatingFrom(isBack);
        }
        backstackEntry.resolvedPage.onNavigatingTo(backstackEntry.entry.context, isBack, backstackEntry.entry.bindingContext);
    };
    Object.defineProperty(FrameBase.prototype, "animated", {
        get: function () {
            return this._animated;
        },
        set: function (value) {
            this._animated = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameBase.prototype, "transition", {
        get: function () {
            return this._transition;
        },
        set: function (value) {
            this._transition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameBase.prototype, "backStack", {
        get: function () {
            return this._backStack.slice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameBase.prototype, "currentPage", {
        get: function () {
            if (this._currentEntry) {
                return this._currentEntry.resolvedPage;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameBase.prototype, "currentEntry", {
        get: function () {
            if (this._currentEntry) {
                return this._currentEntry.entry;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    FrameBase.prototype._pushInFrameStack = function () {
        if (this._isInFrameStack) {
            return;
        }
        frameStack.push(this);
        this._isInFrameStack = true;
    };
    FrameBase.prototype._popFromFrameStack = function () {
        if (!this._isInFrameStack) {
            return;
        }
        var top = topmost();
        if (top !== this) {
            throw new Error("Cannot pop a Frame which is not at the top of the navigation stack.");
        }
        frameStack.pop();
        this._isInFrameStack = false;
    };
    Object.defineProperty(FrameBase.prototype, "_childrenCount", {
        get: function () {
            if (this.currentPage) {
                return 1;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    FrameBase.prototype.eachChildView = function (callback) {
        if (this.currentPage) {
            callback(this.currentPage);
        }
    };
    FrameBase.prototype._getIsAnimatedNavigation = function (entry) {
        if (entry && entry.animated !== undefined) {
            return entry.animated;
        }
        if (this.animated !== undefined) {
            return this.animated;
        }
        return FrameBase.defaultAnimatedNavigation;
    };
    FrameBase.prototype._getNavigationTransition = function (entry) {
        if (entry) {
            if (view_1.isIOS && entry.transitioniOS !== undefined) {
                return entry.transitioniOS;
            }
            if (view_1.isAndroid && entry.transitionAndroid !== undefined) {
                return entry.transitionAndroid;
            }
            if (entry.transition !== undefined) {
                return entry.transition;
            }
        }
        if (this.transition !== undefined) {
            return this.transition;
        }
        return FrameBase.defaultTransition;
    };
    Object.defineProperty(FrameBase.prototype, "navigationBarHeight", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    FrameBase.prototype._getNavBarVisible = function (page) {
        throw new Error();
    };
    FrameBase.prototype._addViewToNativeVisualTree = function (child) {
        return true;
    };
    FrameBase.prototype._removeViewFromNativeVisualTree = function (child) {
        child._isAddedToNativeVisualTree = false;
    };
    FrameBase.prototype._printFrameBackStack = function () {
        var length = this.backStack.length;
        var i = length - 1;
        console.log("Frame Back Stack: ");
        while (i >= 0) {
            var backstackEntry = this.backStack[i--];
            console.log("\t" + backstackEntry.resolvedPage);
        }
    };
    FrameBase.prototype._backstackEntryTrace = function (b) {
        var result = "" + b.resolvedPage;
        var backstackVisible = FrameBase._isEntryBackstackVisible(b);
        if (!backstackVisible) {
            result += " | INVISIBLE";
        }
        if (b.entry.clearHistory) {
            result += " | CLEAR HISTORY";
        }
        var animated = this._getIsAnimatedNavigation(b.entry);
        if (!animated) {
            result += " | NOT ANIMATED";
        }
        var t = this._getNavigationTransition(b.entry);
        if (t) {
            result += " | Transition[" + JSON.stringify(t) + "]";
        }
        return result;
    };
    return FrameBase;
}(view_1.CustomLayoutView));
FrameBase.androidOptionSelectedEvent = "optionSelected";
FrameBase.defaultAnimatedNavigation = true;
exports.FrameBase = FrameBase;
function topmost() {
    if (frameStack.length > 0) {
        return frameStack[frameStack.length - 1];
    }
    return undefined;
}
exports.topmost = topmost;
function goBack() {
    var top = topmost();
    if (top.canGoBack()) {
        top.goBack();
        return true;
    }
    if (frameStack.length > 1) {
        top._popFromFrameStack();
    }
    return false;
}
exports.goBack = goBack;
function stack() {
    return frameStack;
}
exports.stack = stack;
//# sourceMappingURL=frame-common.js.map