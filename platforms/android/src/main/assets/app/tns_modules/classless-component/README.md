# Classless Component
[![travis](https://travis-ci.org/staydecent/classless-component.svg?branch=master)](https://travis-ci.org/staydecent/classless-component)
[![devDependency Status](https://david-dm.org/staydecent/classless-component/dev-status.svg?style=flat)](https://david-dm.org/staydecent/classless-component#info=devDependencies)

If you use [React](https://github.com/facebook/react), [Preact](https://github.com/developit/preact), or [Inferno](https://github.com/infernojs/inferno), but don't want to use the `class` syntax because you've read articles by [Eric Elliott](https://medium.com/javascript-scene/a-simple-challenge-to-classical-inheritance-fans-e78c2cf5eead#.a3ako7xx9) and others that have lead you to favour object composition over class inheritance, then this utility is for you. 

### Under Rapid Development!

Annoyed that [recompose](https://github.com/acdlite/recompose) was coupled to React and [Incompose](https://github.com/zanettin/incompose/) to Inferno, and wanting a solution for [Preact](https://github.com/developit/preact/), I set out to see how hard a de-coupled library would be. Instead of assuming one of the aforementioned libraries, the `compose` function accepts the Base Component Class (`React.Component`, `InfernoComponent`, ...) and the hyperscript function (`React.createElement`, `Preact.h`, ...) as the first two parameters.

### Installation

```
$ npm install --save classless-component
```

### Usage

As this is in rapid development, and by no means stable, please refer to the `test.js` file for working examples.

### Acknowledgments

Based on [preact-classless-component](https://github.com/laurencedorman/preact-classless-component) by Laurence Dorman.

### License

MIT 
