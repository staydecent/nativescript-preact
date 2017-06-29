package com.tns.gen.java.lang;

public class Object_frnal_ts_helpers_l58_c38__TabChangeListenerImpl extends java.lang.Object implements com.tns.NativeScriptHashCodeProvider, android.widget.TabHost.OnTabChangeListener {
	public Object_frnal_ts_helpers_l58_c38__TabChangeListenerImpl(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public void onTabChanged(java.lang.String param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onTabChanged", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
