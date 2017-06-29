package com.tns.gen.android.view;

public class View_OnClickListener implements android.view.View.OnClickListener {
	public View_OnClickListener() {
		com.tns.Runtime.initInstance(this);
	}

	public void onClick(android.view.View param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onClick", void.class, args);
	}

}
