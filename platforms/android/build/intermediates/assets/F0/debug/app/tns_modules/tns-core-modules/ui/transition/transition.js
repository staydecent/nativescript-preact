Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../../utils/types");
var platform_1 = require("../../platform");
var animation_1 = require("../animation");
var lazy_1 = require("../../utils/lazy");
var trace_1 = require("../../trace");
var slideTransition;
function ensureSlideTransition() {
    if (!slideTransition) {
        slideTransition = require("ui/transition/slide-transition");
    }
}
var fadeTransition;
function ensureFadeTransition() {
    if (!fadeTransition) {
        fadeTransition = require("ui/transition/fade-transition");
    }
}
var flipTransition;
function ensureFlipTransition() {
    if (!flipTransition) {
        flipTransition = require("ui/transition/flip-transition");
    }
}
var _sdkVersion = lazy_1.default(function () { return parseInt(platform_1.device.sdkVersion); });
var _defaultInterpolator = lazy_1.default(function () { return new android.view.animation.AccelerateDecelerateInterpolator(); });
var enterFakeResourceId = -10;
var exitFakeResourceId = -20;
var popEnterFakeResourceId = -30;
var popExitFakeResourceId = -40;
var AndroidTransitionType;
(function (AndroidTransitionType) {
    AndroidTransitionType.enter = "enter";
    AndroidTransitionType.exit = "exit";
    AndroidTransitionType.popEnter = "popEnter";
    AndroidTransitionType.popExit = "popExit";
})(AndroidTransitionType = exports.AndroidTransitionType || (exports.AndroidTransitionType = {}));
function _clearBackwardTransitions(fragment) {
    var expandedFragment = fragment;
    if (expandedFragment.enterPopExitTransition) {
        if (trace_1.isEnabled()) {
            trace_1.write("Cleared enterPopExitTransition " + expandedFragment.enterPopExitTransition + " for " + fragment, trace_1.categories.Transition);
        }
        if (expandedFragment.enterPopExitTransitionListener) {
            expandedFragment.enterPopExitTransitionListener.remove();
        }
        expandedFragment.enterPopExitTransition = undefined;
    }
    if (_sdkVersion() >= 21) {
        var enterTransition = fragment.getEnterTransition();
        if (enterTransition) {
            if (trace_1.isEnabled()) {
                trace_1.write("Cleared Enter " + enterTransition.getClass().getSimpleName() + " transition for " + fragment, trace_1.categories.Transition);
            }
            if (enterTransition.transitionListener) {
                enterTransition.transitionListener.remove();
            }
            fragment.setEnterTransition(null);
        }
        var returnTransition = fragment.getReturnTransition();
        if (returnTransition) {
            if (trace_1.isEnabled()) {
                trace_1.write("Cleared Pop Exit " + returnTransition.getClass().getSimpleName() + " transition for " + fragment, trace_1.categories.Transition);
            }
            if (returnTransition.transitionListener) {
                returnTransition.transitionListener.remove();
            }
            fragment.setReturnTransition(null);
        }
    }
}
exports._clearBackwardTransitions = _clearBackwardTransitions;
function _clearForwardTransitions(fragment) {
    var expandedFragment = fragment;
    if (expandedFragment.exitPopEnterTransition) {
        if (trace_1.isEnabled()) {
            trace_1.write("Cleared exitPopEnterTransition " + expandedFragment.exitPopEnterTransition + " for " + fragment, trace_1.categories.Transition);
        }
        if (expandedFragment.exitPopEnterTransitionListener) {
            expandedFragment.exitPopEnterTransitionListener.remove();
        }
        expandedFragment.exitPopEnterTransition = undefined;
    }
    if (_sdkVersion() >= 21) {
        var exitTransition = fragment.getExitTransition();
        if (exitTransition) {
            if (trace_1.isEnabled()) {
                trace_1.write("Cleared Exit " + exitTransition.getClass().getSimpleName() + " transition for " + fragment, trace_1.categories.Transition);
            }
            if (exitTransition.transitionListener) {
                exitTransition.transitionListener.remove();
            }
            fragment.setExitTransition(null);
        }
        var reenterTransition = fragment.getReenterTransition();
        if (reenterTransition) {
            if (trace_1.isEnabled()) {
                trace_1.write("Cleared Pop Enter " + reenterTransition.getClass().getSimpleName() + " transition for " + fragment, trace_1.categories.Transition);
            }
            if (reenterTransition.transitionListener) {
                reenterTransition.transitionListener.remove();
            }
            fragment.setReenterTransition(null);
        }
    }
}
exports._clearForwardTransitions = _clearForwardTransitions;
function _setAndroidFragmentTransitions(cachePagesOnNavigate, navigationTransition, currentFragment, newFragment, fragmentTransaction) {
    trace_1.write("Setting Android Fragment Transitions...", trace_1.categories.Transition);
    var name;
    if (navigationTransition.name) {
        name = navigationTransition.name.toLowerCase();
    }
    var useLollipopTransition = name && (name.indexOf("slide") === 0 || name === "fade" || name === "explode") && _sdkVersion() >= 21;
    if (cachePagesOnNavigate && _sdkVersion() === 23) {
        useLollipopTransition = false;
    }
    if (useLollipopTransition) {
        newFragment.setAllowEnterTransitionOverlap(true);
        newFragment.setAllowReturnTransitionOverlap(true);
        if (currentFragment) {
            currentFragment.setAllowEnterTransitionOverlap(true);
            currentFragment.setAllowReturnTransitionOverlap(true);
        }
        if (name.indexOf("slide") === 0) {
            var direction = name.substr("slide".length) || "left";
            switch (direction) {
                case "left":
                    var rightEdge = new android.transition.Slide(android.view.Gravity.RIGHT);
                    _setUpNativeTransition(navigationTransition, rightEdge);
                    _addNativeTransitionListener(newFragment, rightEdge);
                    newFragment.setEnterTransition(rightEdge);
                    if (currentFragment) {
                        var leftEdge_1 = new android.transition.Slide(android.view.Gravity.LEFT);
                        _setUpNativeTransition(navigationTransition, leftEdge_1);
                        _addNativeTransitionListener(currentFragment, leftEdge_1);
                        currentFragment.setExitTransition(leftEdge_1);
                    }
                    break;
                case "right":
                    var leftEdge = new android.transition.Slide(android.view.Gravity.LEFT);
                    _setUpNativeTransition(navigationTransition, leftEdge);
                    _addNativeTransitionListener(newFragment, leftEdge);
                    newFragment.setEnterTransition(leftEdge);
                    if (currentFragment) {
                        var rightEdge_1 = new android.transition.Slide(android.view.Gravity.RIGHT);
                        _setUpNativeTransition(navigationTransition, rightEdge_1);
                        _addNativeTransitionListener(currentFragment, rightEdge_1);
                        currentFragment.setExitTransition(rightEdge_1);
                    }
                    break;
                case "top":
                    var bottomEdge = new android.transition.Slide(android.view.Gravity.BOTTOM);
                    _setUpNativeTransition(navigationTransition, bottomEdge);
                    _addNativeTransitionListener(newFragment, bottomEdge);
                    newFragment.setEnterTransition(bottomEdge);
                    if (currentFragment) {
                        var topEdge_1 = new android.transition.Slide(android.view.Gravity.TOP);
                        _setUpNativeTransition(navigationTransition, topEdge_1);
                        _addNativeTransitionListener(currentFragment, topEdge_1);
                        currentFragment.setExitTransition(topEdge_1);
                    }
                    break;
                case "bottom":
                    var topEdge = new android.transition.Slide(android.view.Gravity.TOP);
                    _setUpNativeTransition(navigationTransition, topEdge);
                    _addNativeTransitionListener(newFragment, topEdge);
                    newFragment.setEnterTransition(topEdge);
                    if (currentFragment) {
                        var bottomEdge_1 = new android.transition.Slide(android.view.Gravity.BOTTOM);
                        _setUpNativeTransition(navigationTransition, bottomEdge_1);
                        _addNativeTransitionListener(currentFragment, bottomEdge_1);
                        currentFragment.setExitTransition(bottomEdge_1);
                    }
                    break;
            }
        }
        else if (name === "fade") {
            var fadeEnter = new android.transition.Fade(android.transition.Fade.IN);
            _setUpNativeTransition(navigationTransition, fadeEnter);
            _addNativeTransitionListener(newFragment, fadeEnter);
            newFragment.setEnterTransition(fadeEnter);
            var fadeReturn = new android.transition.Fade(android.transition.Fade.OUT);
            _setUpNativeTransition(navigationTransition, fadeReturn);
            _addNativeTransitionListener(newFragment, fadeReturn);
            newFragment.setReturnTransition(fadeReturn);
            if (currentFragment) {
                var fadeExit = new android.transition.Fade(android.transition.Fade.OUT);
                _setUpNativeTransition(navigationTransition, fadeExit);
                _addNativeTransitionListener(currentFragment, fadeExit);
                currentFragment.setExitTransition(fadeExit);
                var fadeReenter = new android.transition.Fade(android.transition.Fade.IN);
                _setUpNativeTransition(navigationTransition, fadeReenter);
                _addNativeTransitionListener(currentFragment, fadeReenter);
                currentFragment.setReenterTransition(fadeReenter);
            }
        }
        else if (name === "explode") {
            var explodeEnter = new android.transition.Explode();
            _setUpNativeTransition(navigationTransition, explodeEnter);
            _addNativeTransitionListener(newFragment, explodeEnter);
            newFragment.setEnterTransition(explodeEnter);
            if (currentFragment) {
                var explodeExit = new android.transition.Explode();
                _setUpNativeTransition(navigationTransition, explodeExit);
                _addNativeTransitionListener(currentFragment, explodeExit);
                currentFragment.setExitTransition(explodeExit);
            }
        }
    }
    else {
        var transition = void 0;
        if (name) {
            if (name.indexOf("slide") === 0) {
                var direction = name.substr("slide".length) || "left";
                ensureSlideTransition();
                transition = new slideTransition.SlideTransition(direction, navigationTransition.duration, navigationTransition.curve);
            }
            else if (name === "fade") {
                ensureFadeTransition();
                transition = new fadeTransition.FadeTransition(navigationTransition.duration, navigationTransition.curve);
            }
            else if (name.indexOf("flip") === 0) {
                var direction = name.substr("flip".length) || "right";
                ensureFlipTransition();
                transition = new flipTransition.FlipTransition(direction, navigationTransition.duration, navigationTransition.curve);
            }
        }
        else {
            transition = navigationTransition.instance;
        }
        if (transition) {
            var newExpandedFragment = newFragment;
            newExpandedFragment.enterPopExitTransition = transition;
            if (currentFragment) {
                var currentExpandedFragment = currentFragment;
                currentExpandedFragment.exitPopEnterTransition = transition;
            }
            fragmentTransaction.setCustomAnimations(enterFakeResourceId, exitFakeResourceId, popEnterFakeResourceId, popExitFakeResourceId);
        }
    }
    _printTransitions(currentFragment);
    _printTransitions(newFragment);
}
exports._setAndroidFragmentTransitions = _setAndroidFragmentTransitions;
function _setUpNativeTransition(navigationTransition, nativeTransition) {
    if (navigationTransition.duration) {
        nativeTransition.setDuration(navigationTransition.duration);
    }
    if (navigationTransition.curve) {
        var interpolator = animation_1._resolveAnimationCurve(navigationTransition.curve);
        nativeTransition.setInterpolator(interpolator);
    }
    else {
        nativeTransition.setInterpolator(_defaultInterpolator());
    }
}
function _onFragmentShown(fragment, isBack) {
    if (trace_1.isEnabled()) {
        trace_1.write("_onFragmentShown(" + fragment + ", isBack: " + isBack + ")", trace_1.categories.Transition);
    }
    var expandedFragment = fragment;
    var transitionType = isBack ? "Pop Enter" : "Enter";
    var relevantTransition = isBack ? expandedFragment.exitPopEnterTransition : expandedFragment.enterPopExitTransition;
    if (relevantTransition) {
        if (trace_1.isEnabled()) {
            trace_1.write(fragment + " has been shown when going " + (isBack ? "back" : "forward") + ", but there is " + transitionType + " " + relevantTransition + ". Will complete page addition when transition ends.", trace_1.categories.Transition);
        }
        expandedFragment.completePageAdditionWhenTransitionEnds = { isBack: isBack };
    }
    else if (_sdkVersion() >= 21) {
        var nativeTransition = isBack ? fragment.getReenterTransition() : fragment.getEnterTransition();
        if (nativeTransition) {
            if (trace_1.isEnabled()) {
                trace_1.write(fragment + " has been shown when going " + (isBack ? "back" : "forward") + ", but there is " + transitionType + " " + nativeTransition.getClass().getSimpleName() + " transition. Will complete page addition when transition ends.", trace_1.categories.Transition);
            }
            expandedFragment.completePageAdditionWhenTransitionEnds = { isBack: isBack };
        }
    }
    if (!expandedFragment.completePageAdditionWhenTransitionEnds) {
        _completePageAddition(fragment, isBack);
    }
}
exports._onFragmentShown = _onFragmentShown;
function _onFragmentHidden(fragment, isBack, destroyed) {
    if (trace_1.isEnabled()) {
        trace_1.write("_onFragmentHidden(" + fragment + ", isBack: " + isBack + ", destroyed: " + destroyed + ")", trace_1.categories.Transition);
    }
    var expandedFragment = fragment;
    var transitionType = isBack ? "Pop Exit" : "Exit";
    var relevantTransition = isBack ? expandedFragment.enterPopExitTransition : expandedFragment.exitPopEnterTransition;
    if (relevantTransition) {
        if (trace_1.isEnabled()) {
            trace_1.write(fragment + " has been hidden when going " + (isBack ? "back" : "forward") + ", but there is " + transitionType + " " + relevantTransition + ". Will complete page removal when transition ends.", trace_1.categories.Transition);
        }
        expandedFragment.completePageRemovalWhenTransitionEnds = { isBack: isBack };
    }
    else if (_sdkVersion() >= 21) {
        var nativeTransition = isBack ? fragment.getReturnTransition() : fragment.getExitTransition();
        if (nativeTransition) {
            if (trace_1.isEnabled()) {
                trace_1.write(fragment + " has been hidden when going " + (isBack ? "back" : "forward") + ", but there is " + transitionType + " " + nativeTransition.getClass().getSimpleName() + " transition. Will complete page removal when transition ends.", trace_1.categories.Transition);
            }
            expandedFragment.completePageRemovalWhenTransitionEnds = { isBack: isBack };
        }
    }
    expandedFragment.isDestroyed = destroyed;
    if (expandedFragment.completePageRemovalWhenTransitionEnds === undefined) {
        _completePageRemoval(fragment, isBack);
    }
}
exports._onFragmentHidden = _onFragmentHidden;
function _completePageAddition(fragment, isBack) {
    var expandedFragment = fragment;
    expandedFragment.completePageAdditionWhenTransitionEnds = undefined;
    var frame = fragment._callbacks.frame;
    var entry = fragment._callbacks.entry;
    var page = entry.resolvedPage;
    if (trace_1.isEnabled()) {
        trace_1.write("STARTING ADDITION of " + page + "...", trace_1.categories.Transition);
    }
    frame._currentEntry = entry;
    page.onNavigatedTo(isBack);
    frame._processNavigationQueue(page);
    entry.isNavigation = undefined;
    if (trace_1.isEnabled()) {
        trace_1.write("ADDITION of " + page + " completed", trace_1.categories.Transition);
    }
}
function _completePageRemoval(fragment, isBack) {
    var expandedFragment = fragment;
    expandedFragment.completePageRemovalWhenTransitionEnds = undefined;
    var frame = fragment._callbacks.frame;
    var entry = fragment._callbacks.entry;
    var page = entry.resolvedPage;
    if (trace_1.isEnabled()) {
        trace_1.write("STARTING REMOVAL of " + page + "...", trace_1.categories.Transition);
    }
    if (page.frame) {
        frame._removeView(page);
        if (entry.isNavigation) {
            page.onNavigatedFrom(isBack);
        }
        if (trace_1.isEnabled()) {
            trace_1.write("REMOVAL of " + page + " completed", trace_1.categories.Transition);
        }
    }
    else {
        if (trace_1.isEnabled()) {
            trace_1.write("REMOVAL of " + page + " has already been done", trace_1.categories.Transition);
        }
    }
    if (expandedFragment.isDestroyed) {
        expandedFragment.isDestroyed = undefined;
        if (page._context) {
            page._tearDownUI(true);
            if (trace_1.isEnabled()) {
                trace_1.write("DETACHMENT of " + page + " completed", trace_1.categories.Transition);
            }
        }
        else {
            if (trace_1.isEnabled()) {
                trace_1.write("DETACHMENT of " + page + " has already been done", trace_1.categories.Transition);
            }
            _removePageNativeViewFromAndroidParent(page);
        }
    }
    entry.isNavigation = undefined;
}
function _removePageNativeViewFromAndroidParent(page) {
    if (page.nativeView && page.nativeView.getParent) {
        var androidParent = page.nativeView.getParent();
        if (androidParent && androidParent.removeView) {
            if (trace_1.isEnabled()) {
                trace_1.write("REMOVED " + page + ".nativeView from its Android parent", trace_1.categories.Transition);
            }
            if (page._context) {
                page._tearDownUI(true);
            }
            androidParent.removeView(page.nativeView);
        }
    }
}
exports._removePageNativeViewFromAndroidParent = _removePageNativeViewFromAndroidParent;
function _toShortString(nativeTransition) {
    return nativeTransition.getClass().getSimpleName() + "@" + nativeTransition.hashCode().toString(16);
}
function _addNativeTransitionListener(fragment, nativeTransition) {
    var transitionListener = new android.transition.Transition.TransitionListener({
        onTransitionCancel: function (transition) {
            var expandedFragment = this.fragment;
            if (!expandedFragment) {
                return;
            }
            if (trace_1.isEnabled()) {
                trace_1.write("CANCEL " + _toShortString(transition) + " transition for " + expandedFragment, trace_1.categories.Transition);
            }
            if (expandedFragment.completePageRemovalWhenTransitionEnds) {
                _completePageRemoval(expandedFragment, expandedFragment.completePageRemovalWhenTransitionEnds.isBack);
            }
            if (expandedFragment.completePageAdditionWhenTransitionEnds) {
                _completePageAddition(expandedFragment, expandedFragment.completePageAdditionWhenTransitionEnds.isBack);
            }
            this.checkedRemove();
        },
        onTransitionEnd: function (transition) {
            var expandedFragment = this.fragment;
            if (!expandedFragment) {
                return;
            }
            if (trace_1.isEnabled()) {
                trace_1.write("END " + _toShortString(transition) + " transition for " + expandedFragment, trace_1.categories.Transition);
            }
            if (expandedFragment.completePageRemovalWhenTransitionEnds) {
                _completePageRemoval(expandedFragment, expandedFragment.completePageRemovalWhenTransitionEnds.isBack);
            }
            if (expandedFragment.completePageAdditionWhenTransitionEnds) {
                _completePageAddition(expandedFragment, expandedFragment.completePageAdditionWhenTransitionEnds.isBack);
            }
            this.checkedRemove();
        },
        onTransitionPause: function (transition) {
            var expandedFragment = this.fragment;
            if (trace_1.isEnabled()) {
                trace_1.write("PAUSE " + _toShortString(transition) + " transition for " + expandedFragment, trace_1.categories.Transition);
            }
        },
        onTransitionResume: function (transition) {
            var expandedFragment = this.fragment;
            if (trace_1.isEnabled()) {
                trace_1.write("RESUME " + _toShortString(transition) + " transition for " + expandedFragment, trace_1.categories.Transition);
            }
        },
        onTransitionStart: function (transition) {
            var expandedFragment = this.fragment;
            if (trace_1.isEnabled()) {
                trace_1.write("START " + _toShortString(transition) + " transition for " + expandedFragment, trace_1.categories.Transition);
            }
        }
    });
    transitionListener.fragment = fragment;
    transitionListener.count = 2;
    transitionListener.transition = nativeTransition;
    transitionListener.listener = transitionListener;
    transitionListener.checkedRemove = function () {
        if (--this.count) {
            return;
        }
        this.remove();
    };
    transitionListener.remove = function () {
        if (!this.listener) {
            return;
        }
        this.transition.removeListener(this.listener);
        this.fragment = null;
        this.listener = null;
        this.transition.transitionListener = null;
        this.transition = null;
    };
    nativeTransition.addListener(transitionListener);
    nativeTransition.transitionListener = transitionListener;
}
function _onFragmentCreateAnimator(fragment, nextAnim) {
    var transitionType;
    switch (nextAnim) {
        case enterFakeResourceId:
            transitionType = AndroidTransitionType.enter;
            break;
        case exitFakeResourceId:
            transitionType = AndroidTransitionType.exit;
            break;
        case popEnterFakeResourceId:
            transitionType = AndroidTransitionType.popEnter;
            break;
        case popExitFakeResourceId:
            transitionType = AndroidTransitionType.popExit;
            break;
    }
    if ((nextAnim === popExitFakeResourceId || !nextAnim) && fragment.exitHack) {
        trace_1.write("HACK EXIT FOR " + fragment, trace_1.categories.Transition);
        transitionType = AndroidTransitionType.exit;
    }
    var transition;
    switch (transitionType) {
        case AndroidTransitionType.enter:
        case AndroidTransitionType.popExit:
            transition = fragment.enterPopExitTransition;
            break;
        case AndroidTransitionType.exit:
        case AndroidTransitionType.popEnter:
            transition = fragment.exitPopEnterTransition;
            break;
    }
    var animator;
    if (transition) {
        animator = transition.createAndroidAnimator(transitionType);
        trace_1.write(transition + ".createAndroidAnimator(" + transitionType + "): " + animator, trace_1.categories.Transition);
        var transitionListener = new android.animation.Animator.AnimatorListener({
            onAnimationStart: function (animator) {
                if (trace_1.isEnabled()) {
                    trace_1.write("START " + transitionType + " " + this.transition + " for " + this.fragment, trace_1.categories.Transition);
                }
            },
            onAnimationRepeat: function (animator) {
                if (trace_1.isEnabled()) {
                    trace_1.write("REPEAT " + transitionType + " " + this.transition + " for " + this.fragment, trace_1.categories.Transition);
                }
            },
            onAnimationEnd: function (animator) {
                if (trace_1.isEnabled()) {
                    trace_1.write("END " + transitionType + " " + this.transition + " for " + this.fragment, trace_1.categories.Transition);
                }
                if (this.fragment.completePageRemovalWhenTransitionEnds) {
                    _completePageRemoval(this.fragment, this.fragment.completePageRemovalWhenTransitionEnds.isBack);
                }
                if (this.fragment.completePageAdditionWhenTransitionEnds) {
                    _completePageAddition(this.fragment, this.fragment.completePageAdditionWhenTransitionEnds.isBack);
                }
                this.checkedRemove();
            },
            onAnimationCancel: function (animator) {
                if (trace_1.isEnabled()) {
                    trace_1.write("CANCEL " + transitionType + " " + this.transition + " for " + this.fragment, trace_1.categories.Transition);
                }
                if (this.fragment.completePageRemovalWhenTransitionEnds) {
                    _completePageRemoval(this.fragment, this.fragment.completePageRemovalWhenTransitionEnds.isBack);
                }
                if (this.fragment.completePageAdditionWhenTransitionEnds) {
                    _completePageAddition(this.fragment, this.fragment.completePageAdditionWhenTransitionEnds.isBack);
                }
                this.checkedRemove();
            }
        });
        transitionListener.fragment = fragment;
        transitionListener.transitionType = transitionType;
        transitionListener.count = 2;
        transitionListener.listener = transitionListener;
        transitionListener.animator = animator;
        transitionListener.checkedRemove = function () {
            if (--this.count) {
                return;
            }
            this.remove();
        };
        transitionListener.remove = function () {
            if (!this.listener) {
                return;
            }
            this.animator.removeListener(this.listener);
            switch (this.transitionType) {
                case AndroidTransitionType.enter:
                case AndroidTransitionType.popExit:
                    this.fragment.enterPopExitTransitionListener = null;
                    break;
                case AndroidTransitionType.exit:
                case AndroidTransitionType.popEnter:
                    this.fragment.exitPopEnterTransitionListener = null;
                    break;
            }
            this.transitionType = null;
            this.fragment = null;
            this.listener = null;
            this.animator.transitionListener = null;
            this.animator = null;
            this.transitionType = null;
        };
        animator.transitionListener = transitionListener;
        animator.addListener(transitionListener);
        switch (transitionType) {
            case AndroidTransitionType.enter:
            case AndroidTransitionType.popExit:
                fragment.enterPopExitTransitionListener = transitionListener;
                break;
            case AndroidTransitionType.exit:
            case AndroidTransitionType.popEnter:
                fragment.exitPopEnterTransitionListener = transitionListener;
                break;
        }
    }
    if (transitionType && !animator) {
        animator = _createDummyZeroDurationAnimator();
    }
    return animator;
}
exports._onFragmentCreateAnimator = _onFragmentCreateAnimator;
function _prepareCurrentFragmentForClearHistory(fragment) {
    trace_1.write("Preparing " + fragment + " transitions fro clear history...", trace_1.categories.Transition);
    var expandedFragment = fragment;
    expandedFragment.exitHack = true;
    if (_sdkVersion() >= 21) {
        var exitTransition = fragment.getExitTransition();
        fragment.setReturnTransition(exitTransition);
    }
    _printTransitions(fragment);
}
exports._prepareCurrentFragmentForClearHistory = _prepareCurrentFragmentForClearHistory;
var intEvaluator;
function ensureIntEvaluator() {
    if (!intEvaluator) {
        intEvaluator = new android.animation.IntEvaluator();
    }
}
function _createDummyZeroDurationAnimator() {
    if (trace_1.isEnabled()) {
        trace_1.write("_createDummyZeroDurationAnimator()", trace_1.categories.Transition);
    }
    ensureIntEvaluator();
    var nativeArray = Array.create(java.lang.Object, 2);
    nativeArray[0] = java.lang.Integer.valueOf(0);
    nativeArray[1] = java.lang.Integer.valueOf(1);
    var animator = android.animation.ValueAnimator.ofObject(intEvaluator, nativeArray);
    animator.setDuration(0);
    return animator;
}
function _printTransitions(f) {
    if (f && trace_1.isEnabled) {
        var ef = f;
        var result = ef + " Transitions:";
        result += "" + (ef.enterPopExitTransition ? " enterPopExit=" + ef.enterPopExitTransition : "");
        result += "" + (ef.exitPopEnterTransition ? " exitPopEnter=" + ef.exitPopEnterTransition : "");
        if (_sdkVersion() >= 21) {
            result += "" + (f.getEnterTransition() ? " enter=" + _toShortString(f.getEnterTransition()) : "");
            result += "" + (f.getExitTransition() ? " exit=" + _toShortString(f.getExitTransition()) : "");
            result += "" + (f.getReenterTransition() ? " popEnter=" + _toShortString(f.getReenterTransition()) : "");
            result += "" + (f.getReturnTransition() ? " popExit=" + _toShortString(f.getReturnTransition()) : "");
        }
        trace_1.write(result, trace_1.categories.Transition);
    }
}
var Transition = (function () {
    function Transition(duration, curve) {
        this._duration = duration;
        if (curve) {
            this._interpolator = animation_1._resolveAnimationCurve(curve);
        }
        else {
            this._interpolator = _defaultInterpolator();
        }
        this._id = Transition.transitionId++;
    }
    Transition.prototype.getDuration = function () {
        return this._duration;
    };
    Transition.prototype.getCurve = function () {
        return this._interpolator;
    };
    Transition.prototype.animateIOSTransition = function (containerView, fromView, toView, operation, completion) {
        throw new Error("Abstract method call");
    };
    Transition.prototype.createAndroidAnimator = function (transitionType) {
        throw new Error("Abstract method call");
    };
    Transition.prototype.toString = function () {
        return types_1.getClass(this) + "@" + this._id;
    };
    return Transition;
}());
Transition.transitionId = 0;
exports.Transition = Transition;
//# sourceMappingURL=transition.js.map