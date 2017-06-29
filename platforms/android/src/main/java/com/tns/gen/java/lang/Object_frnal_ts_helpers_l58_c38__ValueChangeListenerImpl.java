package com.tns.gen.java.lang;

public class Object_frnal_ts_helpers_l58_c38__ValueChangeListenerImpl extends java.lang.Object implements com.tns.NativeScriptHashCodeProvider, android.widget.NumberPicker.OnValueChangeListener {
	public Object_frnal_ts_helpers_l58_c38__ValueChangeListenerImpl(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public void onValueChange(android.widget.NumberPicker param_0, int param_1, int param_2)  {
		java.lang.Object[] args = new java.lang.Object[3];
		args[0] = param_0;
		args[1] = param_1;
		args[2] = param_2;
		com.tns.Runtime.callJSMethod(this, "onValueChange", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
