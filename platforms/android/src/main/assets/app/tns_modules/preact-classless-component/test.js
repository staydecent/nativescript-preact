import chai from 'chai';

const expect = chai.expect;

import { h } from 'preact';
import render from 'preact-render-to-string';

import createComponent from './index.js';

describe('createComponent', () => {
  it('Should be a function', () => {
    expect(createComponent).to.be.a('function');
  });

  it('Should create a component', () => {
    const Test = createComponent({
      render() {
        return h('div', null, 'Hello world');
      }
    });

    const output = render(h(Test));

    expect(output).to.equal('<div>Hello world</div>');
  });
});
