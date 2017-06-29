package com.tns.gen.android.view;

public class ViewTreeObserver_OnScrollChangedListener implements android.view.ViewTreeObserver.OnScrollChangedListener {
	public ViewTreeObserver_OnScrollChangedListener() {
		com.tns.Runtime.initInstance(this);
	}

	public void onScrollChanged()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "onScrollChanged", void.class, args);
	}

}
