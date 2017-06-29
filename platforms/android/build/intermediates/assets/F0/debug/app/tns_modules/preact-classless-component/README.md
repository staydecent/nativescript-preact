
# Preact Classless Component 
[![npm](https://img.shields.io/npm/v/preact-classless-component.svg)](http://npm.im/preact-classless-component)
[![travis](https://travis-ci.org/ld0rman/preact-classless-component.svg?branch=master)](https://travis-ci.org/ld0rman/preact-classless-component)
[![Dependency Status](https://david-dm.org/ld0rman/preact-classless-component.svg?style=flat)](https://david-dm.org/ld0rman/preact-classless-component)
[![devDependency Status](https://david-dm.org/ld0rman/preact-classless-component/dev-status.svg?style=flat)](https://david-dm.org/ld0rman/preact-classless-component#info=devDependencies)

If you use the [Preact](https://github.com/developit/preact) library, but don't want to use the `class` syntax because you've read articles by [Eric Elliott](https://medium.com/javascript-scene/a-simple-challenge-to-classical-inheritance-fans-e78c2cf5eead#.a3ako7xx9) and others that have lead you to favour object composition over class inheritance, then this utility is for you. 

### Installation

```
$ npm install --save preact-classless-component
```

### Usage

```js
/* ES6 Modules */

import createComponent from 'preact-classless-component';

/* CommonJS */

const createComponent = require('preact-classless-component');

const Component = createComponent({
	render(props, state) {
		return (
			<div>
				Hello world!			
			</div>
		);
	}
});

```

### Acknowledgments

Thanks to [Jason Miller](https://github.com/developit) for his help on debugging this function.

### License

MIT 
