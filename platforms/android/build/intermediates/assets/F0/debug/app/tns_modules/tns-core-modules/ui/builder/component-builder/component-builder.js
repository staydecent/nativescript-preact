Object.defineProperty(exports, "__esModule", { value: true });
var bindable_1 = require("../../core/bindable");
var file_system_1 = require("../../../file-system");
var binding_builder_1 = require("../binding-builder");
var file_name_resolver_1 = require("../../../file-system/file-name-resolver");
var platform = require("../../../platform");
var UI_PATH = "ui/";
var MODULES = {
    "TabViewItem": "ui/tab-view",
    "FormattedString": "text/formatted-string",
    "Span": "text/span",
    "ActionItem": "ui/action-bar",
    "NavigationButton": "ui/action-bar",
    "SegmentedBarItem": "ui/segmented-bar",
};
var CODEFILE = "codeFile";
var CSSFILE = "cssFile";
var IMPORT = "import";
function getComponentModule(elementName, namespace, attributes, exports, moduleNamePath) {
    var instance;
    var instanceModule;
    var componentModule;
    elementName = elementName.split("-").map(function (s) { return s[0].toUpperCase() + s.substring(1); }).join("");
    var moduleId = MODULES[elementName] || UI_PATH +
        (elementName.toLowerCase().indexOf("layout") !== -1 ? "layouts/" : "") +
        elementName.split(/(?=[A-Z])/).join("-").toLowerCase();
    try {
        if (typeof namespace === "string") {
            if (global.moduleExists(namespace)) {
                moduleId = namespace;
            }
            else {
                var pathInsideTNSModules = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, "tns_modules", namespace);
                try {
                    instanceModule = global.require(pathInsideTNSModules);
                    moduleId = pathInsideTNSModules;
                }
                catch (e) {
                    moduleId = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, namespace);
                }
            }
        }
        if (!instanceModule) {
            instanceModule = global.loadModule(moduleId);
        }
        var instanceType = instanceModule[elementName] || Object;
        instance = new instanceType();
    }
    catch (ex) {
        var debug = require("utils/debug");
        throw new debug.ScopeError(ex, "Module '" + moduleId + "' not found for element '" + (namespace ? namespace + ":" : "") + elementName + "'.");
    }
    var cssApplied = false;
    if (attributes) {
        if (attributes[IMPORT]) {
            var importPath = attributes[IMPORT].trim();
            if (importPath.indexOf("~/") === 0) {
                importPath = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, importPath.replace("~/", ""));
            }
            exports = global.loadModule(importPath);
            instance.exports = exports;
        }
        if (attributes[CODEFILE]) {
            var codeFilePath = attributes[CODEFILE].trim();
            if (codeFilePath.indexOf("~/") === 0) {
                codeFilePath = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, codeFilePath.replace("~/", ""));
            }
            var codeFilePathWithExt = codeFilePath.indexOf(".js") !== -1 ? codeFilePath : codeFilePath + ".js";
            if (file_system_1.File.exists(codeFilePathWithExt)) {
                exports = global.loadModule(codeFilePath);
                instance.exports = exports;
            }
            else {
                throw new Error("Code file with path \"" + codeFilePathWithExt + "\" cannot be found!");
            }
        }
        if (attributes[CSSFILE] && typeof instance.addCssFile === "function") {
            var cssFilePath = attributes[CSSFILE].trim();
            if (cssFilePath.indexOf("~/") === 0) {
                cssFilePath = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, cssFilePath.replace("~/", ""));
            }
            if (file_system_1.File.exists(cssFilePath)) {
                instance.addCssFile(cssFilePath);
                cssApplied = true;
            }
            else {
                throw new Error("Css file with path \"" + cssFilePath + "\" cannot be found!");
            }
        }
    }
    if (typeof instance.addCssFile === "function") {
        if (moduleNamePath && !cssApplied) {
            var cssFilePath = file_name_resolver_1.resolveFileName(moduleNamePath, "css");
            if (cssFilePath) {
                instance.addCssFile(cssFilePath);
                cssApplied = true;
            }
        }
        if (!cssApplied) {
            instance._refreshCss();
        }
    }
    if (instance && instanceModule) {
        for (var attr in attributes) {
            var attrValue = attributes[attr];
            if (attr.indexOf(":") !== -1) {
                var platformName = attr.split(":")[0].trim();
                if (platformName.toLowerCase() === platform.device.os.toLowerCase()) {
                    attr = attr.split(":")[1].trim();
                }
                else {
                    continue;
                }
            }
            if (attr.indexOf(".") !== -1) {
                var subObj = instance;
                var properties = attr.split(".");
                var subPropName = properties[properties.length - 1];
                for (var i = 0; i < properties.length - 1; i++) {
                    if (subObj !== undefined && subObj !== null) {
                        subObj = subObj[properties[i]];
                    }
                }
                if (subObj !== undefined && subObj !== null) {
                    setPropertyValue(subObj, instanceModule, exports, subPropName, attrValue);
                }
            }
            else {
                setPropertyValue(instance, instanceModule, exports, attr, attrValue);
            }
        }
        componentModule = { component: instance, exports: instanceModule };
    }
    return componentModule;
}
exports.getComponentModule = getComponentModule;
function setPropertyValue(instance, instanceModule, exports, propertyName, propertyValue) {
    if (isBinding(propertyValue) && instance.bind) {
        var bindOptions = binding_builder_1.getBindingOptions(propertyName, getBindingExpressionFromAttribute(propertyValue));
        instance.bind({
            sourceProperty: bindOptions[binding_builder_1.bindingConstants.sourceProperty],
            targetProperty: bindOptions[binding_builder_1.bindingConstants.targetProperty],
            expression: bindOptions[binding_builder_1.bindingConstants.expression],
            twoWay: bindOptions[binding_builder_1.bindingConstants.twoWay]
        }, bindOptions[binding_builder_1.bindingConstants.source]);
    }
    else if (bindable_1.isEventOrGesture(propertyName, instance)) {
        var handler = exports && exports[propertyValue];
        if (typeof handler === "function") {
            instance.on(propertyName, handler);
        }
    }
    else if (isKnownFunction(propertyName, instance) && exports && typeof exports[propertyValue] === "function") {
        instance[propertyName] = exports[propertyValue];
    }
    else {
        var attrHandled = false;
        if (!attrHandled && instance._applyXmlAttribute) {
            attrHandled = instance._applyXmlAttribute(propertyName, propertyValue);
        }
        if (!attrHandled) {
            instance[propertyName] = propertyValue;
        }
    }
}
exports.setPropertyValue = setPropertyValue;
function getBindingExpressionFromAttribute(value) {
    return value.replace("{{", "").replace("}}", "").trim();
}
function isBinding(value) {
    var isBinding;
    if (typeof value === "string") {
        var str = value.trim();
        isBinding = str.indexOf("{{") === 0 && str.lastIndexOf("}}") === str.length - 2;
    }
    return isBinding;
}
var KNOWN_FUNCTIONS = "knownFunctions";
function isKnownFunction(name, instance) {
    return instance.constructor
        && KNOWN_FUNCTIONS in instance.constructor
        && instance.constructor[KNOWN_FUNCTIONS].indexOf(name) !== -1;
}
//# sourceMappingURL=component-builder.js.map