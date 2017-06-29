package com.tns.gen.android.view;

public class ViewTreeObserver_OnGlobalLayoutListener implements android.view.ViewTreeObserver.OnGlobalLayoutListener {
	public ViewTreeObserver_OnGlobalLayoutListener() {
		com.tns.Runtime.initInstance(this);
	}

	public void onGlobalLayout()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "onGlobalLayout", void.class, args);
	}

}
