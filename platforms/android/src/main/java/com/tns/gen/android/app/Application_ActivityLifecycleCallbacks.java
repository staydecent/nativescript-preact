package com.tns.gen.android.app;

public class Application_ActivityLifecycleCallbacks implements android.app.Application.ActivityLifecycleCallbacks {
	public Application_ActivityLifecycleCallbacks() {
		com.tns.Runtime.initInstance(this);
	}

	public void onActivityCreated(android.app.Activity param_0, android.os.Bundle param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		com.tns.Runtime.callJSMethod(this, "onActivityCreated", void.class, args);
	}

	public void onActivityStarted(android.app.Activity param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onActivityStarted", void.class, args);
	}

	public void onActivityResumed(android.app.Activity param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onActivityResumed", void.class, args);
	}

	public void onActivityPaused(android.app.Activity param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onActivityPaused", void.class, args);
	}

	public void onActivityStopped(android.app.Activity param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onActivityStopped", void.class, args);
	}

	public void onActivitySaveInstanceState(android.app.Activity param_0, android.os.Bundle param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		com.tns.Runtime.callJSMethod(this, "onActivitySaveInstanceState", void.class, args);
	}

	public void onActivityDestroyed(android.app.Activity param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onActivityDestroyed", void.class, args);
	}

}
