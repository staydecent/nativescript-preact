package com.tns.gen.android.util;

public class LruCache_frnal_ts_helpers_l58_c38__LruBitmapCache extends android.util.LruCache implements com.tns.NativeScriptHashCodeProvider {
	public LruCache_frnal_ts_helpers_l58_c38__LruBitmapCache(int param_0){
		super(param_0);
		com.tns.Runtime.initInstance(this);
	}

	protected int sizeOf(java.lang.Object param_0, java.lang.Object param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		return (int)com.tns.Runtime.callJSMethod(this, "sizeOf", int.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
