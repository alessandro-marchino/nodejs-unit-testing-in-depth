const { expect } = require('chai');

const user = require('./user');

describe('user TDD', () => {
  context('getFullAddress', () => {
    it('should return the full address', () => {
      const result = user.getFullAddress({
        street: '100 king',
        city: 'London',
        province: 'ON',
        postal: '1111'
      });
      expect(result).to.equal('100 king, London, ON. 1111');
    });
    it('should return the full address', () => {
      const result = user.getFullAddress({
        street: '200 king',
        city: 'London',
        province: 'ON',
        postal: '1111'
      });
      expect(result).to.equal('200 king, London, ON. 1111');
    });
    it('should return an error', () => {
      const result = user.getFullAddress({
        street: null,
        city: 'London',
        province: 'ON',
        postal: '1111'
      });
      expect(result).to.equal('Invalid user');
    });
  });
});
