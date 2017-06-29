function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var web_view_common_1 = require("./web-view-common");
__export(require("./web-view-common"));
var WebViewClient;
function initializeWebViewClient() {
    if (WebViewClient) {
        return;
    }
    var WebViewClientImpl = (function (_super) {
        __extends(WebViewClientImpl, _super);
        function WebViewClientImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        WebViewClientImpl.prototype.shouldOverrideUrlLoading = function (view, url) {
            if (web_view_common_1.traceEnabled()) {
                web_view_common_1.traceWrite("WebViewClientClass.shouldOverrideUrlLoading(" + url + ")", web_view_common_1.traceCategories.Debug);
            }
            return false;
        };
        WebViewClientImpl.prototype.onPageStarted = function (view, url, favicon) {
            _super.prototype.onPageStarted.call(this, view, url, favicon);
            var owner = this.owner;
            if (owner) {
                if (web_view_common_1.traceEnabled()) {
                    web_view_common_1.traceWrite("WebViewClientClass.onPageStarted(" + url + ", " + favicon + ")", web_view_common_1.traceCategories.Debug);
                }
                owner._onLoadStarted(url, undefined);
            }
        };
        WebViewClientImpl.prototype.onPageFinished = function (view, url) {
            _super.prototype.onPageFinished.call(this, view, url);
            var owner = this.owner;
            if (owner) {
                if (web_view_common_1.traceEnabled()) {
                    web_view_common_1.traceWrite("WebViewClientClass.onPageFinished(" + url + ")", web_view_common_1.traceCategories.Debug);
                }
                owner._onLoadFinished(url, undefined);
            }
        };
        WebViewClientImpl.prototype.onReceivedError = function () {
            var view = arguments[0];
            if (arguments.length === 4) {
                var errorCode = arguments[1];
                var description = arguments[2];
                var failingUrl = arguments[3];
                _super.prototype.onReceivedError.call(this, view, errorCode, description, failingUrl);
                var owner = this.owner;
                if (owner) {
                    if (web_view_common_1.traceEnabled()) {
                        web_view_common_1.traceWrite("WebViewClientClass.onReceivedError(" + errorCode + ", " + description + ", " + failingUrl + ")", web_view_common_1.traceCategories.Debug);
                    }
                    owner._onLoadFinished(failingUrl, description + "(" + errorCode + ")");
                }
            }
            else {
                var request = arguments[1];
                var error = arguments[2];
                _super.prototype.onReceivedError.call(this, view, request, error);
                var owner = this.owner;
                if (owner) {
                    if (web_view_common_1.traceEnabled()) {
                        web_view_common_1.traceWrite("WebViewClientClass.onReceivedError(" + error.getErrorCode() + ", " + error.getDescription() + ", " + (error.getUrl && error.getUrl()) + ")", web_view_common_1.traceCategories.Debug);
                    }
                    owner._onLoadFinished(error.getUrl && error.getUrl(), error.getDescription() + "(" + error.getErrorCode() + ")");
                }
            }
        };
        return WebViewClientImpl;
    }(android.webkit.WebViewClient));
    ;
    WebViewClient = WebViewClientImpl;
}
var WebView = (function (_super) {
    __extends(WebView, _super);
    function WebView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebView.prototype.createNativeView = function () {
        initializeWebViewClient();
        var nativeView = new android.webkit.WebView(this._context);
        nativeView.getSettings().setJavaScriptEnabled(true);
        nativeView.getSettings().setBuiltInZoomControls(true);
        var client = new WebViewClient(this);
        nativeView.setWebViewClient(client);
        nativeView.client = client;
        return nativeView;
    };
    WebView.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this.nativeView.client.owner = this;
    };
    WebView.prototype.resetNativeView = function () {
        var nativeView = this.nativeView;
        if (nativeView) {
            nativeView.destroy();
        }
        nativeView.client.owner = null;
        _super.prototype.resetNativeView.call(this);
    };
    WebView.prototype._loadUrl = function (src) {
        var nativeView = this.nativeView;
        if (!nativeView) {
            return;
        }
        nativeView.loadUrl(src);
    };
    WebView.prototype._loadData = function (src) {
        var nativeView = this.nativeView;
        if (!nativeView) {
            return;
        }
        var baseUrl = "file:///" + web_view_common_1.knownFolders.currentApp().path + "/";
        nativeView.loadDataWithBaseURL(baseUrl, src, "text/html", "utf-8", null);
    };
    Object.defineProperty(WebView.prototype, "canGoBack", {
        get: function () {
            return this.nativeView.canGoBack();
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype.stopLoading = function () {
        var nativeView = this.nativeView;
        if (nativeView) {
            nativeView.stopLoading();
        }
    };
    Object.defineProperty(WebView.prototype, "canGoForward", {
        get: function () {
            var nativeView = this.nativeView;
            if (nativeView) {
                return nativeView.canGoForward();
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype.goBack = function () {
        var nativeView = this.nativeView;
        if (nativeView) {
            return nativeView.goBack();
        }
    };
    WebView.prototype.goForward = function () {
        var nativeView = this.nativeView;
        if (nativeView) {
            return nativeView.goForward();
        }
    };
    WebView.prototype.reload = function () {
        var nativeView = this.nativeView;
        if (nativeView) {
            return nativeView.reload();
        }
    };
    return WebView;
}(web_view_common_1.WebViewBase));
exports.WebView = WebView;
//# sourceMappingURL=web-view.js.map