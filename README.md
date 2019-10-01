# NativeScript Preact

This plugin integrates [Preact](https://preactjs.com/) and [NativeScript](https://www.nativescript.org/), allowing you to build cross-platform iOS and Android apps using Preact.

Why? Because I prefer the (P)React pattern of building UIs over what Angular offers, and find that NativeScript has [several technical advantages](https://www.quora.com/What-are-the-key-difference-between-ReactNative-and-NativeScript) over ReactNative.

## Getting Started

1. [Install NativeScript CLI](https://docs.nativescript.org/start/quick-setup)
2. Generate a new repo based on [NativeScript Preact Template](https://github.com/staydecent/nativescript-preact-template/generate)
3. Clone your new repo.
4. `npm install` and `nativescript run android` (or `ios`)

## This is Alpha Software!

This is a very early working example, and should not be used for a production app unless you really know what you're doing. I hope to build a side-project using this as well as add unit tests for all NativeScript components.

## How it Works

This was made possible by [undom](https://github.com/developit/undom) library, allowing Preact to rending into a pure JavaScript DOM, within the NativeScript runtime. Currently, I'm shipping a modified undom with basic MutationObserver API implemented which is what nativescript-preact uses to sync changes from the DOM to the NativeScript widgets. I aimed to keep this code generalized (and hopefully small), so the bridge code is easier to maintain and less prone to bugs.

## Get Involved!

[File issues!](https://github.com/staydecent/nativescript-preact/issues) Feel free to post questions as issues here or look for the `#preact` channel on the [NativeScript Slack Community](https://www.nativescript.org/slack-invitation-form).
