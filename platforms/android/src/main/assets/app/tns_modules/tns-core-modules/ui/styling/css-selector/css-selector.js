Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../../../utils/types");
var utils_1 = require("../../../utils/utils");
var selectorParser = require("../css-selector-parser");
var Match;
(function (Match) {
    Match.Dynamic = true;
    Match.Static = false;
})(Match || (Match = {}));
function getNodeDirectSibling(node) {
    if (!node.parent || !node.parent.getChildIndex || !node.parent.getChildAt) {
        return null;
    }
    var nodeIndex = node.parent.getChildIndex(node);
    if (nodeIndex === 0) {
        return null;
    }
    return node.parent.getChildAt(nodeIndex - 1);
}
function SelectorProperties(specificity, rarity, dynamic) {
    if (dynamic === void 0) { dynamic = false; }
    return function (cls) {
        cls.prototype.specificity = specificity;
        cls.prototype.rarity = rarity;
        cls.prototype.combinator = "";
        cls.prototype.dynamic = dynamic;
        return cls;
    };
}
var SelectorCore = (function () {
    function SelectorCore() {
    }
    SelectorCore.prototype.lookupSort = function (sorter, base) { sorter.sortAsUniversal(base || this); };
    return SelectorCore;
}());
SelectorCore = __decorate([
    SelectorProperties(0, 0, Match.Static)
], SelectorCore);
exports.SelectorCore = SelectorCore;
var SimpleSelector = (function (_super) {
    __extends(SimpleSelector, _super);
    function SimpleSelector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimpleSelector.prototype.accumulateChanges = function (node, map) {
        if (!this.dynamic) {
            return this.match(node);
        }
        else if (this.mayMatch(node)) {
            this.trackChanges(node, map);
            return true;
        }
        return false;
    };
    SimpleSelector.prototype.mayMatch = function (node) { return this.match(node); };
    SimpleSelector.prototype.trackChanges = function (node, map) {
    };
    return SimpleSelector;
}(SelectorCore));
exports.SimpleSelector = SimpleSelector;
function wrap(text) {
    return text ? " " + text + " " : "";
}
var InvalidSelector = (function (_super) {
    __extends(InvalidSelector, _super);
    function InvalidSelector(e) {
        var _this = _super.call(this) || this;
        _this.e = e;
        return _this;
    }
    InvalidSelector.prototype.toString = function () { return "<error: " + this.e + ">"; };
    InvalidSelector.prototype.match = function (node) { return false; };
    InvalidSelector.prototype.lookupSort = function (sorter, base) {
    };
    return InvalidSelector;
}(SimpleSelector));
InvalidSelector = __decorate([
    SelectorProperties(0, 4, Match.Static)
], InvalidSelector);
exports.InvalidSelector = InvalidSelector;
var UniversalSelector = (function (_super) {
    __extends(UniversalSelector, _super);
    function UniversalSelector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UniversalSelector.prototype.toString = function () { return "*" + wrap(this.combinator); };
    UniversalSelector.prototype.match = function (node) { return true; };
    return UniversalSelector;
}(SimpleSelector));
UniversalSelector = __decorate([
    SelectorProperties(0, 0, Match.Static)
], UniversalSelector);
exports.UniversalSelector = UniversalSelector;
var IdSelector = (function (_super) {
    __extends(IdSelector, _super);
    function IdSelector(id) {
        var _this = _super.call(this) || this;
        _this.id = id;
        return _this;
    }
    IdSelector.prototype.toString = function () { return "#" + this.id + wrap(this.combinator); };
    IdSelector.prototype.match = function (node) { return node.id === this.id; };
    IdSelector.prototype.lookupSort = function (sorter, base) { sorter.sortById(this.id, base || this); };
    return IdSelector;
}(SimpleSelector));
IdSelector = __decorate([
    SelectorProperties(65536, 3, Match.Static)
], IdSelector);
exports.IdSelector = IdSelector;
var TypeSelector = (function (_super) {
    __extends(TypeSelector, _super);
    function TypeSelector(cssType) {
        var _this = _super.call(this) || this;
        _this.cssType = cssType;
        return _this;
    }
    TypeSelector.prototype.toString = function () { return "" + this.cssType + wrap(this.combinator); };
    TypeSelector.prototype.match = function (node) { return node.cssType === this.cssType; };
    TypeSelector.prototype.lookupSort = function (sorter, base) { sorter.sortByType(this.cssType, base || this); };
    return TypeSelector;
}(SimpleSelector));
TypeSelector = __decorate([
    SelectorProperties(1, 1, Match.Static)
], TypeSelector);
exports.TypeSelector = TypeSelector;
var ClassSelector = (function (_super) {
    __extends(ClassSelector, _super);
    function ClassSelector(cssClass) {
        var _this = _super.call(this) || this;
        _this.cssClass = cssClass;
        return _this;
    }
    ClassSelector.prototype.toString = function () { return "." + this.cssClass + wrap(this.combinator); };
    ClassSelector.prototype.match = function (node) { return node.cssClasses && node.cssClasses.has(this.cssClass); };
    ClassSelector.prototype.lookupSort = function (sorter, base) { sorter.sortByClass(this.cssClass, base || this); };
    return ClassSelector;
}(SimpleSelector));
ClassSelector = __decorate([
    SelectorProperties(256, 2, Match.Static)
], ClassSelector);
exports.ClassSelector = ClassSelector;
var AttributeSelector = (function (_super) {
    __extends(AttributeSelector, _super);
    function AttributeSelector(attribute, test, value) {
        var _this = _super.call(this) || this;
        _this.attribute = attribute;
        _this.test = test;
        _this.value = value;
        if (!test) {
            _this.match = function (node) { return !types_1.isNullOrUndefined(node[attribute]); };
            return _this;
        }
        if (!value) {
            _this.match = function (node) { return false; };
        }
        var escapedValue = utils_1.escapeRegexSymbols(value);
        var regexp = null;
        switch (test) {
            case "^=":
                regexp = new RegExp("^" + escapedValue);
                break;
            case "$=":
                regexp = new RegExp(escapedValue + "$");
                break;
            case "*=":
                regexp = new RegExp(escapedValue);
                break;
            case "=":
                regexp = new RegExp("^" + escapedValue + "$");
                break;
            case "~=":
                if (/\s/.test(value)) {
                    _this.match = function (node) { return false; };
                    return _this;
                }
                regexp = new RegExp("(^|\\s)" + escapedValue + "(\\s|$)");
                break;
            case "|=":
                regexp = new RegExp("^" + escapedValue + "(-|$)");
                break;
        }
        if (regexp) {
            _this.match = function (node) { return regexp.test(node[attribute] + ""); };
            return _this;
        }
        else {
            _this.match = function (node) { return false; };
            return _this;
        }
    }
    AttributeSelector.prototype.toString = function () { return "[" + this.attribute + wrap(this.test) + ((this.test && this.value) || '') + "]" + wrap(this.combinator); };
    AttributeSelector.prototype.match = function (node) { return false; };
    AttributeSelector.prototype.mayMatch = function (node) { return true; };
    AttributeSelector.prototype.trackChanges = function (node, map) { map.addAttribute(node, this.attribute); };
    return AttributeSelector;
}(SimpleSelector));
AttributeSelector = __decorate([
    SelectorProperties(256, 0, Match.Dynamic)
], AttributeSelector);
exports.AttributeSelector = AttributeSelector;
var PseudoClassSelector = (function (_super) {
    __extends(PseudoClassSelector, _super);
    function PseudoClassSelector(cssPseudoClass) {
        var _this = _super.call(this) || this;
        _this.cssPseudoClass = cssPseudoClass;
        return _this;
    }
    PseudoClassSelector.prototype.toString = function () { return ":" + this.cssPseudoClass + wrap(this.combinator); };
    PseudoClassSelector.prototype.match = function (node) { return node.cssPseudoClasses && node.cssPseudoClasses.has(this.cssPseudoClass); };
    PseudoClassSelector.prototype.mayMatch = function (node) { return true; };
    PseudoClassSelector.prototype.trackChanges = function (node, map) { map.addPseudoClass(node, this.cssPseudoClass); };
    return PseudoClassSelector;
}(SimpleSelector));
PseudoClassSelector = __decorate([
    SelectorProperties(256, 0, Match.Dynamic)
], PseudoClassSelector);
exports.PseudoClassSelector = PseudoClassSelector;
var SimpleSelectorSequence = (function (_super) {
    __extends(SimpleSelectorSequence, _super);
    function SimpleSelectorSequence(selectors) {
        var _this = _super.call(this) || this;
        _this.selectors = selectors;
        _this.specificity = selectors.reduce(function (sum, sel) { return sel.specificity + sum; }, 0);
        _this.head = _this.selectors.reduce(function (prev, curr) { return !prev || (curr.rarity > prev.rarity) ? curr : prev; }, null);
        _this.dynamic = selectors.some(function (sel) { return sel.dynamic; });
        return _this;
    }
    SimpleSelectorSequence.prototype.toString = function () { return "" + this.selectors.join("") + wrap(this.combinator); };
    SimpleSelectorSequence.prototype.match = function (node) { return this.selectors.every(function (sel) { return sel.match(node); }); };
    SimpleSelectorSequence.prototype.mayMatch = function (node) {
        return this.selectors.every(function (sel) { return sel.mayMatch(node); });
    };
    SimpleSelectorSequence.prototype.trackChanges = function (node, map) {
        this.selectors.forEach(function (sel) { return sel.trackChanges(node, map); });
    };
    SimpleSelectorSequence.prototype.lookupSort = function (sorter, base) {
        this.head.lookupSort(sorter, base || this);
    };
    return SimpleSelectorSequence;
}(SimpleSelector));
exports.SimpleSelectorSequence = SimpleSelectorSequence;
var Selector = (function (_super) {
    __extends(Selector, _super);
    function Selector(selectors) {
        var _this = _super.call(this) || this;
        _this.selectors = selectors;
        var supportedCombinator = [undefined, " ", ">", "+"];
        var siblingGroup;
        var lastGroup;
        var groups = [];
        selectors.reverse().forEach(function (sel) {
            if (supportedCombinator.indexOf(sel.combinator) === -1) {
                throw new Error("Unsupported combinator \"" + sel.combinator + "\".");
            }
            if (sel.combinator === undefined || sel.combinator === " ") {
                groups.push(lastGroup = [siblingGroup = []]);
            }
            if (sel.combinator === ">") {
                lastGroup.push(siblingGroup = []);
            }
            siblingGroup.push(sel);
        });
        _this.groups = groups.map(function (g) {
            return new Selector.ChildGroup(g.map(function (sg) {
                return new Selector.SiblingGroup(sg);
            }));
        });
        _this.last = selectors[0];
        _this.specificity = selectors.reduce(function (sum, sel) { return sel.specificity + sum; }, 0);
        _this.dynamic = selectors.some(function (sel) { return sel.dynamic; });
        return _this;
    }
    Selector.prototype.toString = function () { return this.selectors.join(""); };
    Selector.prototype.match = function (node) {
        return this.groups.every(function (group, i) {
            if (i === 0) {
                node = group.match(node);
                return !!node;
            }
            else {
                var ancestor = node;
                while (ancestor = ancestor.parent) {
                    if (node = group.match(ancestor)) {
                        return true;
                    }
                }
                return false;
            }
        });
    };
    Selector.prototype.lookupSort = function (sorter, base) {
        this.last.lookupSort(sorter, this);
    };
    Selector.prototype.accumulateChanges = function (node, map) {
        if (!this.dynamic) {
            return this.match(node);
        }
        var bounds = [];
        var mayMatch = this.groups.every(function (group, i) {
            if (i === 0) {
                var nextNode = group.mayMatch(node);
                bounds.push({ left: node, right: node });
                node = nextNode;
                return !!node;
            }
            else {
                var ancestor = node;
                while (ancestor = ancestor.parent) {
                    var nextNode = group.mayMatch(ancestor);
                    if (nextNode) {
                        bounds.push({ left: ancestor, right: null });
                        node = nextNode;
                        return true;
                    }
                }
                return false;
            }
        });
        if (!mayMatch) {
            return false;
        }
        if (!map) {
            return mayMatch;
        }
        for (var i = 0; i < this.groups.length; i++) {
            var group_1 = this.groups[i];
            if (!group_1.dynamic) {
                continue;
            }
            var bound = bounds[i];
            var node_1 = bound.left;
            do {
                if (group_1.mayMatch(node_1)) {
                    group_1.trackChanges(node_1, map);
                }
            } while ((node_1 !== bound.right) && (node_1 = node_1.parent));
        }
        return mayMatch;
    };
    return Selector;
}(SelectorCore));
exports.Selector = Selector;
(function (Selector) {
    var ChildGroup = (function () {
        function ChildGroup(selectors) {
            this.selectors = selectors;
            this.dynamic = selectors.some(function (sel) { return sel.dynamic; });
        }
        ChildGroup.prototype.match = function (node) {
            return this.selectors.every(function (sel, i) { return (i === 0 ? node : node = node.parent) && !!sel.match(node); }) ? node : null;
        };
        ChildGroup.prototype.mayMatch = function (node) {
            return this.selectors.every(function (sel, i) { return (i === 0 ? node : node = node.parent) && !!sel.mayMatch(node); }) ? node : null;
        };
        ChildGroup.prototype.trackChanges = function (node, map) {
            this.selectors.forEach(function (sel, i) { return (i === 0 ? node : node = node.parent) && sel.trackChanges(node, map); });
        };
        return ChildGroup;
    }());
    Selector.ChildGroup = ChildGroup;
    var SiblingGroup = (function () {
        function SiblingGroup(selectors) {
            this.selectors = selectors;
            this.dynamic = selectors.some(function (sel) { return sel.dynamic; });
        }
        SiblingGroup.prototype.match = function (node) {
            return this.selectors.every(function (sel, i) { return (i === 0 ? node : node = getNodeDirectSibling(node)) && sel.match(node); }) ? node : null;
        };
        SiblingGroup.prototype.mayMatch = function (node) {
            return this.selectors.every(function (sel, i) { return (i === 0 ? node : node = getNodeDirectSibling(node)) && sel.mayMatch(node); }) ? node : null;
        };
        SiblingGroup.prototype.trackChanges = function (node, map) {
            this.selectors.forEach(function (sel, i) { return (i === 0 ? node : node = getNodeDirectSibling(node)) && sel.trackChanges(node, map); });
        };
        return SiblingGroup;
    }());
    Selector.SiblingGroup = SiblingGroup;
})(Selector = exports.Selector || (exports.Selector = {}));
exports.Selector = Selector;
var RuleSet = (function () {
    function RuleSet(selectors, declarations) {
        var _this = this;
        this.selectors = selectors;
        this.declarations = declarations;
        this.selectors.forEach(function (sel) { return sel.ruleset = _this; });
    }
    RuleSet.prototype.toString = function () { return this.selectors.join(", ") + " {" + this.declarations.map(function (d, i) { return "" + (i === 0 ? " " : "") + d.property + ": " + d.value; }).join("; ") + " }"; };
    RuleSet.prototype.lookupSort = function (sorter) { this.selectors.forEach(function (sel) { return sel.lookupSort(sorter); }); };
    return RuleSet;
}());
exports.RuleSet = RuleSet;
function fromAstNodes(astRules) {
    return astRules.filter(isRule).map(function (rule) {
        var declarations = rule.declarations.filter(isDeclaration).map(createDeclaration);
        var selectors = rule.selectors.map(createSelector);
        var ruleset = new RuleSet(selectors, declarations);
        return ruleset;
    });
}
exports.fromAstNodes = fromAstNodes;
function createDeclaration(decl) {
    return { property: decl.property.toLowerCase(), value: decl.value };
}
function createSelector(sel) {
    try {
        var ast = selectorParser.parse(sel);
        if (ast.length === 0) {
            return new InvalidSelector(new Error("Empty selector"));
        }
        var selectors = ast.map(createSimpleSelector);
        var sequences = [];
        for (var seqStart = 0, seqEnd = 0, last = selectors.length - 1; seqEnd <= last; seqEnd++) {
            var sel_1 = selectors[seqEnd];
            var astComb = ast[seqEnd].comb;
            if (astComb || seqEnd === last) {
                if (seqStart === seqEnd) {
                    sel_1.combinator = astComb;
                    sequences.push(sel_1);
                }
                else {
                    var sequence = new SimpleSelectorSequence(selectors.slice(seqStart, seqEnd + 1));
                    sequence.combinator = astComb;
                    sequences.push(sequence);
                }
                seqStart = seqEnd + 1;
            }
        }
        if (sequences.length === 1) {
            return sequences[0];
        }
        else {
            return new Selector(sequences);
        }
    }
    catch (e) {
        return new InvalidSelector(e);
    }
}
function createSimpleSelector(sel) {
    if (selectorParser.isUniversal(sel)) {
        return new UniversalSelector();
    }
    else if (selectorParser.isId(sel)) {
        return new IdSelector(sel.ident);
    }
    else if (selectorParser.isType(sel)) {
        return new TypeSelector(sel.ident.replace(/-/, '').toLowerCase());
    }
    else if (selectorParser.isClass(sel)) {
        return new ClassSelector(sel.ident);
    }
    else if (selectorParser.isPseudo(sel)) {
        return new PseudoClassSelector(sel.ident);
    }
    else if (selectorParser.isAttribute(sel)) {
        if (sel.test) {
            return new AttributeSelector(sel.prop, sel.test, sel.value);
        }
        else {
            return new AttributeSelector(sel.prop);
        }
    }
}
function isRule(node) {
    return node.type === "rule";
}
function isDeclaration(node) {
    return node.type === "declaration";
}
var SelectorsMap = (function () {
    function SelectorsMap(rulesets) {
        var _this = this;
        this.id = {};
        this.class = {};
        this.type = {};
        this.universal = [];
        this.position = 0;
        rulesets.forEach(function (rule) { return rule.lookupSort(_this); });
    }
    SelectorsMap.prototype.query = function (node) {
        var _this = this;
        var selectorClasses = [
            this.universal,
            this.id[node.id],
            this.type[node.cssType]
        ];
        if (node.cssClasses) {
            node.cssClasses.forEach(function (c) { return selectorClasses.push(_this.class[c]); });
        }
        var selectors = selectorClasses
            .filter(function (arr) { return !!arr; })
            .reduce(function (cur, next) { return cur.concat(next); }, []);
        var selectorsMatch = new SelectorsMatch();
        selectorsMatch.selectors = selectors
            .filter(function (sel) { return sel.sel.accumulateChanges(node, selectorsMatch); })
            .sort(function (a, b) { return a.sel.specificity - b.sel.specificity || a.pos - b.pos; })
            .map(function (docSel) { return docSel.sel; });
        return selectorsMatch;
    };
    SelectorsMap.prototype.sortById = function (id, sel) { this.addToMap(this.id, id, sel); };
    SelectorsMap.prototype.sortByClass = function (cssClass, sel) {
        this.addToMap(this.class, cssClass, sel);
    };
    SelectorsMap.prototype.sortByType = function (cssType, sel) {
        this.addToMap(this.type, cssType, sel);
    };
    SelectorsMap.prototype.sortAsUniversal = function (sel) { this.universal.push(this.makeDocSelector(sel)); };
    SelectorsMap.prototype.addToMap = function (map, head, sel) {
        this.position++;
        var list = map[head];
        if (list) {
            list.push(this.makeDocSelector(sel));
        }
        else {
            map[head] = [this.makeDocSelector(sel)];
        }
    };
    SelectorsMap.prototype.makeDocSelector = function (sel) {
        return { sel: sel, pos: this.position++ };
    };
    return SelectorsMap;
}());
exports.SelectorsMap = SelectorsMap;
var SelectorsMatch = (function () {
    function SelectorsMatch() {
        this.changeMap = new Map();
    }
    SelectorsMatch.prototype.addAttribute = function (node, attribute) {
        var deps = this.properties(node);
        if (!deps.attributes) {
            deps.attributes = new Set();
        }
        deps.attributes.add(attribute);
    };
    SelectorsMatch.prototype.addPseudoClass = function (node, pseudoClass) {
        var deps = this.properties(node);
        if (!deps.pseudoClasses) {
            deps.pseudoClasses = new Set();
        }
        deps.pseudoClasses.add(pseudoClass);
    };
    SelectorsMatch.prototype.properties = function (node) {
        var set = this.changeMap.get(node);
        if (!set) {
            this.changeMap.set(node, set = {});
        }
        return set;
    };
    return SelectorsMatch;
}());
exports.SelectorsMatch = SelectorsMatch;
//# sourceMappingURL=css-selector.js.map