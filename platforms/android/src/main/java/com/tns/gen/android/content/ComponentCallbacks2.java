package com.tns.gen.android.content;

public class ComponentCallbacks2 implements android.content.ComponentCallbacks2 {
	public ComponentCallbacks2() {
		com.tns.Runtime.initInstance(this);
	}

	public void onTrimMemory(int param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onTrimMemory", void.class, args);
	}

	public void onConfigurationChanged(android.content.res.Configuration param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onConfigurationChanged", void.class, args);
	}

	public void onLowMemory()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "onLowMemory", void.class, args);
	}

}
