package com.tns.gen.java.lang;

public class Object_frnal_ts_helpers_l58_c38__DateChangedListenerImpl extends java.lang.Object implements com.tns.NativeScriptHashCodeProvider, android.widget.DatePicker.OnDateChangedListener {
	public Object_frnal_ts_helpers_l58_c38__DateChangedListenerImpl(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public void onDateChanged(android.widget.DatePicker param_0, int param_1, int param_2, int param_3)  {
		java.lang.Object[] args = new java.lang.Object[4];
		args[0] = param_0;
		args[1] = param_1;
		args[2] = param_2;
		args[3] = param_3;
		com.tns.Runtime.callJSMethod(this, "onDateChanged", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
