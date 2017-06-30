# Preact and NativeScript

This is an exploration to get Preact working in NativeScript. Why? Because I prefer the React pattern of building UIs over what Angular offers, and find that NativeScript has [several technical advantages](https://www.quora.com/What-are-the-key-difference-between-ReactNative-and-NativeScript) over ReactNative.

## Getting Started

1. Clone this repo
2. Install nativescript: `npm install -g nativescript`
3. Follow [NativeScript docs](http://docs.nativescript.org/start/quick-setup) to setup iOS or Android environment
4. `npm install`
5. `nativescript run android` (or ios)

## Contributing!

Currently, this is just an exploration to see what works, and how much work is actually needed.

The current example, renders Preact components to undom (js based dom), which is then mapped to the NativeScript ui modules.

Certain convenience functions are used in the conversion, for example:

```html
<Page><Label ... /></Page>
```

Will map the children of `<Page>` to the NativeScript `content` attribute of the `Page` class:

```javascript
# psuedocode
var page = new pageModule.Page()
page.content = preact.children
```
So you can avoid having to write your Preact component like:

```html
<Page content={<Label ... />} />
```

Anyway. Any ideas our welcome!

## Current Conclusion

With the current example code working the way it is, I envision a `preact-render-to-nativescript` library that would work like `preact-render-to-string` or `preact-render-to-json`.

It would expose a `render` function that can be called with a Preact Component. What it returns could be returned in the `create` option of the `applicationModule.start` function.
