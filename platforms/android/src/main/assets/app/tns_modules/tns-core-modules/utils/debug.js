function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./debug-common"));
var ScopeError = (function (_super) {
    __extends(ScopeError, _super);
    function ScopeError(inner, message) {
        var _this = this;
        var formattedMessage;
        if (message && inner.message) {
            formattedMessage = message + "\n > " + inner.message.replace("\n", "\n  ");
        }
        else {
            formattedMessage = message || inner.message || undefined;
        }
        _this = _super.call(this, formattedMessage) || this;
        _this.stack = "Error: " + _this.message + "\n" + inner.stack.substr(inner.stack.indexOf("\n") + 1);
        _this.message = formattedMessage;
        return _this;
    }
    return ScopeError;
}(Error));
exports.ScopeError = ScopeError;
var SourceError = (function (_super) {
    __extends(SourceError, _super);
    function SourceError(child, source, message) {
        return _super.call(this, child, message ? message + " @" + source + "" : source + "") || this;
    }
    return SourceError;
}(ScopeError));
exports.SourceError = SourceError;
//# sourceMappingURL=debug.js.map