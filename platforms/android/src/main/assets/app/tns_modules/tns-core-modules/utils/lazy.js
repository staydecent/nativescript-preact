Object.defineProperty(exports, "__esModule", { value: true });
function lazy(action) {
    var _value;
    return function () { return _value || (_value = action()); };
}
exports.default = lazy;
//# sourceMappingURL=lazy.js.map