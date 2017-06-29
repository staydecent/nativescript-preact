package com.tns.gen.android.view;

public class ViewGroup_frnal_ts_helpers_l58_c38__NativeViewGroupImpl extends android.view.ViewGroup implements com.tns.NativeScriptHashCodeProvider {
	public ViewGroup_frnal_ts_helpers_l58_c38__NativeViewGroupImpl(android.content.Context param_0){
		super(param_0);
		com.tns.Runtime.initInstance(this);
	}

	public ViewGroup_frnal_ts_helpers_l58_c38__NativeViewGroupImpl(android.content.Context param_0, android.util.AttributeSet param_1){
		super(param_0, param_1);
		com.tns.Runtime.initInstance(this);
	}

	public ViewGroup_frnal_ts_helpers_l58_c38__NativeViewGroupImpl(android.content.Context param_0, android.util.AttributeSet param_1, int param_2){
		super(param_0, param_1, param_2);
		com.tns.Runtime.initInstance(this);
	}

	public ViewGroup_frnal_ts_helpers_l58_c38__NativeViewGroupImpl(android.content.Context param_0, android.util.AttributeSet param_1, int param_2, int param_3){
		super(param_0, param_1, param_2, param_3);
		com.tns.Runtime.initInstance(this);
	}

	protected void onMeasure(int param_0, int param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		com.tns.Runtime.callJSMethod(this, "onMeasure", void.class, args);
	}

	protected void onLayout(boolean param_0, int param_1, int param_2, int param_3, int param_4)  {
		java.lang.Object[] args = new java.lang.Object[5];
		args[0] = param_0;
		args[1] = param_1;
		args[2] = param_2;
		args[3] = param_3;
		args[4] = param_4;
		com.tns.Runtime.callJSMethod(this, "onLayout", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
