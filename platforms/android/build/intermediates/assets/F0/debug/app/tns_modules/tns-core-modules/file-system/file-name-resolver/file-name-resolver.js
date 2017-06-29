Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = require("../../platform");
var file_system_1 = require("../file-system");
var trace = require("../../trace");
var appModule = require("../../application");
var MIN_WH = "minWH";
var MIN_W = "minW";
var MIN_H = "minH";
var PRIORITY_STEP = 10000;
var minWidthHeightQualifier = {
    isMatch: function (value) {
        return value.indexOf(MIN_WH) === 0;
    },
    getMatchValue: function (value, context) {
        var numVal = parseInt(value.substr(MIN_WH.length));
        if (isNaN(numVal)) {
            return -1;
        }
        var actualLength = Math.min(context.width, context.height);
        if (actualLength < numVal) {
            return -1;
        }
        return PRIORITY_STEP - (actualLength - numVal);
    }
};
var minWidthQualifier = {
    isMatch: function (value) {
        return value.indexOf(MIN_W) === 0 && value.indexOf(MIN_WH) < 0;
    },
    getMatchValue: function (value, context) {
        var numVal = parseInt(value.substr(MIN_W.length));
        if (isNaN(numVal)) {
            return -1;
        }
        var actualWidth = context.width;
        if (actualWidth < numVal) {
            return -1;
        }
        return PRIORITY_STEP - (actualWidth - numVal);
    }
};
var minHeightQualifier = {
    isMatch: function (value) {
        return value.indexOf(MIN_H) === 0 && value.indexOf(MIN_WH) < 0;
    },
    getMatchValue: function (value, context) {
        var numVal = parseInt(value.substr(MIN_H.length));
        if (isNaN(numVal)) {
            return -1;
        }
        var actualHeight = context.height;
        if (actualHeight < numVal) {
            return -1;
        }
        return PRIORITY_STEP - (actualHeight - numVal);
    }
};
var platformQualifier = {
    isMatch: function (value) {
        return value === "android" ||
            value === "ios";
    },
    getMatchValue: function (value, context) {
        return value === context.os.toLowerCase() ? 1 : -1;
    }
};
var orientationQualifier = {
    isMatch: function (value) {
        return value === "land" ||
            value === "port";
    },
    getMatchValue: function (value, context) {
        var isLandscape = (context.width > context.height) ? 1 : -1;
        return (value === "land") ? isLandscape : -isLandscape;
    }
};
var supportedQualifiers = [
    minWidthHeightQualifier,
    minWidthQualifier,
    minHeightQualifier,
    orientationQualifier,
    platformQualifier
];
var FileNameResolver = (function () {
    function FileNameResolver(context) {
        this._cache = {};
        this._context = context;
    }
    FileNameResolver.prototype.resolveFileName = function (path, ext) {
        var key = path + ext;
        var result = this._cache[key];
        if (result === undefined) {
            result = this.resolveFileNameImpl(path, ext);
            this._cache[key] = result;
        }
        return result;
    };
    FileNameResolver.prototype.clearCache = function () {
        this._cache = {};
    };
    FileNameResolver.prototype.resolveFileNameImpl = function (path, ext) {
        var result = null;
        path = file_system_1.path.normalize(path);
        ext = "." + ext;
        var candidates = this.getFileCandidatesFromFolder(path, ext);
        result = _findFileMatch(path, ext, candidates, this._context);
        return result;
    };
    FileNameResolver.prototype.getFileCandidatesFromFolder = function (path, ext) {
        var candidates = new Array();
        var folderPath = path.substring(0, path.lastIndexOf(file_system_1.path.separator) + 1);
        if (file_system_1.Folder.exists(folderPath)) {
            var folder = file_system_1.Folder.fromPath(folderPath);
            folder.eachEntity(function (e) {
                if (e instanceof file_system_1.File) {
                    var file = e;
                    if (file.path.indexOf(path) === 0 && file.extension === ext) {
                        candidates.push(file.path);
                    }
                }
                return true;
            });
        }
        else {
            if (trace.isEnabled()) {
                trace.write("Could not find folder " + folderPath + " when loading " + path + ext, trace.categories.Navigation);
            }
        }
        return candidates;
    };
    return FileNameResolver;
}());
exports.FileNameResolver = FileNameResolver;
function _findFileMatch(path, ext, candidates, context) {
    var bestValue = -1;
    var result = null;
    for (var i = 0; i < candidates.length; i++) {
        var filePath = candidates[i];
        var qualifiersStr = filePath.substr(path.length, filePath.length - path.length - ext.length);
        var qualifiers = qualifiersStr.split(".");
        var value = checkQualifiers(qualifiers, context);
        if (value >= 0 && value > bestValue) {
            bestValue = value;
            result = candidates[i];
        }
    }
    return result;
}
exports._findFileMatch = _findFileMatch;
function checkQualifiers(qualifiers, context) {
    var result = 0;
    for (var i = 0; i < qualifiers.length; i++) {
        if (qualifiers[i]) {
            var value = checkQualifier(qualifiers[i], context);
            if (value < 0) {
                return -1;
            }
            result += value;
        }
    }
    return result;
}
function checkQualifier(value, context) {
    for (var i = 0; i < supportedQualifiers.length; i++) {
        if (supportedQualifiers[i].isMatch(value)) {
            var result = supportedQualifiers[i].getMatchValue(value, context);
            if (result > 0) {
                result += (supportedQualifiers.length - i) * PRIORITY_STEP;
            }
            return result;
        }
    }
    return -1;
}
var resolverInstance;
function resolveFileName(path, ext) {
    if (!resolverInstance) {
        resolverInstance = new FileNameResolver({
            width: platform_1.screen.mainScreen.widthDIPs,
            height: platform_1.screen.mainScreen.heightDIPs,
            os: platform_1.device.os,
            deviceType: platform_1.device.deviceType
        });
    }
    return resolverInstance.resolveFileName(path, ext);
}
exports.resolveFileName = resolveFileName;
appModule.on("cssChanged", function (args) { return resolverInstance = undefined; });
appModule.on("livesync", function (args) { return resolverInstance && resolverInstance.clearCache(); });
//# sourceMappingURL=file-name-resolver.js.map