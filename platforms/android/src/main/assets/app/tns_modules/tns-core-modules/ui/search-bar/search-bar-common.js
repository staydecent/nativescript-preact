function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
__export(require("../core/view"));
var SearchBarBase = (function (_super) {
    __extends(SearchBarBase, _super);
    function SearchBarBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SearchBarBase;
}(view_1.View));
SearchBarBase.submitEvent = "submit";
SearchBarBase.clearEvent = "clear";
exports.SearchBarBase = SearchBarBase;
exports.textProperty = new view_1.Property({ name: "text", defaultValue: "", affectsLayout: view_1.isIOS });
exports.textProperty.register(SearchBarBase);
exports.hintProperty = new view_1.Property({ name: "hint", defaultValue: "" });
exports.hintProperty.register(SearchBarBase);
exports.textFieldHintColorProperty = new view_1.Property({ name: "textFieldHintColor", equalityComparer: view_1.Color.equals, valueConverter: function (v) { return new view_1.Color(v); } });
exports.textFieldHintColorProperty.register(SearchBarBase);
exports.textFieldBackgroundColorProperty = new view_1.Property({ name: "textFieldBackgroundColor", equalityComparer: view_1.Color.equals, valueConverter: function (v) { return new view_1.Color(v); } });
exports.textFieldBackgroundColorProperty.register(SearchBarBase);
//# sourceMappingURL=search-bar-common.js.map