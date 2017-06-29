Object.defineProperty(exports, "__esModule", { value: true });
var types = require("./types");
exports.RESOURCE_PREFIX = "res://";
exports.FILE_PREFIX = "file:///";
function escapeRegexSymbols(source) {
    var escapeRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
    return source.replace(escapeRegex, "\\$&");
}
exports.escapeRegexSymbols = escapeRegexSymbols;
function convertString(value) {
    var result;
    if (!types.isString(value)) {
        result = value;
    }
    else if (value.trim() === "") {
        result = value;
    }
    else {
        var valueAsNumber = +value;
        if (!isNaN(valueAsNumber)) {
            result = valueAsNumber;
        }
        else if (value && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
            result = value.toLowerCase() === "true" ? true : false;
        }
        else {
            result = value;
        }
    }
    return result;
}
exports.convertString = convertString;
var layout;
(function (layout) {
    var MODE_SHIFT = 30;
    var MODE_MASK = 0x3 << MODE_SHIFT;
    layout.UNSPECIFIED = 0 << MODE_SHIFT;
    layout.EXACTLY = 1 << MODE_SHIFT;
    layout.AT_MOST = 2 << MODE_SHIFT;
    layout.MEASURED_HEIGHT_STATE_SHIFT = 0x00000010;
    layout.MEASURED_STATE_TOO_SMALL = 0x01000000;
    layout.MEASURED_STATE_MASK = 0xff000000;
    layout.MEASURED_SIZE_MASK = 0x00ffffff;
    function getMode(mode) {
        switch (mode) {
            case layout.EXACTLY:
                return "Exact";
            case layout.AT_MOST:
                return "AtMost";
            default:
                return "Unspecified";
        }
    }
    layout.getMode = getMode;
    function getMeasureSpecMode(spec) {
        return (spec & MODE_MASK);
    }
    layout.getMeasureSpecMode = getMeasureSpecMode;
    function getMeasureSpecSize(spec) {
        return (spec & ~MODE_MASK);
    }
    layout.getMeasureSpecSize = getMeasureSpecSize;
    function measureSpecToString(measureSpec) {
        var mode = getMeasureSpecMode(measureSpec);
        var size = getMeasureSpecSize(measureSpec);
        var text = "MeasureSpec: ";
        if (mode === layout.UNSPECIFIED) {
            text += "UNSPECIFIED ";
        }
        else if (mode === layout.EXACTLY) {
            text += "EXACTLY ";
        }
        else if (mode === layout.AT_MOST) {
            text += "AT_MOST ";
        }
        else {
            text += mode + " ";
        }
        text += size;
        return text;
    }
    layout.measureSpecToString = measureSpecToString;
    function round(value) {
        var res = Math.floor(value + 0.5);
        if (res !== 0) {
            return res;
        }
        else if (value === 0) {
            return 0;
        }
        else if (value > 0) {
            return 1;
        }
        return -1;
    }
    layout.round = round;
})(layout = exports.layout || (exports.layout = {}));
function isFileOrResourcePath(path) {
    if (!types.isString(path)) {
        return false;
    }
    return path.indexOf("~/") === 0 ||
        path.indexOf("/") === 0 ||
        path.indexOf(exports.RESOURCE_PREFIX) === 0;
}
exports.isFileOrResourcePath = isFileOrResourcePath;
function isDataURI(uri) {
    if (!types.isString(uri)) {
        return false;
    }
    var firstSegment = uri.trim().split(',')[0];
    return firstSegment && firstSegment.indexOf("data:") === 0 && firstSegment.indexOf('base64') >= 0;
}
exports.isDataURI = isDataURI;
function mergeSort(arr, compareFunc) {
    if (arr.length < 2) {
        return arr;
    }
    var middle = arr.length / 2;
    var left = arr.slice(0, middle);
    var right = arr.slice(middle, arr.length);
    return merge(mergeSort(left, compareFunc), mergeSort(right, compareFunc), compareFunc);
}
exports.mergeSort = mergeSort;
function merge(left, right, compareFunc) {
    var result = [];
    while (left.length && right.length) {
        if (compareFunc(left[0], right[0]) <= 0) {
            result.push(left.shift());
        }
        else {
            result.push(right.shift());
        }
    }
    while (left.length) {
        result.push(left.shift());
    }
    while (right.length) {
        result.push(right.shift());
    }
    return result;
}
exports.merge = merge;
//# sourceMappingURL=utils-common.js.map