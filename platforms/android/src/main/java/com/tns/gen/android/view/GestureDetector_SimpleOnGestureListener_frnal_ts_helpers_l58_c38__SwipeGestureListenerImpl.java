package com.tns.gen.android.view;

public class GestureDetector_SimpleOnGestureListener_frnal_ts_helpers_l58_c38__SwipeGestureListenerImpl extends android.view.GestureDetector.SimpleOnGestureListener implements com.tns.NativeScriptHashCodeProvider {
	public GestureDetector_SimpleOnGestureListener_frnal_ts_helpers_l58_c38__SwipeGestureListenerImpl(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public boolean onDown(android.view.MotionEvent param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		return (boolean)com.tns.Runtime.callJSMethod(this, "onDown", boolean.class, args);
	}

	public boolean onFling(android.view.MotionEvent param_0, android.view.MotionEvent param_1, float param_2, float param_3)  {
		java.lang.Object[] args = new java.lang.Object[4];
		args[0] = param_0;
		args[1] = param_1;
		args[2] = param_2;
		args[3] = param_3;
		return (boolean)com.tns.Runtime.callJSMethod(this, "onFling", boolean.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
