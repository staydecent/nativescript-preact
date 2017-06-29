package com.tns.gen.java.lang;

public class Object_frnal_ts_helpers_l58_c38__ImageLoadedListenerImpl extends java.lang.Object implements com.tns.NativeScriptHashCodeProvider, org.nativescript.widgets.image.Worker.OnImageLoadedListener {
	public Object_frnal_ts_helpers_l58_c38__ImageLoadedListenerImpl(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public void onImageLoaded(boolean param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onImageLoaded", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
