package com.tns.gen.java.lang;

public class Object_frnal_ts_helpers_l58_c38__SeekBarChangeListenerImpl extends java.lang.Object implements com.tns.NativeScriptHashCodeProvider, android.widget.SeekBar.OnSeekBarChangeListener {
	public Object_frnal_ts_helpers_l58_c38__SeekBarChangeListenerImpl(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public void onProgressChanged(android.widget.SeekBar param_0, int param_1, boolean param_2)  {
		java.lang.Object[] args = new java.lang.Object[3];
		args[0] = param_0;
		args[1] = param_1;
		args[2] = param_2;
		com.tns.Runtime.callJSMethod(this, "onProgressChanged", void.class, args);
	}

	public void onStartTrackingTouch(android.widget.SeekBar param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onStartTrackingTouch", void.class, args);
	}

	public void onStopTrackingTouch(android.widget.SeekBar param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onStopTrackingTouch", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
