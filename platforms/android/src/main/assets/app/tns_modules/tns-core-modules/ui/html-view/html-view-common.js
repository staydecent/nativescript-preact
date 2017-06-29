function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
__export(require("../core/view"));
var HtmlViewBase = (function (_super) {
    __extends(HtmlViewBase, _super);
    function HtmlViewBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HtmlViewBase;
}(view_1.View));
exports.HtmlViewBase = HtmlViewBase;
exports.htmlProperty = new view_1.Property({ name: "html", defaultValue: "", affectsLayout: true });
exports.htmlProperty.register(HtmlViewBase);
//# sourceMappingURL=html-view-common.js.map