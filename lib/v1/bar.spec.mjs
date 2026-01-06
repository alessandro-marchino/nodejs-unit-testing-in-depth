import { deepEqual, equal } from 'assert';

describe('bar.spec.ts', () => {
  context('Function to be tested', () => {

    it('should do something', () => {
      equal(1, 1);
      equal(process.env.NODE_ENV, 'development')
    });
    it('should do something else', () => {
      deepEqual({ name: 'Joe' }, { name: 'Joe' });
    });
    it('this is a pending test');
  });

  context('another function', () => {
    it('should do something');
  })
});
