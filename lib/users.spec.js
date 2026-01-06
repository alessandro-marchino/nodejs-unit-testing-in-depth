const { expect, use } = require('chai');
const { createSandbox } = require('sinon');
const { Model } = require('mongoose');
const { default: chaiAsPromised } = require('chai-as-promised');
const { default: sinonChai } = require('sinon-chai');
const rewire = require('rewire');
const users = rewire('./users');
const mailer = require('./mailer');

use(chaiAsPromised);
use(sinonChai);

describe('users', () => {
  const sandbox = createSandbox();
  let sampleUser;

  beforeEach(() => {
    sampleUser = {
      id: 123,
      name: 'foo',
      email: 'fpp@bar.com'
    }

  });
  afterEach(() => {
    sandbox.restore();
  });

  context('getUser', () => {
    it('should check for an id', done => {
      users.getUser(null, (err, result) => {
        expect(err).to.exist;
        expect(err.message).to.equal('Invalid user id');
        done();
      });
    });
    it('should call findUserById with id and return result', done => {
      const stub = sandbox.stub(Model, 'findById').yields(null, {name: 'foo'});
      users.getUser(123, (err, result) => {
        expect(err).not.to.exist;
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(123);
        expect(result).to.be.a('object');
        expect(result).to.have.property('name').to.equal('foo');
        done();
      });
    });

    it('should catch error if there is one', done => {
      const stub = sandbox.stub(Model, 'findById').yields(new Error('fake'));
      users.getUser(123, (err, result) => {
        expect(result).not.to.exist;
        expect(err).to.exist;
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal('fake');
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(123);
        done();
      });
    });
  });

  context('deleteUser', () => {
    it('should check for an id', async () => {
      try {
        await users.deleteUser(null);
        expect.fail('Should not have returned');
      } catch(err) {
        expect(err).to.exist;
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal('Invalid id');
      }
    });
    it('should call User.remove', async () => {
      const stub = sandbox.stub(Model, 'deleteOne').resolves('fake_remove_result');
      const res = await users.deleteUser(123);
      expect(res).to.equal('fake_remove_result');
      expect(stub).to.have.been.calledWith({ _id: 123 });
    });
  });

  context('createUser', () => {
    let saveStub;
    let mailerStub;
    let FakeUserClass;

    beforeEach(() => {
      saveStub = sandbox.stub().resolves(sampleUser);
      FakeUserClass = sandbox.stub().returns({ save: saveStub });
      mailerStub = sandbox.stub(mailer, 'sendWelcomeEmail').resolves('fake_email');
      users.__set__('User', FakeUserClass);
      users.__set__('sendWelcomeEmail', mailerStub);
    });
    it('should reject if invalid args', async () => {
      await expect(users.createUser()).to.eventually.be.rejectedWith('Invalid arguments');
      await expect(users.createUser({ name: 'foo' })).to.eventually.be.rejectedWith('Invalid arguments');
      await expect(users.createUser({ email: 'foo@bar.com' })).to.eventually.be.rejectedWith('Invalid arguments');
    });

    it('should call User with new', async () => {
      const result = await users.createUser(sampleUser);

      expect(result).to.exist;
      expect(FakeUserClass).to.have.been.calledWithNew;
      expect(FakeUserClass).to.have.been.calledWith(sampleUser);
      expect(saveStub).to.have.been.called;
      expect(mailerStub).to.have.been.called;
    });

    it('should reject errors', async() => {
      saveStub.rejects(new Error('fake'));
      await expect(users.createUser(sampleUser)).to.eventually.be.rejectedWith('fake');
    });
  });

});
