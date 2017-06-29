package com.tns.gen.org.nativescript.widgets;

public class Async_CompleteCallback implements org.nativescript.widgets.Async.CompleteCallback {
	public Async_CompleteCallback() {
		com.tns.Runtime.initInstance(this);
	}

	public void onComplete(java.lang.Object param_0, java.lang.Object param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		com.tns.Runtime.callJSMethod(this, "onComplete", void.class, args);
	}

}
