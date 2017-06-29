Object.defineProperty(exports, "__esModule", { value: true });
var timeoutHandler;
var timeoutCallbacks = {};
var timerId = 0;
function createHandlerAndGetId() {
    if (!timeoutHandler) {
        timeoutHandler = new android.os.Handler(android.os.Looper.myLooper());
    }
    timerId++;
    return timerId;
}
function setTimeout(callback, milliseconds) {
    if (milliseconds === void 0) { milliseconds = 0; }
    var id = createHandlerAndGetId();
    var zoneBound = zonedCallback(callback);
    var runnable = new java.lang.Runnable({
        run: function () {
            zoneBound();
            if (timeoutCallbacks[id]) {
                delete timeoutCallbacks[id];
            }
        }
    });
    if (!timeoutCallbacks[id]) {
        timeoutCallbacks[id] = runnable;
    }
    timeoutHandler.postDelayed(runnable, long(milliseconds));
    return id;
}
exports.setTimeout = setTimeout;
function clearTimeout(id) {
    var index = id;
    if (timeoutCallbacks[index]) {
        timeoutHandler.removeCallbacks(timeoutCallbacks[index]);
        delete timeoutCallbacks[index];
    }
}
exports.clearTimeout = clearTimeout;
function setInterval(callback, milliseconds) {
    if (milliseconds === void 0) { milliseconds = 0; }
    var id = createHandlerAndGetId();
    var handler = timeoutHandler;
    var zoneBound = zonedCallback(callback);
    var runnable = new java.lang.Runnable({
        run: function () {
            zoneBound();
            if (timeoutCallbacks[id]) {
                handler.postDelayed(runnable, long(milliseconds));
            }
        }
    });
    if (!timeoutCallbacks[id]) {
        timeoutCallbacks[id] = runnable;
    }
    timeoutHandler.postDelayed(runnable, long(milliseconds));
    return id;
}
exports.setInterval = setInterval;
exports.clearInterval = clearTimeout;
//# sourceMappingURL=timer.js.map