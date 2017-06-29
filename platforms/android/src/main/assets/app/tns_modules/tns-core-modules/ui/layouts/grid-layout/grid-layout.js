function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var grid_layout_common_1 = require("./grid-layout-common");
__export(require("./grid-layout-common"));
function makeNativeSetter(setter) {
    return function (value) {
        var nativeView = this.nativeView;
        var lp = nativeView.getLayoutParams() || new org.nativescript.widgets.CommonLayoutParams();
        if (lp instanceof org.nativescript.widgets.CommonLayoutParams) {
            setter(lp, value);
            nativeView.setLayoutParams(lp);
        }
    };
}
grid_layout_common_1.View.prototype[grid_layout_common_1.rowProperty.setNative] = makeNativeSetter(function (lp, value) { return lp.row = value; });
grid_layout_common_1.View.prototype[grid_layout_common_1.columnProperty.setNative] = makeNativeSetter(function (lp, value) { return lp.column = value; });
grid_layout_common_1.View.prototype[grid_layout_common_1.rowSpanProperty.setNative] = makeNativeSetter(function (lp, value) { return lp.rowSpan = value; });
grid_layout_common_1.View.prototype[grid_layout_common_1.columnSpanProperty.setNative] = makeNativeSetter(function (lp, value) { return lp.columnSpan = value; });
function createNativeSpec(itemSpec) {
    switch (itemSpec.gridUnitType) {
        case grid_layout_common_1.GridUnitType.AUTO:
            return new org.nativescript.widgets.ItemSpec(itemSpec.value, org.nativescript.widgets.GridUnitType.auto);
        case grid_layout_common_1.GridUnitType.STAR:
            return new org.nativescript.widgets.ItemSpec(itemSpec.value, org.nativescript.widgets.GridUnitType.star);
        case grid_layout_common_1.GridUnitType.PIXEL:
            return new org.nativescript.widgets.ItemSpec(itemSpec.value * grid_layout_common_1.layout.getDisplayDensity(), org.nativescript.widgets.GridUnitType.pixel);
        default:
            throw new Error("Invalid gridUnitType: " + itemSpec.gridUnitType);
    }
}
var ItemSpec = (function (_super) {
    __extends(ItemSpec, _super);
    function ItemSpec() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ItemSpec.prototype, "actualLength", {
        get: function () {
            if (this.nativeSpec) {
                return Math.round(this.nativeSpec.getActualLength() / grid_layout_common_1.layout.getDisplayDensity());
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return ItemSpec;
}(grid_layout_common_1.ItemSpec));
exports.ItemSpec = ItemSpec;
var GridLayout = (function (_super) {
    __extends(GridLayout, _super);
    function GridLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridLayout.prototype.createNativeView = function () {
        return new org.nativescript.widgets.GridLayout(this._context);
    };
    GridLayout.prototype.initNativeView = function () {
        var _this = this;
        _super.prototype.initNativeView.call(this);
        this.rowsInternal.forEach(function (itemSpec, index, rows) { _this._onRowAdded(itemSpec); }, this);
        this.columnsInternal.forEach(function (itemSpec, index, rows) { _this._onColumnAdded(itemSpec); }, this);
    };
    GridLayout.prototype.disposeNativeView = function () {
        for (var i = this.rowsInternal.length; i--; i >= 0) {
            var itemSpec = this.rowsInternal[i];
            this._onRowRemoved(itemSpec, i);
        }
        for (var i = this.columnsInternal.length; i--; i >= 0) {
            var itemSpec = this.columnsInternal[i];
            this._onColumnRemoved(itemSpec, i);
        }
        _super.prototype.disposeNativeView.call(this);
    };
    GridLayout.prototype._onRowAdded = function (itemSpec) {
        if (this.nativeView) {
            var nativeSpec = createNativeSpec(itemSpec);
            itemSpec.nativeSpec = nativeSpec;
            this.nativeView.addRow(nativeSpec);
        }
    };
    GridLayout.prototype._onColumnAdded = function (itemSpec) {
        if (this.nativeView) {
            var nativeSpec = createNativeSpec(itemSpec);
            itemSpec.nativeSpec = nativeSpec;
            this.nativeView.addColumn(nativeSpec);
        }
    };
    GridLayout.prototype._onRowRemoved = function (itemSpec, index) {
        itemSpec.nativeSpec = null;
        if (this.nativeView) {
            this.nativeView.removeRowAt(index);
        }
    };
    GridLayout.prototype._onColumnRemoved = function (itemSpec, index) {
        itemSpec.nativeSpec = null;
        if (this.nativeView) {
            this.nativeView.removeColumnAt(index);
        }
    };
    GridLayout.prototype.invalidate = function () {
    };
    return GridLayout;
}(grid_layout_common_1.GridLayoutBase));
exports.GridLayout = GridLayout;
//# sourceMappingURL=grid-layout.js.map