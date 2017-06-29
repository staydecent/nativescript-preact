package com.tns.gen.android.content;

public class DialogInterface_OnDismissListener implements android.content.DialogInterface.OnDismissListener {
	public DialogInterface_OnDismissListener() {
		com.tns.Runtime.initInstance(this);
	}

	public void onDismiss(android.content.DialogInterface param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onDismiss", void.class, args);
	}

}
