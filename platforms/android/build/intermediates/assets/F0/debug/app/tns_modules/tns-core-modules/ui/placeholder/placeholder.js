Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
var Placeholder = (function (_super) {
    __extends(Placeholder, _super);
    function Placeholder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Placeholder.prototype.createNativeView = function () {
        var args = { eventName: Placeholder.creatingViewEvent, object: this, view: undefined, context: this._context };
        this.notify(args);
        return args.view;
    };
    return Placeholder;
}(view_1.View));
Placeholder.creatingViewEvent = "creatingView";
exports.Placeholder = Placeholder;
//# sourceMappingURL=placeholder.js.map