const { expect, use } = require('chai');
const { createSandbox } = require('sinon');
const { default: chaiAsPromised } = require('chai-as-promised');
const { default: sinonChai } = require('sinon-chai');
const rewire = require('rewire');
const request = require('supertest');

let app = rewire('./app');
const users = require('./users');
const auth = require('./auth');
const { response } = require('./app');

use(chaiAsPromised);
use(sinonChai);

describe.only('app', () => {
  const sandbox = createSandbox();
  let handleErrorStub;

  beforeEach(() => {
    handleErrorStub = sandbox.stub();
  })

  afterEach(() => {
    app = rewire('./app');
    sandbox.restore();
  });

  context('GET /', () => {
    it('should get /', done => {
      request(app)
        .get('/')
        .expect(200)
        .end((err, response) => {
          expect(err).not.to.exist;
          expect(response.body).to.have.property('name').to.equal('Foo Fooing Bar');
          done(err);
        })
    })
  });

  context('POST /user', () => {
    let createUserStub;
    beforeEach(() => {
      createUserStub = sandbox.stub(users, 'createUser');

    })

    it('should call user.create', done => {
      createUserStub.resolves({ name: 'foo' });
      request(app)
        .post('/user')
        .send({ name: 'fake' })
        .expect(200)
        .end((err, response) => {
          expect(err).not.to.exist;
          expect(response.body).to.have.property('name').to.equal('foo');
          expect(createUserStub).to.have.been.calledOnce;
          done(err);
        })
    });

    it('should call handleError on error', done => {
      createUserStub.rejects(new Error('fake_error'));
      handleErrorStub.callsFake((res, err) => res.status(400).json({ error: 'fake' }));
      app.__set__('handleError', handleErrorStub)

      request(app)
        .post('/user')
        .send({ name: 'fake' })
        .expect(400)
        .end((err, response) => {
          expect(err).not.to.exist;
          expect(response.body).to.have.property('error').to.equal('fake');
          expect(createUserStub).to.have.been.calledOnce;
          expect(handleErrorStub).to.have.been.calledOnce;
          done(err);
        })
    });
  });
})
