const assert = require('assert');

describe('File to be tested', () => {
  context('Function to be tested', () => {
    it('should do something', () => {
      assert.equal(1, 1)
    });
    it('should do something else', () => {
      assert.deepEqual({ name: 'Joe' }, { name: 'Joe' });
    });
    it('this is a pending test');
  });
});
