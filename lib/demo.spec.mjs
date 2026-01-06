import { expect, use } from 'chai';
import { add, addCallback, addPromise, foo } from './demo.mjs';
import { spy, stub } from 'sinon';

import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised'
use(chaiAsPromised);
use(sinonChai);

describe('demo', () => {
  context('add', () => {
    it('should add two numbers', () => {
      expect(add(1, 2)).to.equal(3);
    })
  });

  context('callback add', () => {
    it('should test the callback', done => {
      addCallback(1, 2, (err, result) => {
        expect(err).to.not.exist;
        expect(result).to.equal(3);
        done();
      })
    })
  });

  context('addPromise', () => {
    it('should add with a promise', done => {
      addPromise(1, 2).then(res => {
        expect(res).to.equal(3);
        done();
      }).catch(ex => {
        done(ex)
      });
    });

    it('should test promise with async/await', async () => {
      const res = await addPromise(1, 2);
      expect(res).to.equal(3);
    });

    it('should test promise with chai-as-promised', async () => {
      await expect(addPromise(1, 2)).to.eventually.equal(3);
    });
  });

  context('foo', () => {
    it('should spy on log', () => {
      const consoleLogSpy = spy(console, 'log');
      foo();

      expect(consoleLogSpy.calledOnce).to.be.true;
      expect(consoleLogSpy).to.have.been.calledOnce;
      consoleLogSpy.restore();
    });

    it('should stub console.warn', () => {
      const consoleWarnStub = stub(console, 'warn').callsFake(() => console.log('Message from stub'));

      foo();

      expect(consoleWarnStub.calledOnce).to.be.true;
      expect(consoleWarnStub).to.have.been.calledWith('console.warn was called');
      consoleWarnStub.restore();
    });
  });

});
