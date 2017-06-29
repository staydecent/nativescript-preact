package com.tns;

@com.tns.JavaScriptImplementation(javaScriptFile = "./tns_modules/tns-core-modules/ui/frame/activity.js")
public class NativeScriptActivity extends android.app.Activity implements com.tns.NativeScriptHashCodeProvider {
	public NativeScriptActivity(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	protected void onCreate(android.os.Bundle param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onCreate", void.class, args);
	}

	public void onCreate(android.os.Bundle param_0, android.os.PersistableBundle param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		com.tns.Runtime.callJSMethod(this, "onCreate", void.class, args);
	}

	protected void onSaveInstanceState(android.os.Bundle param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onSaveInstanceState", void.class, args);
	}

	public void onSaveInstanceState(android.os.Bundle param_0, android.os.PersistableBundle param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		com.tns.Runtime.callJSMethod(this, "onSaveInstanceState", void.class, args);
	}

	protected void onStart()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "onStart", void.class, args);
	}

	protected void onStop()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "onStop", void.class, args);
	}

	protected void onDestroy()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "onDestroy", void.class, args);
	}

	public void onBackPressed()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "onBackPressed", void.class, args);
	}

	public void onRequestPermissionsResult(int param_0, java.lang.String[] param_1, int[] param_2)  {
		java.lang.Object[] args = new java.lang.Object[3];
		args[0] = param_0;
		args[1] = param_1;
		args[2] = param_2;
		com.tns.Runtime.callJSMethod(this, "onRequestPermissionsResult", void.class, args);
	}

	protected void onActivityResult(int param_0, int param_1, android.content.Intent param_2)  {
		java.lang.Object[] args = new java.lang.Object[3];
		args[0] = param_0;
		args[1] = param_1;
		args[2] = param_2;
		com.tns.Runtime.callJSMethod(this, "onActivityResult", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
