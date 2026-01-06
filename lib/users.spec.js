import { expect, use } from 'chai';
import { createSandbox } from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { Model } from 'mongoose';
import { deleteUser, getUser } from './users.mjs';

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
      getUser(null, (err, result) => {
        expect(err).to.exist;
        expect(err.message).to.equal('Invalid user id');
        done();
      });
    });
    it('should call findUserById with id and return result', done => {
      let stub = sandbox.stub(Model, 'findById').yields(null, {name: 'foo'});
      getUser(123, (err, result) => {
        expect(err).not.to.exist;
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(123);
        expect(result).to.be.a('object');
        expect(result).to.have.property('name').to.equal('foo');
        done();
      });
    });

    it('should catch error if there is one', done => {
      let stub = sandbox.stub(Model, 'findById').yields(new Error('fake'));
      getUser(123, (err, result) => {
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
        await deleteUser(null);
        expect.fail('Should not have returned');
      } catch(err) {
        expect(err).to.exist;
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal('Invalid id');
      }
    });
    it('should call User.remove', async () => {
      let stub = sandbox.stub(Model, 'deleteOne').resolves('fake_remove_result');
      const res = await deleteUser(123);
      expect(res).to.equal('fake_remove_result');
      expect(stub).to.have.been.calledWith({ _id: 123 });
    });
  });

});
