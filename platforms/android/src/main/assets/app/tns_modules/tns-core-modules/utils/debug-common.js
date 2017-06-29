Object.defineProperty(exports, "__esModule", { value: true });
var file_system_1 = require("../file-system");
exports.debug = true;
var applicationRootPath;
function ensureAppRootPath() {
    if (!applicationRootPath) {
        applicationRootPath = file_system_1.knownFolders.currentApp().path;
        applicationRootPath = applicationRootPath.substr(0, applicationRootPath.length - "app/".length);
    }
}
var Source = (function () {
    function Source(uri, line, column) {
        ensureAppRootPath();
        if (uri.length > applicationRootPath.length && uri.substr(0, applicationRootPath.length) === applicationRootPath) {
            this._uri = "file://" + uri.substr(applicationRootPath.length);
        }
        else {
            this._uri = uri;
        }
        this._line = line;
        this._column = column;
    }
    Object.defineProperty(Source.prototype, "uri", {
        get: function () { return this._uri; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "line", {
        get: function () { return this._line; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "column", {
        get: function () { return this._column; },
        enumerable: true,
        configurable: true
    });
    Source.prototype.toString = function () {
        return this._uri + ":" + this._line + ":" + this._column;
    };
    Source.get = function (object) {
        return object[Source._source];
    };
    Source.set = function (object, src) {
        object[Source._source] = src;
    };
    return Source;
}());
Source._source = Symbol("source");
exports.Source = Source;
//# sourceMappingURL=debug-common.js.map