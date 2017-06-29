package com.tns.gen.java.lang;

public class Object_frnal_ts_helpers_l58_c38__TabContentFactoryImpl extends java.lang.Object implements com.tns.NativeScriptHashCodeProvider, android.widget.TabHost.TabContentFactory {
	public Object_frnal_ts_helpers_l58_c38__TabContentFactoryImpl(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public android.view.View createTabContent(java.lang.String param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		return (android.view.View)com.tns.Runtime.callJSMethod(this, "createTabContent", android.view.View.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
