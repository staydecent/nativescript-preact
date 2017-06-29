package com.tns.gen.android.support.v4.view;

public class PagerAdapter_frnal_ts_helpers_l58_c38__PagerAdapterImpl extends android.support.v4.view.PagerAdapter implements com.tns.NativeScriptHashCodeProvider {
	public PagerAdapter_frnal_ts_helpers_l58_c38__PagerAdapterImpl(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public int getCount()  {
		java.lang.Object[] args = null;
		return (int)com.tns.Runtime.callJSMethod(this, "getCount", int.class, args);
	}

	public java.lang.CharSequence getPageTitle(int param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		return (java.lang.CharSequence)com.tns.Runtime.callJSMethod(this, "getPageTitle", java.lang.CharSequence.class, args);
	}

	public java.lang.Object instantiateItem(android.view.ViewGroup param_0, int param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		return (java.lang.Object)com.tns.Runtime.callJSMethod(this, "instantiateItem", java.lang.Object.class, args);
	}

	public java.lang.Object instantiateItem(android.view.View param_0, int param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		return (java.lang.Object)com.tns.Runtime.callJSMethod(this, "instantiateItem", java.lang.Object.class, args);
	}

	public void destroyItem(android.view.ViewGroup param_0, int param_1, java.lang.Object param_2)  {
		java.lang.Object[] args = new java.lang.Object[3];
		args[0] = param_0;
		args[1] = param_1;
		args[2] = param_2;
		com.tns.Runtime.callJSMethod(this, "destroyItem", void.class, args);
	}

	public void destroyItem(android.view.View param_0, int param_1, java.lang.Object param_2)  {
		java.lang.Object[] args = new java.lang.Object[3];
		args[0] = param_0;
		args[1] = param_1;
		args[2] = param_2;
		com.tns.Runtime.callJSMethod(this, "destroyItem", void.class, args);
	}

	public boolean isViewFromObject(android.view.View param_0, java.lang.Object param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		return (boolean)com.tns.Runtime.callJSMethod(this, "isViewFromObject", boolean.class, args);
	}

	public android.os.Parcelable saveState()  {
		java.lang.Object[] args = null;
		return (android.os.Parcelable)com.tns.Runtime.callJSMethod(this, "saveState", android.os.Parcelable.class, args);
	}

	public void restoreState(android.os.Parcelable param_0, java.lang.ClassLoader param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		com.tns.Runtime.callJSMethod(this, "restoreState", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
