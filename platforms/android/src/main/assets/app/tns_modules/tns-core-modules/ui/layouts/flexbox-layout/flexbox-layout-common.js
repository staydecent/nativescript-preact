function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var layout_base_1 = require("../layout-base");
__export(require("../layout-base"));
exports.ORDER_DEFAULT = 1;
exports.FLEX_GROW_DEFAULT = 0.0;
exports.FLEX_SHRINK_DEFAULT = 1.0;
var FlexDirection;
(function (FlexDirection) {
    FlexDirection.ROW = "row";
    FlexDirection.ROW_REVERSE = "row-reverse";
    FlexDirection.COLUMN = "column";
    FlexDirection.COLUMN_REVERSE = "column-reverse";
    FlexDirection.isValid = layout_base_1.makeValidator(FlexDirection.ROW, FlexDirection.ROW_REVERSE, FlexDirection.COLUMN, FlexDirection.COLUMN_REVERSE);
    FlexDirection.parse = layout_base_1.makeParser(FlexDirection.isValid);
})(FlexDirection = exports.FlexDirection || (exports.FlexDirection = {}));
var FlexWrap;
(function (FlexWrap) {
    FlexWrap.NOWRAP = "nowrap";
    FlexWrap.WRAP = "wrap";
    FlexWrap.WRAP_REVERSE = "wrap-reverse";
    FlexWrap.isValid = layout_base_1.makeValidator(FlexWrap.NOWRAP, FlexWrap.WRAP, FlexWrap.WRAP_REVERSE);
    FlexWrap.parse = layout_base_1.makeParser(FlexWrap.isValid);
})(FlexWrap = exports.FlexWrap || (exports.FlexWrap = {}));
var JustifyContent;
(function (JustifyContent) {
    JustifyContent.FLEX_START = "flex-start";
    JustifyContent.FLEX_END = "flex-end";
    JustifyContent.CENTER = "center";
    JustifyContent.SPACE_BETWEEN = "space-between";
    JustifyContent.SPACE_AROUND = "space-around";
    JustifyContent.isValid = layout_base_1.makeValidator(JustifyContent.FLEX_START, JustifyContent.FLEX_END, JustifyContent.CENTER, JustifyContent.SPACE_BETWEEN, JustifyContent.SPACE_AROUND);
    JustifyContent.parse = layout_base_1.makeParser(JustifyContent.isValid);
})(JustifyContent = exports.JustifyContent || (exports.JustifyContent = {}));
var FlexBasisPercent;
(function (FlexBasisPercent) {
    FlexBasisPercent.DEFAULT = -1;
})(FlexBasisPercent = exports.FlexBasisPercent || (exports.FlexBasisPercent = {}));
var AlignItems;
(function (AlignItems) {
    AlignItems.FLEX_START = "flex-start";
    AlignItems.FLEX_END = "flex-end";
    AlignItems.CENTER = "center";
    AlignItems.BASELINE = "baseline";
    AlignItems.STRETCH = "stretch";
    AlignItems.isValid = layout_base_1.makeValidator(AlignItems.FLEX_START, AlignItems.FLEX_END, AlignItems.CENTER, AlignItems.BASELINE, AlignItems.STRETCH);
    AlignItems.parse = layout_base_1.makeParser(AlignItems.isValid);
})(AlignItems = exports.AlignItems || (exports.AlignItems = {}));
var AlignContent;
(function (AlignContent) {
    AlignContent.FLEX_START = "flex-start";
    AlignContent.FLEX_END = "flex-end";
    AlignContent.CENTER = "center";
    AlignContent.SPACE_BETWEEN = "space-between";
    AlignContent.SPACE_AROUND = "space-around";
    AlignContent.STRETCH = "stretch";
    AlignContent.isValid = layout_base_1.makeValidator(AlignContent.FLEX_START, AlignContent.FLEX_END, AlignContent.CENTER, AlignContent.SPACE_BETWEEN, AlignContent.SPACE_AROUND, AlignContent.STRETCH);
    AlignContent.parse = layout_base_1.makeParser(AlignContent.isValid);
})(AlignContent = exports.AlignContent || (exports.AlignContent = {}));
var Order;
(function (Order) {
    function isValid(value) {
        return isFinite(parseInt(value));
    }
    Order.isValid = isValid;
    Order.parse = parseInt;
})(Order = exports.Order || (exports.Order = {}));
var FlexGrow;
(function (FlexGrow) {
    function isValid(value) {
        var parsed = parseInt(value);
        return isFinite(parsed) && value >= 0;
    }
    FlexGrow.isValid = isValid;
    FlexGrow.parse = parseFloat;
})(FlexGrow = exports.FlexGrow || (exports.FlexGrow = {}));
var FlexShrink;
(function (FlexShrink) {
    function isValid(value) {
        var parsed = parseInt(value);
        return isFinite(parsed) && value >= 0;
    }
    FlexShrink.isValid = isValid;
    FlexShrink.parse = parseFloat;
})(FlexShrink = exports.FlexShrink || (exports.FlexShrink = {}));
var FlexWrapBefore;
(function (FlexWrapBefore) {
    function isValid(value) {
        if (typeof value === "boolean") {
            return true;
        }
        if (typeof value === "string") {
            var str = value.trim().toLowerCase();
            return str === "true" || str === "false";
        }
        return false;
    }
    FlexWrapBefore.isValid = isValid;
    function parse(value) {
        return value && value.toString().trim().toLowerCase() === "true";
    }
    FlexWrapBefore.parse = parse;
})(FlexWrapBefore = exports.FlexWrapBefore || (exports.FlexWrapBefore = {}));
var AlignSelf;
(function (AlignSelf) {
    AlignSelf.AUTO = "auto";
    AlignSelf.FLEX_START = "flex-start";
    AlignSelf.FLEX_END = "flex-end";
    AlignSelf.CENTER = "center";
    AlignSelf.BASELINE = "baseline";
    AlignSelf.STRETCH = "stretch";
    AlignSelf.isValid = layout_base_1.makeValidator(AlignSelf.AUTO, AlignSelf.FLEX_START, AlignSelf.FLEX_END, AlignSelf.CENTER, AlignSelf.BASELINE, AlignSelf.STRETCH);
    AlignSelf.parse = layout_base_1.makeParser(AlignSelf.isValid);
})(AlignSelf = exports.AlignSelf || (exports.AlignSelf = {}));
function validateArgs(element) {
    if (!element) {
        throw new Error("element cannot be null or undefinied.");
    }
    return element;
}
var FlexboxLayoutBase = (function (_super) {
    __extends(FlexboxLayoutBase, _super);
    function FlexboxLayoutBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FlexboxLayoutBase.prototype, "flexDirection", {
        get: function () {
            return this.style.flexDirection;
        },
        set: function (value) {
            this.style.flexDirection = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayoutBase.prototype, "flexWrap", {
        get: function () {
            return this.style.flexWrap;
        },
        set: function (value) {
            this.style.flexWrap = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayoutBase.prototype, "justifyContent", {
        get: function () {
            return this.style.justifyContent;
        },
        set: function (value) {
            this.style.justifyContent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayoutBase.prototype, "alignItems", {
        get: function () {
            return this.style.alignItems;
        },
        set: function (value) {
            this.style.alignItems = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayoutBase.prototype, "alignContent", {
        get: function () {
            return this.style.alignContent;
        },
        set: function (value) {
            this.style.alignContent = value;
        },
        enumerable: true,
        configurable: true
    });
    FlexboxLayoutBase.setOrder = function (view, order) {
        validateArgs(view).style.order = order;
    };
    FlexboxLayoutBase.getOrder = function (view) {
        return validateArgs(view).style.order;
    };
    FlexboxLayoutBase.setFlexGrow = function (view, grow) {
        validateArgs(view).style.flexGrow = grow;
    };
    FlexboxLayoutBase.getFlexGrow = function (view) {
        return validateArgs(view).style.flexGrow;
    };
    FlexboxLayoutBase.setFlexShrink = function (view, shrink) {
        validateArgs(view).style.flexShrink = shrink;
    };
    FlexboxLayoutBase.getFlexShrink = function (view) {
        return validateArgs(view).style.flexShrink;
    };
    FlexboxLayoutBase.setAlignSelf = function (view, align) {
        validateArgs(view).style.alignSelf = align;
    };
    FlexboxLayoutBase.getAlignSelf = function (view) {
        return validateArgs(view).style.alignSelf;
    };
    FlexboxLayoutBase.setFlexWrapBefore = function (view, wrap) {
        validateArgs(view).style.flexWrapBefore = wrap;
    };
    FlexboxLayoutBase.getFlexWrapBefore = function (view) {
        return validateArgs(view).style.flexWrapBefore;
    };
    return FlexboxLayoutBase;
}(layout_base_1.LayoutBase));
exports.FlexboxLayoutBase = FlexboxLayoutBase;
exports.flexDirectionProperty = new layout_base_1.CssProperty({ name: "flexDirection", cssName: "flex-direction", defaultValue: FlexDirection.ROW, affectsLayout: layout_base_1.isIOS, valueConverter: FlexDirection.parse });
exports.flexDirectionProperty.register(layout_base_1.Style);
exports.flexWrapProperty = new layout_base_1.CssProperty({ name: "flexWrap", cssName: "flex-wrap", defaultValue: "nowrap", affectsLayout: layout_base_1.isIOS, valueConverter: FlexWrap.parse });
exports.flexWrapProperty.register(layout_base_1.Style);
exports.justifyContentProperty = new layout_base_1.CssProperty({ name: "justifyContent", cssName: "justify-content", defaultValue: JustifyContent.FLEX_START, affectsLayout: layout_base_1.isIOS, valueConverter: JustifyContent.parse });
exports.justifyContentProperty.register(layout_base_1.Style);
exports.alignItemsProperty = new layout_base_1.CssProperty({ name: "alignItems", cssName: "align-items", defaultValue: AlignItems.STRETCH, affectsLayout: layout_base_1.isIOS, valueConverter: AlignItems.parse });
exports.alignItemsProperty.register(layout_base_1.Style);
exports.alignContentProperty = new layout_base_1.CssProperty({ name: "alignContent", cssName: "align-content", defaultValue: AlignContent.STRETCH, affectsLayout: layout_base_1.isIOS, valueConverter: AlignContent.parse });
exports.alignContentProperty.register(layout_base_1.Style);
exports.orderProperty = new layout_base_1.CssProperty({ name: "order", cssName: "order", defaultValue: exports.ORDER_DEFAULT, valueConverter: Order.parse });
exports.orderProperty.register(layout_base_1.Style);
Object.defineProperty(layout_base_1.View.prototype, "order", {
    get: function () {
        return this.style.order;
    },
    set: function (value) {
        this.style.order = value;
    },
    enumerable: true,
    configurable: true
});
exports.flexGrowProperty = new layout_base_1.CssProperty({ name: "flexGrow", cssName: "flex-grow", defaultValue: exports.FLEX_GROW_DEFAULT, valueConverter: FlexGrow.parse });
exports.flexGrowProperty.register(layout_base_1.Style);
Object.defineProperty(layout_base_1.View.prototype, "flexGrow", {
    get: function () {
        return this.style.flexGrow;
    },
    set: function (value) {
        this.style.flexGrow = value;
    },
    enumerable: true,
    configurable: true
});
exports.flexShrinkProperty = new layout_base_1.CssProperty({ name: "flexShrink", cssName: "flex-shrink", defaultValue: exports.FLEX_SHRINK_DEFAULT, valueConverter: FlexShrink.parse });
exports.flexShrinkProperty.register(layout_base_1.Style);
Object.defineProperty(layout_base_1.View.prototype, "flexShrink", {
    get: function () {
        return this.style.flexShrink;
    },
    set: function (value) {
        this.style.flexShrink = value;
    },
    enumerable: true,
    configurable: true
});
exports.flexWrapBeforeProperty = new layout_base_1.CssProperty({ name: "flexWrapBefore", cssName: "flex-wrap-before", defaultValue: false, valueConverter: FlexWrapBefore.parse });
exports.flexWrapBeforeProperty.register(layout_base_1.Style);
Object.defineProperty(layout_base_1.View.prototype, "flexWrapBefore", {
    get: function () {
        return this.style.flexWrapBefore;
    },
    set: function (value) {
        this.style.flexWrapBefore = value;
    },
    enumerable: true,
    configurable: true
});
exports.alignSelfProperty = new layout_base_1.CssProperty({ name: "alignSelf", cssName: "align-self", defaultValue: AlignSelf.AUTO, valueConverter: AlignSelf.parse });
exports.alignSelfProperty.register(layout_base_1.Style);
Object.defineProperty(layout_base_1.View.prototype, "alignSelf", {
    get: function () {
        return this.style.alignSelf;
    },
    set: function (value) {
        this.style.alignSelf = value;
    },
    enumerable: true,
    configurable: true
});
var flexFlowProperty = new layout_base_1.ShorthandProperty({
    name: "flex-flow", cssName: "flex-flow",
    getter: function () {
        return this.flexDirection + " " + this.flexWrap;
    },
    converter: function (value) {
        var properties = [];
        if (value === layout_base_1.unsetValue) {
            properties.push([exports.flexDirectionProperty, value]);
            properties.push([exports.flexWrapProperty, value]);
        }
        else {
            var trimmed = value && value.trim();
            if (trimmed) {
                var values = trimmed.split(/\s+/);
                if (values.length >= 1 && FlexDirection.isValid(values[0])) {
                    properties.push([exports.flexDirectionProperty, FlexDirection.parse(values[0])]);
                }
                if (value.length >= 2 && FlexWrap.isValid(values[1])) {
                    properties.push([exports.flexWrapProperty, FlexWrap.parse(values[1])]);
                }
            }
        }
        return properties;
    }
});
flexFlowProperty.register(layout_base_1.Style);
var flexProperty = new layout_base_1.ShorthandProperty({
    name: "flex", cssName: "flex",
    getter: function () {
        return this.flexGrow + " " + this.flexShrink;
    },
    converter: function (value) {
        var properties = [];
        if (value === layout_base_1.unsetValue) {
            properties.push([exports.flexGrowProperty, value]);
            properties.push([exports.flexShrinkProperty, value]);
        }
        else {
            var trimmed = value && value.trim();
            if (trimmed) {
                var values = trimmed.split(/\s+/);
                if (values.length === 1) {
                    switch (values[0]) {
                        case "inital":
                            properties.push([exports.flexGrowProperty, 0]);
                            properties.push([exports.flexShrinkProperty, 1]);
                            break;
                        case "auto":
                            properties.push([exports.flexGrowProperty, 1]);
                            properties.push([exports.flexShrinkProperty, 1]);
                            break;
                        case "none":
                            properties.push([exports.flexGrowProperty, 0]);
                            properties.push([exports.flexShrinkProperty, 0]);
                            break;
                        default:
                            if (FlexGrow.isValid(values[0])) {
                                properties.push([exports.flexGrowProperty, FlexGrow.parse(values[0])]);
                                properties.push([exports.flexShrinkProperty, 1]);
                            }
                    }
                }
                if (values.length >= 2) {
                    if (FlexGrow.isValid(values[0]) && FlexShrink.isValid(values[1])) {
                        properties.push([exports.flexGrowProperty, FlexGrow.parse(values[0])]);
                        properties.push([exports.flexShrinkProperty, FlexShrink.parse(values[1])]);
                    }
                }
            }
        }
        return properties;
    }
});
flexProperty.register(layout_base_1.Style);
//# sourceMappingURL=flexbox-layout-common.js.map