const { expect, use } = require('chai');
const { default: chaiAsPromised } = require('chai-as-promised');
const { default: sinonChai } = require('sinon-chai');
const { spy, stub } = require('sinon');
const rewire = require('rewire');
var demo = rewire('./demo.js');

use(chaiAsPromised);
use(sinonChai);

describe('demo', () => {
  context('add', () => {
    it('should add two numbers', () => {
      expect(demo.add(1, 2)).to.equal(3);
    })
  });

  context('callback add', () => {
    it('should test the callback', done => {
      demo.addCallback(1, 2, (err, result) => {
        expect(err).to.not.exist;
        expect(result).to.equal(3);
        done();
      })
    })
  });

  context('addPromise', () => {
    it('should add with a promise', done => {
      demo.addPromise(1, 2).then(res => {
        expect(res).to.equal(3);
        done();
      }).catch(ex => {
        done(ex)
      });
    });

    it('should test promise with async/await', async () => {
      const res = await demo.addPromise(1, 2);
      expect(res).to.equal(3);
    });

    it('should test promise with chai-as-promised', async () => {
      await expect(demo.addPromise(1, 2)).to.eventually.equal(3);
    });
  });

  context('foo', () => {
    it('should spy on log', () => {
      const consoleLogSpy = spy(console, 'log');
      demo.foo();

      expect(consoleLogSpy.calledOnce).to.be.true;
      expect(consoleLogSpy).to.have.been.calledOnce;
      consoleLogSpy.restore();
    });

    it('should stub console.warn', () => {
      const consoleWarnStub = stub(console, 'warn').callsFake(() => console.log('Message from stub'));

      demo.foo();

      expect(consoleWarnStub.calledOnce).to.be.true;
      expect(consoleWarnStub).to.have.been.calledWith('console.warn was called');
      consoleWarnStub.restore();
    });
  });

  // Does not work with modules: ES Modules cannot be stubbed
  context('bar', () => {
    it('should stub createFile', async () => {
      const createStub = stub(demo, 'createFile').resolves('create_stub');
      const callStub = stub().resolves('calldb_stub');

      demo.__set__('callDB', callStub);

      const result = await demo.bar('test.txt');

      expect(result).to.equal('calldb_stub');
      expect(createStub).to.have.been.calledOnce;
      expect(createStub).to.have.been.calledWith('test.txt');
      expect(callStub).to.have.been.calledOnce;
    })
  });

});
