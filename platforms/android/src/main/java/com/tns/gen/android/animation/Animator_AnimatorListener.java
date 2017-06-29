package com.tns.gen.android.animation;

public class Animator_AnimatorListener implements android.animation.Animator.AnimatorListener {
	public Animator_AnimatorListener() {
		com.tns.Runtime.initInstance(this);
	}

	public void onAnimationStart(android.animation.Animator param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onAnimationStart", void.class, args);
	}

	public void onAnimationEnd(android.animation.Animator param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onAnimationEnd", void.class, args);
	}

	public void onAnimationCancel(android.animation.Animator param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onAnimationCancel", void.class, args);
	}

	public void onAnimationRepeat(android.animation.Animator param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onAnimationRepeat", void.class, args);
	}

}
