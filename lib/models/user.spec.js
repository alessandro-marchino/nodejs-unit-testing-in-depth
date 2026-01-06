const { expect } = require('chai');

const { User } = require('./user');

describe.only('User model', () => {
  it('should return error if required fields are missing', () => {
    const user = new User();
    const err = user.validateSync();

    expect(err.errors.name).to.exist;
    expect(err.errors.email).to.exist;
    expect(err.errors.age).to.not.exist;
  })
  it('should have optional age field', () => {
    const user = new User({ name: 'foo', email: 'foo@bar.com', age: 35});
    const err = user.validateSync();

    expect(err).to.not.exist;
    expect(user).to.have.property('age').to.equal(35);
  })
})
