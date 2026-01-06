import { expect, use } from 'chai';
import { add, addCallback, addPromise } from './demo.mjs';
import chaiAsPromised from 'chai-as-promised'
use(chaiAsPromised);

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
});
