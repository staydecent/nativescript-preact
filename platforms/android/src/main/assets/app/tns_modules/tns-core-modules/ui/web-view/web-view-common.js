function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
var file_system_1 = require("../../file-system");
exports.File = file_system_1.File;
exports.knownFolders = file_system_1.knownFolders;
exports.path = file_system_1.path;
__export(require("../core/view"));
exports.srcProperty = new view_1.Property({ name: "src" });
var WebViewBase = (function (_super) {
    __extends(WebViewBase, _super);
    function WebViewBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebViewBase.prototype._onLoadFinished = function (url, error) {
        var args = {
            eventName: WebViewBase.loadFinishedEvent,
            object: this,
            url: url,
            navigationType: undefined,
            error: error
        };
        this.notify(args);
    };
    WebViewBase.prototype._onLoadStarted = function (url, navigationType) {
        var args = {
            eventName: WebViewBase.loadStartedEvent,
            object: this,
            url: url,
            navigationType: navigationType,
            error: undefined
        };
        this.notify(args);
    };
    Object.defineProperty(WebViewBase.prototype, "canGoBack", {
        get: function () {
            throw new Error("This member is abstract.");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebViewBase.prototype, "canGoForward", {
        get: function () {
            throw new Error("This member is abstract.");
        },
        enumerable: true,
        configurable: true
    });
    WebViewBase.prototype[exports.srcProperty.getDefault] = function () {
        return "";
    };
    WebViewBase.prototype[exports.srcProperty.setNative] = function (src) {
        this.stopLoading();
        if (src.indexOf("~/") === 0) {
            src = "file:///" + file_system_1.knownFolders.currentApp().path + "/" + src.substr(2);
        }
        else if (src.indexOf("/") === 0) {
            src = "file://" + src;
        }
        if (src.toLowerCase().indexOf("http://") === 0 ||
            src.toLowerCase().indexOf("https://") === 0 ||
            src.toLowerCase().indexOf("file:///") === 0) {
            this._loadUrl(src);
        }
        else {
            this._loadData(src);
        }
    };
    Object.defineProperty(WebViewBase.prototype, "url", {
        get: function () {
            throw new Error("Property url of WebView is deprecated. Use src instead");
        },
        set: function (value) {
            throw new Error("Property url of WebView is deprecated. Use src instead");
        },
        enumerable: true,
        configurable: true
    });
    return WebViewBase;
}(view_1.View));
WebViewBase.loadStartedEvent = "loadStarted";
WebViewBase.loadFinishedEvent = "loadFinished";
exports.WebViewBase = WebViewBase;
exports.srcProperty.register(WebViewBase);
//# sourceMappingURL=web-view-common.js.map