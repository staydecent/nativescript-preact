Object.defineProperty(exports, "__esModule", { value: true });
var application_1 = require("../application");
var connectionType;
(function (connectionType) {
    connectionType[connectionType["none"] = 0] = "none";
    connectionType[connectionType["wifi"] = 1] = "wifi";
    connectionType[connectionType["mobile"] = 2] = "mobile";
})(connectionType = exports.connectionType || (exports.connectionType = {}));
var wifi = "wifi";
var mobile = "mobile";
function getConnectivityManager() {
    return application_1.getNativeApplication().getApplicationContext().getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
}
function getActiveNetworkInfo() {
    var connectivityManager = getConnectivityManager();
    if (!connectivityManager) {
        return null;
    }
    return connectivityManager.getActiveNetworkInfo();
}
function getConnectionType() {
    var activeNetworkInfo = getActiveNetworkInfo();
    if (!activeNetworkInfo || !activeNetworkInfo.isConnected()) {
        return connectionType.none;
    }
    var type = activeNetworkInfo.getTypeName().toLowerCase();
    if (type.indexOf(wifi) !== -1) {
        return connectionType.wifi;
    }
    if (type.indexOf(mobile) !== -1) {
        return connectionType.mobile;
    }
    return connectionType.none;
}
exports.getConnectionType = getConnectionType;
function startMonitoring(connectionTypeChangedCallback) {
    var onReceiveCallback = function onReceiveCallback(context, intent) {
        var newConnectionType = getConnectionType();
        connectionTypeChangedCallback(newConnectionType);
    };
    application_1.android.registerBroadcastReceiver(android.net.ConnectivityManager.CONNECTIVITY_ACTION, onReceiveCallback);
}
exports.startMonitoring = startMonitoring;
function stopMonitoring() {
    application_1.android.unregisterBroadcastReceiver(android.net.ConnectivityManager.CONNECTIVITY_ACTION);
}
exports.stopMonitoring = stopMonitoring;
//# sourceMappingURL=connectivity.js.map