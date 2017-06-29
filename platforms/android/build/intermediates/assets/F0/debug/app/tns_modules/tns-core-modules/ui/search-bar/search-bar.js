function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var font_1 = require("../styling/font");
var search_bar_common_1 = require("./search-bar-common");
var utils_1 = require("../../utils/utils");
__export(require("./search-bar-common"));
var SEARCHTEXT = Symbol("searchText");
var QUERY = Symbol("query");
var QueryTextListener;
var CloseListener;
function initializeNativeClasses() {
    if (QueryTextListener) {
        return;
    }
    var QueryTextListenerImpl = (function (_super) {
        __extends(QueryTextListenerImpl, _super);
        function QueryTextListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        QueryTextListenerImpl.prototype.onQueryTextChange = function (newText) {
            var owner = this.owner;
            search_bar_common_1.textProperty.nativeValueChange(owner, newText);
            if (newText === "" && this[SEARCHTEXT] !== newText) {
                owner._emit(search_bar_common_1.SearchBarBase.clearEvent);
            }
            this[SEARCHTEXT] = newText;
            return true;
        };
        QueryTextListenerImpl.prototype.onQueryTextSubmit = function (query) {
            var owner = this.owner;
            if (query !== "" && this[QUERY] !== query) {
                owner._emit(search_bar_common_1.SearchBarBase.submitEvent);
            }
            this[QUERY] = query;
            return true;
        };
        return QueryTextListenerImpl;
    }(java.lang.Object));
    QueryTextListenerImpl = __decorate([
        Interfaces([android.widget.SearchView.OnQueryTextListener])
    ], QueryTextListenerImpl);
    var CloseListenerImpl = (function (_super) {
        __extends(CloseListenerImpl, _super);
        function CloseListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        CloseListenerImpl.prototype.onClose = function () {
            this.owner._emit(search_bar_common_1.SearchBarBase.clearEvent);
            return true;
        };
        return CloseListenerImpl;
    }(java.lang.Object));
    CloseListenerImpl = __decorate([
        Interfaces([android.widget.SearchView.OnCloseListener])
    ], CloseListenerImpl);
    QueryTextListener = QueryTextListenerImpl;
    CloseListener = CloseListenerImpl;
}
var SearchBar = (function (_super) {
    __extends(SearchBar, _super);
    function SearchBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SearchBar.prototype.dismissSoftInput = function () {
        utils_1.ad.dismissSoftInput(this.nativeView);
    };
    SearchBar.prototype.focus = function () {
        var result = _super.prototype.focus.call(this);
        if (result) {
            utils_1.ad.showSoftInput(this.nativeView);
        }
        return result;
    };
    SearchBar.prototype.createNativeView = function () {
        initializeNativeClasses();
        var nativeView = new android.widget.SearchView(this._context);
        nativeView.setIconified(false);
        var queryTextListener = new QueryTextListener(this);
        nativeView.setOnQueryTextListener(queryTextListener);
        nativeView.queryTextListener = queryTextListener;
        var closeListener = new CloseListener(this);
        nativeView.setOnCloseListener(closeListener);
        nativeView.closeListener = closeListener;
        return nativeView;
    };
    SearchBar.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeView;
        nativeView.closeListener.owner = this;
        nativeView.queryTextListener.owner = this;
    };
    SearchBar.prototype.disposeNativeView = function () {
        var nativeView = this.nativeView;
        nativeView.closeListener.owner = null;
        nativeView.queryTextListener.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    SearchBar.prototype[search_bar_common_1.backgroundColorProperty.getDefault] = function () {
        var result = this.nativeView.getDrawingCacheBackgroundColor();
        return result;
    };
    SearchBar.prototype[search_bar_common_1.backgroundColorProperty.setNative] = function (value) {
        var color;
        if (typeof value === "number") {
            color = value;
        }
        else {
            color = value.android;
        }
        this.nativeView.setBackgroundColor(color);
        var searchPlate = this._getSearchPlate();
        searchPlate.setBackgroundColor(color);
    };
    SearchBar.prototype[search_bar_common_1.colorProperty.getDefault] = function () {
        var textView = this._getTextView();
        return textView.getCurrentTextColor();
    };
    SearchBar.prototype[search_bar_common_1.colorProperty.setNative] = function (value) {
        var color = (typeof value === "number") ? value : value.android;
        var textView = this._getTextView();
        textView.setTextColor(color);
    };
    SearchBar.prototype[search_bar_common_1.fontSizeProperty.getDefault] = function () {
        return { nativeSize: this._getTextView().getTextSize() };
    };
    SearchBar.prototype[search_bar_common_1.fontSizeProperty.setNative] = function (value) {
        if (typeof value === "number") {
            this._getTextView().setTextSize(value);
        }
        else {
            this._getTextView().setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
        }
    };
    SearchBar.prototype[search_bar_common_1.fontInternalProperty.getDefault] = function () {
        return this._getTextView().getTypeface();
    };
    SearchBar.prototype[search_bar_common_1.fontInternalProperty.setNative] = function (value) {
        this._getTextView().setTypeface(value instanceof font_1.Font ? value.getAndroidTypeface() : value);
    };
    SearchBar.prototype[search_bar_common_1.backgroundInternalProperty.getDefault] = function () {
        return null;
    };
    SearchBar.prototype[search_bar_common_1.backgroundInternalProperty.setNative] = function (value) {
    };
    SearchBar.prototype[search_bar_common_1.textProperty.getDefault] = function () {
        return "";
    };
    SearchBar.prototype[search_bar_common_1.textProperty.setNative] = function (value) {
        var text = (value === null || value === undefined) ? '' : value.toString();
        this.nativeView.setQuery(text, false);
    };
    SearchBar.prototype[search_bar_common_1.hintProperty.getDefault] = function () {
        return "";
    };
    SearchBar.prototype[search_bar_common_1.hintProperty.setNative] = function (value) {
        var text = (value === null || value === undefined) ? '' : value.toString();
        this.nativeView.setQueryHint(text);
    };
    SearchBar.prototype[search_bar_common_1.textFieldBackgroundColorProperty.getDefault] = function () {
        var textView = this._getTextView();
        return textView.getCurrentTextColor();
    };
    SearchBar.prototype[search_bar_common_1.textFieldBackgroundColorProperty.setNative] = function (value) {
        var textView = this._getTextView();
        var color = value instanceof search_bar_common_1.Color ? value.android : value;
        textView.setBackgroundColor(color);
    };
    SearchBar.prototype[search_bar_common_1.textFieldHintColorProperty.getDefault] = function () {
        var textView = this._getTextView();
        return textView.getCurrentTextColor();
    };
    SearchBar.prototype[search_bar_common_1.textFieldHintColorProperty.setNative] = function (value) {
        var textView = this._getTextView();
        var color = value instanceof search_bar_common_1.Color ? value.android : value;
        textView.setHintTextColor(color);
    };
    SearchBar.prototype._getTextView = function () {
        var id = this.nativeView.getContext().getResources().getIdentifier("android:id/search_src_text", null, null);
        return this.nativeView.findViewById(id);
    };
    SearchBar.prototype._getSearchPlate = function () {
        var id = this.nativeView.getContext().getResources().getIdentifier("android:id/search_plate", null, null);
        return this.nativeView.findViewById(id);
    };
    return SearchBar;
}(search_bar_common_1.SearchBarBase));
exports.SearchBar = SearchBar;
//# sourceMappingURL=search-bar.js.map