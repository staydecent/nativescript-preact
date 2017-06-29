package com.tns.gen.android.content;

public class DialogInterface_OnClickListener implements android.content.DialogInterface.OnClickListener {
	public DialogInterface_OnClickListener() {
		com.tns.Runtime.initInstance(this);
	}

	public void onClick(android.content.DialogInterface param_0, int param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		com.tns.Runtime.callJSMethod(this, "onClick", void.class, args);
	}

}
