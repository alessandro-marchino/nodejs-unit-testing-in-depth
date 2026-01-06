import { expect } from 'chai';
import { add } from './demo.mjs';

describe('demo', () => {
  context('add', () => {
    it('should add two numbers', () => {
      expect(add(1, 2)).to.equal(3);
    })
  })
});
