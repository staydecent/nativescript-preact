function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var html_view_common_1 = require("./html-view-common");
__export(require("./html-view-common"));
var HtmlView = (function (_super) {
    __extends(HtmlView, _super);
    function HtmlView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HtmlView.prototype.createNativeView = function () {
        var textView = new android.widget.TextView(this._context);
        textView.setLinksClickable(true);
        textView.setMovementMethod(android.text.method.LinkMovementMethod.getInstance());
        return textView;
    };
    HtmlView.prototype[html_view_common_1.htmlProperty.getDefault] = function () {
        return "";
    };
    HtmlView.prototype[html_view_common_1.htmlProperty.setNative] = function (value) {
        var mask = 15;
        if (value.search(/<a\s/i) >= 0) {
            mask = 0;
        }
        this.nativeView.setAutoLinkMask(mask);
        this.nativeView.setText(android.text.Html.fromHtml(value));
    };
    return HtmlView;
}(html_view_common_1.HtmlViewBase));
exports.HtmlView = HtmlView;
//# sourceMappingURL=html-view.js.map