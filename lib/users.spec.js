const { expect, use } = require('chai');
const { createSandbox } = require('sinon');
const { Model } = require('mongoose');
const { default: chaiAsPromised } = require('chai-as-promised');
const { default: sinonChai } = require('sinon-chai');
const rewire = require('rewire');
var users = rewire('./users');
const mailer = require('./mailer');

use(chaiAsPromised);
use(sinonChai);

describe('users', () => {
  const sandbox = createSandbox();
  let findByIdStub;
  let deleteOneStub;
  let sampleUser;

  beforeEach(() => {
    sampleUser = {
      id: 123,
      name: 'foo',
      email: 'fpp@bar.com',
      save: sandbox.stub()
    }
    findByIdStub = sandbox.stub(Model, 'findById');
    deleteOneStub = sandbox.stub(Model, 'deleteOne');
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
      findByIdStub.yields(null, {name: 'foo'})
      users.getUser(123, (err, result) => {
        expect(err).not.to.exist;
        expect(findByIdStub).to.have.been.calledOnce;
        expect(findByIdStub).to.have.been.calledWith(123);
        expect(result).to.be.a('object');
        expect(result).to.have.property('name').to.equal('foo');
        done();
      });
    });

    it('should catch error if there is one', done => {
      findByIdStub.yields(new Error('fake'));
      users.getUser(123, (err, result) => {
        expect(result).not.to.exist;
        expect(err).to.exist;
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal('fake');
        expect(findByIdStub).to.have.been.calledOnce;
        expect(findByIdStub).to.have.been.calledWith(123);
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
      deleteOneStub.resolves('fake_remove_result');
      const res = await users.deleteUser(123);
      expect(res).to.equal('fake_remove_result');
      expect(deleteOneStub).to.have.been.calledWith({ _id: 123 });
    });
  });

  context('createUser', () => {
    let saveStub;
    let sendWelcomeEmailStub;
    let FakeUserClass;

    beforeEach(() => {
      saveStub = sandbox.stub();
      FakeUserClass = sandbox.stub().returns({ save: saveStub });
      sendWelcomeEmailStub = sandbox.stub(mailer, 'sendWelcomeEmail');
      users.__set__('User', FakeUserClass);
    });
    afterEach(() => {
      sandbox.restore();
      users = rewire('./users');
    })
    it('should reject if invalid args', async () => {
      await expect(users.createUser()).to.eventually.be.rejectedWith('Invalid arguments');
      await expect(users.createUser({ name: 'foo' })).to.eventually.be.rejectedWith('Invalid arguments');
      await expect(users.createUser({ email: 'foo@bar.com' })).to.eventually.be.rejectedWith('Invalid arguments');
    });

    it('should call User with new', async () => {
      saveStub.resolves(sampleUser);
      sendWelcomeEmailStub.resolves('fake_email');

      const result = await users.createUser(sampleUser);

      expect(result).to.exist;
      expect(FakeUserClass).to.have.been.calledWithNew;
      expect(FakeUserClass).to.have.been.calledWith(sampleUser);
      expect(saveStub).to.have.been.called;
      expect(sendWelcomeEmailStub).to.have.been.called;
    });

    it('should reject errors', async() => {
      saveStub.rejects(new Error('fake'));
      await expect(users.createUser(sampleUser)).to.eventually.be.rejectedWith('fake');
    });
  });

  context('updateUser', () => {
    it('should update user', async() => {
      findByIdStub.resolves(sampleUser);
      sampleUser.save.resolves(sampleUser);
      const result = await users.updateUser(123, { age: 35 });

      expect(findByIdStub).to.have.been.calledWith(123);
      expect(result).to.exist;
      expect(sampleUser.save).to.have.been.calledOnce;
    });
    it('should reject if there is an error with user retrieval', async () => {
      findByIdStub.rejects(new Error('fake'));
      await expect(users.updateUser(123, { age: 35 })).to.eventually.have.been.rejectedWith('fake');
    })
    it('should reject if there is an error with user save', async () => {
      findByIdStub.resolves(sampleUser);
      sampleUser.save.throws(new Error('fake save'))
      await expect(users.updateUser(123, { age: 35 })).to.eventually.have.been.rejectedWith('fake save');
    })
  });

  context('resetPassword', () => {
    let sendPasswordResetEmailStub;
    beforeEach(() => {
      sendPasswordResetEmailStub = sandbox.stub(mailer, 'sendPasswordResetEmail');
    });
    it('should check for email', async() => {
      await expect(users.resetPassword()).to.eventually.have.been.rejectedWith('Invalid email');
    });
    it('sould call sendPasswordResetEmail', async() => {
      sendPasswordResetEmailStub.resolves('reset');
      const res = await users.resetPassword('foo@bar.com');

      expect(res).to.exist;
      expect(sendPasswordResetEmailStub).to.have.been.calledWith('foo@bar.com');
    });
  });

});
