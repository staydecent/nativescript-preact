package com.tns.gen.java.lang;

public class Object_frnal_ts_helpers_l58_c38__QueryTextListenerImpl extends java.lang.Object implements com.tns.NativeScriptHashCodeProvider, android.widget.SearchView.OnQueryTextListener {
	public Object_frnal_ts_helpers_l58_c38__QueryTextListenerImpl(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public boolean onQueryTextChange(java.lang.String param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		return (boolean)com.tns.Runtime.callJSMethod(this, "onQueryTextChange", boolean.class, args);
	}

	public boolean onQueryTextSubmit(java.lang.String param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		return (boolean)com.tns.Runtime.callJSMethod(this, "onQueryTextSubmit", boolean.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
