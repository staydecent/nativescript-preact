Object.defineProperty(exports, "__esModule", { value: true });
var timers = {};
var anyGlobal = global;
var profileNames = [];
var ENABLED = false;
var nativeTimeFunc;
function enable() {
    ENABLED = true;
    if (!nativeTimeFunc) {
        if (anyGlobal.android) {
            var nanoTime_1 = java.lang.System.nanoTime;
            nativeTimeFunc = function () { return nanoTime_1() / 1000000; };
        }
        else {
            nativeTimeFunc = function () { return CACurrentMediaTime() * 1000; };
        }
    }
}
exports.enable = enable;
function disable() {
    ENABLED = false;
}
exports.disable = disable;
function time() {
    if (!ENABLED) {
        throw new Error("Profiling is not enabled");
    }
    return nativeTimeFunc();
}
exports.time = time;
function start(name) {
    if (!ENABLED) {
        return;
    }
    var info = timers[name];
    if (info) {
        if (info.isRunning) {
            throw new Error("Timer already running: " + name);
        }
        info.currentStart = time();
        info.isRunning = true;
    }
    else {
        info = {
            totalTime: 0,
            count: 0,
            currentStart: time(),
            isRunning: true
        };
        timers[name] = info;
    }
}
exports.start = start;
function pause(name) {
    if (!ENABLED) {
        return;
    }
    var info = pauseInternal(name);
    return info;
}
exports.pause = pause;
function stop(name) {
    if (!ENABLED) {
        return;
    }
    var info = pauseInternal(name);
    console.log("---- [" + name + "] STOP total: " + info.totalTime + " count:" + info.count);
    timers[name] = undefined;
    return info;
}
exports.stop = stop;
function isRunning(name) {
    var info = timers[name];
    return !!(info && info.isRunning);
}
exports.isRunning = isRunning;
function pauseInternal(name) {
    var info = timers[name];
    if (!info) {
        throw new Error("No timer started: " + name);
    }
    if (info.isRunning) {
        info.lastTime = time() - info.currentStart;
        info.totalTime += info.lastTime;
        info.count++;
        info.currentStart = 0;
        info.isRunning = false;
    }
    return info;
}
function profile(name) {
    return function (target, key, descriptor) {
        if (!ENABLED) {
            return;
        }
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        var originalMethod = descriptor.value;
        if (!name) {
            var className = "";
            if (target && target.constructor && target.constructor.name) {
                className = target.constructor.name + ".";
            }
            name = className + key;
        }
        profileNames.push(name);
        descriptor.value = function () {
            start(name);
            try {
                return originalMethod.apply(this, arguments);
            }
            finally {
                pause(name);
            }
        };
        return descriptor;
    };
}
exports.profile = profile;
function dumpProfiles() {
    profileNames.forEach(function (name) {
        var info = timers[name];
        if (info) {
            console.log("---- [" + name + "] STOP total: " + info.totalTime + " count:" + info.count);
        }
        else {
            console.log("---- [" + name + "] Never called");
        }
    });
}
exports.dumpProfiles = dumpProfiles;
function resetProfiles() {
    profileNames.forEach(function (name) {
        var info = timers[name];
        if (info) {
            if (!info.isRunning) {
                timers[name] = undefined;
            }
            else {
                console.log("---- timer with name [" + name + "] is currently running and won't be reset");
            }
        }
    });
}
exports.resetProfiles = resetProfiles;
function startCPUProfile(name) {
    if (!ENABLED) {
        return;
    }
    if (anyGlobal.android) {
        __startCPUProfiler(name);
    }
}
exports.startCPUProfile = startCPUProfile;
function stopCPUProfile(name) {
    if (!ENABLED) {
        return;
    }
    if (anyGlobal.android) {
        __stopCPUProfiler(name);
    }
}
exports.stopCPUProfile = stopCPUProfile;
//# sourceMappingURL=profiling.js.map