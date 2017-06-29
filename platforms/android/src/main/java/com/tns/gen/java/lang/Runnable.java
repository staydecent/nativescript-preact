package com.tns.gen.java.lang;

public class Runnable implements java.lang.Runnable {
	public Runnable() {
		com.tns.Runtime.initInstance(this);
	}

	public void run()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "run", void.class, args);
	}

}
