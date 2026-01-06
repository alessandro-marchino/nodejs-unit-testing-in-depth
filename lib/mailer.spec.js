const { expect, use } = require('chai');
const { createSandbox } = require('sinon');
const { default: chaiAsPromised } = require('chai-as-promised');
const { default: sinonChai } = require('sinon-chai');
const rewire = require('rewire');
let mailer = rewire('./mailer');

use(chaiAsPromised);
use(sinonChai);

describe('mailer', () => {
  const sandbox = createSandbox();

  afterEach(() => {
    mailer = rewire('./mailer');
  });

  context('sendWelcomeEmail', () => {
    let sendEmailStub;
    beforeEach(() => {
      sendEmailStub = sandbox.stub();
      mailer.__set__('sendEmail', sendEmailStub);
    });

    it('should check for email and name', async() => {
      await expect(mailer.sendWelcomeEmail()).to.eventually.be.rejectedWith('Invalid input');
      await expect(mailer.sendWelcomeEmail('foo@bar.com')).to.eventually.be.rejectedWith('Invalid input');
    });

    it('should call sendEmail with email and message', async() => {
      sendEmailStub.resolves('done');
      const result = await mailer.sendWelcomeEmail('foo@bar.com', 'foo');
      expect(result).to.equal('done');
      expect(sendEmailStub).to.have.been.calledOnceWith('foo@bar.com', 'Dear foo, welcome to our family!');
    })
  });

  context('sendPasswordResetEmail', () => {
    let sendEmailStub;
    beforeEach(() => {
      sendEmailStub = sandbox.stub();
      mailer.__set__('sendEmail', sendEmailStub);
    });

    it('should check for email', async() => {
      await expect(mailer.sendPasswordResetEmail()).to.eventually.be.rejectedWith('Invalid input');
    });

    it('should call sendEmail with email and message', async() => {
      sendEmailStub.resolves('done');
      const result = await mailer.sendPasswordResetEmail('foo@bar.com');
      expect(result).to.equal('done');
      expect(sendEmailStub).to.have.been.calledOnceWith('foo@bar.com', 'Please click http://some_link to reset your password.');
    })
  });

  context('sendEmail', () => {
    let sendEmail;

    beforeEach(() => {
      sendEmail = mailer.__get__('sendEmail');
    })

    it('should check for email and body', async() => {
      await expect(sendEmail()).to.eventually.be.rejectedWith('Invalid input');
      await expect(sendEmail('foo@bar.com')).to.eventually.be.rejectedWith('Invalid input');
    });
    it('should call sendEmail with email and message', async() => {
      let result = await sendEmail('foo@bar.com', 'Welcome');
      expect(result).to.equal('Email sent');
    });
  });
});
