package com.tns.gen.android.view;

public class GestureDetector_SimpleOnGestureListener_frnal_ts_helpers_l58_c38__TapAndDoubleTapGestureListenerImpl extends android.view.GestureDetector.SimpleOnGestureListener implements com.tns.NativeScriptHashCodeProvider {
	public GestureDetector_SimpleOnGestureListener_frnal_ts_helpers_l58_c38__TapAndDoubleTapGestureListenerImpl(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public boolean onSingleTapUp(android.view.MotionEvent param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		return (boolean)com.tns.Runtime.callJSMethod(this, "onSingleTapUp", boolean.class, args);
	}

	public boolean onDoubleTap(android.view.MotionEvent param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		return (boolean)com.tns.Runtime.callJSMethod(this, "onDoubleTap", boolean.class, args);
	}

	public boolean onDown(android.view.MotionEvent param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		return (boolean)com.tns.Runtime.callJSMethod(this, "onDown", boolean.class, args);
	}

	public void onLongPress(android.view.MotionEvent param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onLongPress", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
