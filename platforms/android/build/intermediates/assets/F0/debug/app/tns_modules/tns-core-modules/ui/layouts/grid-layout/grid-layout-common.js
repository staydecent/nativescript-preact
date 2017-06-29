function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var layout_base_1 = require("../layout-base");
__export(require("../layout-base"));
function validateArgs(element) {
    if (!element) {
        throw new Error("element cannot be null or undefinied.");
    }
    return element;
}
layout_base_1.View.prototype.row = 0;
layout_base_1.View.prototype.col = 0;
layout_base_1.View.prototype.rowSpan = 1;
layout_base_1.View.prototype.colSpan = 1;
function validateItemSpec(itemSpec) {
    if (!itemSpec) {
        throw new Error("Value cannot be undefined.");
    }
    if (itemSpec.owner) {
        throw new Error("itemSpec is already added to GridLayout.");
    }
}
function convertGridLength(value) {
    if (value === GridUnitType.AUTO) {
        return ItemSpec.create(1, GridUnitType.AUTO);
    }
    else if (value.indexOf("*") !== -1) {
        var starCount = parseInt(value.replace("*", "") || "1");
        return ItemSpec.create(starCount, GridUnitType.STAR);
    }
    else if (!isNaN(parseInt(value))) {
        return ItemSpec.create(parseInt(value), GridUnitType.PIXEL);
    }
    else {
        throw new Error("Cannot parse item spec from string: " + value);
    }
}
function parseAndAddItemSpecs(value, func) {
    var arr = value.split(/[\s,]+/);
    for (var i = 0, length_1 = arr.length; i < length_1; i++) {
        var str = arr[i].trim();
        if (str.length > 0) {
            func(convertGridLength(arr[i].trim()));
        }
    }
}
var ItemSpec = (function (_super) {
    __extends(ItemSpec, _super);
    function ItemSpec() {
        var _this = _super.call(this) || this;
        _this._actualLength = 0;
        if (arguments.length === 0) {
            _this._value = 1;
            _this._unitType = GridUnitType.STAR;
        }
        else if (arguments.length === 2) {
            var value = arguments[0];
            var type = arguments[1];
            if (typeof value === "number" && typeof type === "string") {
                if (value < 0 || isNaN(value) || !isFinite(value)) {
                    throw new Error("Value should not be negative, NaN or Infinity: " + value);
                }
                _this._value = value;
                _this._unitType = GridUnitType.parse(type);
            }
            else {
                throw new Error("First argument should be number, second argument should be string.");
            }
        }
        else {
            throw new Error("ItemSpec expects 0 or 2 arguments");
        }
        _this.index = -1;
        return _this;
    }
    ItemSpec.create = function (value, type) {
        var spec = new ItemSpec();
        spec._value = value;
        spec._unitType = type;
        return spec;
    };
    Object.defineProperty(ItemSpec.prototype, "actualLength", {
        get: function () {
            return this._actualLength;
        },
        enumerable: true,
        configurable: true
    });
    ItemSpec.equals = function (value1, value2) {
        return (value1.gridUnitType === value2.gridUnitType) && (value1.value === value2.value) && (value1.owner === value2.owner) && (value1.index === value2.index);
    };
    Object.defineProperty(ItemSpec.prototype, "gridUnitType", {
        get: function () {
            return this._unitType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemSpec.prototype, "isAbsolute", {
        get: function () {
            return this._unitType === GridUnitType.PIXEL;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemSpec.prototype, "isAuto", {
        get: function () {
            return this._unitType === GridUnitType.AUTO;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemSpec.prototype, "isStar", {
        get: function () {
            return this._unitType === GridUnitType.STAR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemSpec.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return ItemSpec;
}(layout_base_1.Observable));
exports.ItemSpec = ItemSpec;
var GridLayoutBase = (function (_super) {
    __extends(GridLayoutBase, _super);
    function GridLayoutBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._rows = new Array();
        _this._cols = new Array();
        return _this;
    }
    GridLayoutBase.getColumn = function (element) {
        return validateArgs(element).col;
    };
    GridLayoutBase.setColumn = function (element, value) {
        validateArgs(element).col = value;
    };
    GridLayoutBase.getColumnSpan = function (element) {
        return validateArgs(element).colSpan;
    };
    GridLayoutBase.setColumnSpan = function (element, value) {
        validateArgs(element).colSpan = value;
    };
    GridLayoutBase.getRow = function (element) {
        return validateArgs(element).row;
    };
    GridLayoutBase.setRow = function (element, value) {
        validateArgs(element).row = value;
    };
    GridLayoutBase.getRowSpan = function (element) {
        return validateArgs(element).rowSpan;
    };
    GridLayoutBase.setRowSpan = function (element, value) {
        validateArgs(element).rowSpan = value;
    };
    GridLayoutBase.prototype.addRow = function (itemSpec) {
        validateItemSpec(itemSpec);
        itemSpec.owner = this;
        this._rows.push(itemSpec);
        this._onRowAdded(itemSpec);
        this.invalidate();
    };
    GridLayoutBase.prototype.addColumn = function (itemSpec) {
        validateItemSpec(itemSpec);
        itemSpec.owner = this;
        this._cols.push(itemSpec);
        this._onColumnAdded(itemSpec);
        this.invalidate();
    };
    GridLayoutBase.prototype.removeRow = function (itemSpec) {
        if (!itemSpec) {
            throw new Error("Value is null.");
        }
        var index = this._rows.indexOf(itemSpec);
        if (itemSpec.owner !== this || index < 0) {
            throw new Error("Row is not child of this GridLayout");
        }
        itemSpec.index = -1;
        this._rows.splice(index, 1);
        this._onRowRemoved(itemSpec, index);
        this.invalidate();
    };
    GridLayoutBase.prototype.removeColumn = function (itemSpec) {
        if (!itemSpec) {
            throw new Error("Value is null.");
        }
        var index = this._cols.indexOf(itemSpec);
        if (itemSpec.owner !== this || index < 0) {
            throw new Error("Column is not child of this GridLayout");
        }
        itemSpec.index = -1;
        this._cols.splice(index, 1);
        this._onColumnRemoved(itemSpec, index);
        this.invalidate();
    };
    GridLayoutBase.prototype.removeColumns = function () {
        for (var i = this._cols.length - 1; i >= 0; i--) {
            var colSpec = this._cols[i];
            this._onColumnRemoved(colSpec, i);
            colSpec.index = -1;
        }
        this._cols.length = 0;
        this.invalidate();
    };
    GridLayoutBase.prototype.removeRows = function () {
        for (var i = this._rows.length - 1; i >= 0; i--) {
            var rowSpec = this._rows[i];
            this._onRowRemoved(rowSpec, i);
            rowSpec.index = -1;
        }
        this._rows.length = 0;
        this.invalidate();
    };
    GridLayoutBase.prototype.onRowChanged = function (element, oldValue, newValue) {
        this.invalidate();
    };
    GridLayoutBase.prototype.onRowSpanChanged = function (element, oldValue, newValue) {
        this.invalidate();
    };
    GridLayoutBase.prototype.onColumnChanged = function (element, oldValue, newValue) {
        this.invalidate();
    };
    GridLayoutBase.prototype.onColumnSpanChanged = function (element, oldValue, newValue) {
        this.invalidate();
    };
    GridLayoutBase.prototype._onRowAdded = function (itemSpec) {
    };
    GridLayoutBase.prototype._onColumnAdded = function (itemSpec) {
    };
    GridLayoutBase.prototype._onRowRemoved = function (itemSpec, index) {
    };
    GridLayoutBase.prototype._onColumnRemoved = function (itemSpec, index) {
    };
    GridLayoutBase.prototype.getColumns = function () {
        return this._cols.slice();
    };
    GridLayoutBase.prototype.getRows = function () {
        return this._rows.slice();
    };
    Object.defineProperty(GridLayoutBase.prototype, "columnsInternal", {
        get: function () {
            return this._cols;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridLayoutBase.prototype, "rowsInternal", {
        get: function () {
            return this._rows;
        },
        enumerable: true,
        configurable: true
    });
    GridLayoutBase.prototype.invalidate = function () {
        this.requestLayout();
    };
    GridLayoutBase.prototype._applyXmlAttribute = function (attributeName, attributeValue) {
        if (attributeName === "columns") {
            this._setColumns(attributeValue);
            return true;
        }
        else if (attributeName === "rows") {
            this._setRows(attributeValue);
            return true;
        }
        return _super.prototype._applyXmlAttribute.call(this, attributeName, attributeValue);
    };
    GridLayoutBase.prototype._setColumns = function (value) {
        var _this = this;
        this.removeColumns();
        parseAndAddItemSpecs(value, function (spec) { return _this.addColumn(spec); });
    };
    GridLayoutBase.prototype._setRows = function (value) {
        var _this = this;
        this.removeRows();
        parseAndAddItemSpecs(value, function (spec) { return _this.addRow(spec); });
    };
    return GridLayoutBase;
}(layout_base_1.LayoutBase));
exports.GridLayoutBase = GridLayoutBase;
exports.columnProperty = new layout_base_1.Property({
    name: "col", defaultValue: 0,
    valueChanged: function (target, oldValue, newValue) {
        var grid = target.parent;
        if (grid instanceof GridLayoutBase) {
            grid.onColumnChanged(target, oldValue, newValue);
        }
    },
    valueConverter: function (v) { return Math.max(0, parseInt(v)); }
});
exports.columnProperty.register(layout_base_1.View);
exports.columnSpanProperty = new layout_base_1.Property({
    name: "colSpan", defaultValue: 1,
    valueChanged: function (target, oldValue, newValue) {
        var grid = target.parent;
        if (grid instanceof GridLayoutBase) {
            grid.onColumnSpanChanged(target, oldValue, newValue);
        }
    },
    valueConverter: function (v) { return Math.max(1, parseInt(v)); }
});
exports.columnSpanProperty.register(layout_base_1.View);
exports.rowProperty = new layout_base_1.Property({
    name: "row", defaultValue: 0,
    valueChanged: function (target, oldValue, newValue) {
        var grid = target.parent;
        if (grid instanceof GridLayoutBase) {
            grid.onRowChanged(target, oldValue, newValue);
        }
    },
    valueConverter: function (v) { return Math.max(0, parseInt(v)); }
});
exports.rowProperty.register(layout_base_1.View);
exports.rowSpanProperty = new layout_base_1.Property({
    name: "rowSpan", defaultValue: 1,
    valueChanged: function (target, oldValue, newValue) {
        var grid = target.parent;
        if (grid instanceof GridLayoutBase) {
            grid.onRowSpanChanged(target, oldValue, newValue);
        }
    },
    valueConverter: function (v) { return Math.max(1, parseInt(v)); }
});
exports.rowSpanProperty.register(layout_base_1.View);
var GridUnitType;
(function (GridUnitType) {
    GridUnitType.PIXEL = "pixel";
    GridUnitType.STAR = "star";
    GridUnitType.AUTO = "auto";
    GridUnitType.isValid = layout_base_1.makeValidator(GridUnitType.PIXEL, GridUnitType.STAR, GridUnitType.AUTO);
    GridUnitType.parse = layout_base_1.makeParser(GridUnitType.isValid);
})(GridUnitType = exports.GridUnitType || (exports.GridUnitType = {}));
//# sourceMappingURL=grid-layout-common.js.map