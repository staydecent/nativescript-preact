package com.tns.gen.android.transition;

public class Transition_TransitionListener implements android.transition.Transition.TransitionListener {
	public Transition_TransitionListener() {
		com.tns.Runtime.initInstance(this);
	}

	public void onTransitionStart(android.transition.Transition param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onTransitionStart", void.class, args);
	}

	public void onTransitionEnd(android.transition.Transition param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onTransitionEnd", void.class, args);
	}

	public void onTransitionCancel(android.transition.Transition param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onTransitionCancel", void.class, args);
	}

	public void onTransitionPause(android.transition.Transition param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onTransitionPause", void.class, args);
	}

	public void onTransitionResume(android.transition.Transition param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onTransitionResume", void.class, args);
	}

}
