Object.defineProperty(exports, "__esModule", { value: true });
function isUniversal(sel) {
    return sel.type === "*";
}
exports.isUniversal = isUniversal;
function isType(sel) {
    return sel.type === "";
}
exports.isType = isType;
function isClass(sel) {
    return sel.type === ".";
}
exports.isClass = isClass;
function isId(sel) {
    return sel.type === "#";
}
exports.isId = isId;
function isPseudo(sel) {
    return sel.type === ":";
}
exports.isPseudo = isPseudo;
function isAttribute(sel) {
    return sel.type === "[]";
}
exports.isAttribute = isAttribute;
var regex = /(\s*)(?:(\*)|(#|\.|:|\b)([_-\w][_-\w\d]*)|\[\s*([_-\w][_-\w\d]*)\s*(?:(=|\^=|\$=|\*=|\~=|\|=)\s*(?:([_-\w][_-\w\d]*)|"((?:[^\\"]|\\(?:"|n|r|f|\\|0-9a-f))*)"|'((?:[^\\']|\\(?:'|n|r|f|\\|0-9a-f))*)')\s*)?\])(?:\s*(\+|~|>|\s))?/g;
function parse(selector) {
    var selectors = [];
    var result;
    var lastIndex = regex.lastIndex = 0;
    while (result = regex.exec(selector)) {
        var pos = result.index;
        if (lastIndex !== pos) {
            throw new Error("Unexpected characters at index, near: " + lastIndex + ": " + result.input.substr(lastIndex, 32));
        }
        else if (!result[0] || result[0].length === 0) {
            throw new Error("Last selector match got zero character result at index " + lastIndex + ", near: " + result.input.substr(lastIndex, 32));
        }
        pos += getLeadingWhiteSpace(result).length;
        lastIndex = regex.lastIndex;
        var type = getType(result);
        var selector_1 = void 0;
        switch (type) {
            case "*":
                selector_1 = { pos: pos, type: type };
                break;
            case "#":
            case ".":
            case ":":
            case "":
                var ident = getIdentifier(result);
                selector_1 = { pos: pos, type: type, ident: ident };
                break;
            case "[]":
                var prop = getProperty(result);
                var test = getPropertyTest(result);
                var value = getPropertyValue(result);
                selector_1 = test ? { pos: pos, type: type, prop: prop, test: test, value: value } : { pos: pos, type: type, prop: prop };
                break;
            default:
                throw new Error("Unhandled type.");
        }
        var comb = getCombinator(result);
        if (comb) {
            selector_1.comb = comb;
        }
        selectors.push(selector_1);
    }
    if (selectors.length > 0) {
        delete selectors[selectors.length - 1].comb;
    }
    return selectors;
}
exports.parse = parse;
function getLeadingWhiteSpace(result) {
    return result[1] || "";
}
function getType(result) {
    return (result[5] && "[]") || result[2] || result[3];
}
function getIdentifier(result) {
    return result[4];
}
function getProperty(result) {
    return result[5];
}
function getPropertyTest(result) {
    return result[6] || undefined;
}
function getPropertyValue(result) {
    return result[7] || result[8] || result[9];
}
function getCombinator(result) {
    return result[result.length - 1] || undefined;
}
//# sourceMappingURL=css-selector-parser.js.map