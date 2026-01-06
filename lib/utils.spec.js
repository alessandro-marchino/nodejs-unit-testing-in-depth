const { expect, use } = require('chai');
const { createSandbox } = require('sinon');
const { default: chaiAsPromised } = require('chai-as-promised');
const { default: sinonChai } = require('sinon-chai');

const config = require('./config');
const crypto = require('crypto');
const utils = require('./utils');

use(chaiAsPromised);
use(sinonChai);

describe('utils', () => {
  const sandbox = createSandbox();
  let secretStub;
  let digestStub;
  let updateStub;
  let createHashStub;

  beforeEach(() => {
    secretStub = sandbox.stub(config, 'secret');
    digestStub = sandbox.stub();
    updateStub = sandbox.stub().returns({ digest: digestStub });
    createHashStub = sandbox.stub(crypto, 'createHash').returns({ update: updateStub });
  });
  afterEach(() => {
    sandbox.restore()
  })

  context('getHash', () => {
    it('should return null if invalid string is passed', () => {
      expect(utils.getHash()).to.be.null;
      expect(utils.getHash(123)).to.be.null;
      expect(utils.getHash({})).to.be.null;
      expect(createHashStub).to.not.have.been.called;
    });

    it('should call crypto with correct settings and return hash', () => {
      secretStub.returns('fake_secret');
      digestStub.returns('ABC123')
      const res = utils.getHash('foo');
      expect(res).to.equal('ABC123');
      expect(secretStub).to.have.been.called;
      expect(createHashStub).to.have.been.calledWith('md5');
      expect(updateStub).to.have.been.calledWith('foo_fake_secret');
      expect(digestStub).to.have.been.calledWith('hex');
    });

  })
});
