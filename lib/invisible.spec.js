const { expect, use } = require('chai');
const { createSandbox } = require('sinon');
const { default: sinonChai } = require('sinon-chai');
use(sinonChai);

const invisible = require('./invisible');

describe.only('invisible', () => {
  const sandbox = createSandbox();
  let consoleLogStub;

  beforeEach(() => {
    consoleLogStub = sandbox.stub(console, 'log');
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('test', () => {
    it('should do nothing', () => {
      invisible.test();

      expect(consoleLogStub).to.have.been.calledWith('some text');
    })
  })
})
