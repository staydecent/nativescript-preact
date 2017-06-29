package com.tns.gen.android.view;

public class Choreographer_FrameCallback implements android.view.Choreographer.FrameCallback {
	public Choreographer_FrameCallback() {
		com.tns.Runtime.initInstance(this);
	}

	public void doFrame(long param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "doFrame", void.class, args);
	}

}
