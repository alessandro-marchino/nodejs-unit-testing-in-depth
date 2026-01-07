const { expect, use } = require('chai');
const { createSandbox } = require('sinon');
const { default: sinonChai } = require('sinon-chai');
use(sinonChai);

const { Order } = require('./order');

describe('User model', () => {
  const sandbox = createSandbox();
  let consoleWarnStub;
  let dateNowSpy;
  let user;
  let items;

  beforeEach(() => {
    consoleWarnStub = sandbox.stub(console, 'warn');
    dateNowSpy = sandbox.spy(Date, 'now');
    user = { id: 1, name: 'foo' };
    items = [
      { name: 'Book', price: 10 },
      { name: 'Dice set', price: 5 }
    ];
  });
  afterEach(() => {
    sandbox.restore();
  })

  context('constructor', () => {
    it('should create instance of order and calculate total + shipping', () => {
      const o = new Order(123, user, items);
      expect(o).to.be.an.instanceOf(Order);
      expect(dateNowSpy).to.have.been.calledTwice;
      expect(o).to.have.property('ref').to.equal(123);
      expect(o).to.have.property('user').to.equal(user);
      expect(o).to.have.property('items').to.equal(items);
      expect(o).to.have.property('status').to.equal('Pending');
      expect(o).to.have.property('createdAt').to.be.a('number');
      expect(o).to.have.property('updatedAt').to.be.a('number');
      expect(o).to.have.property('subtotal').to.equal(15);
      expect(o).to.have.property('shipping').to.equal(5);
      expect(o).to.have.property('total').to.equal(20);

      expect(o.save).to.be.a('function');
      expect(o.cancel).to.be.a('function');
      expect(o.ship).to.be.a('function');
    })

    it('should create instance of order with large shipping cost', () => {
      const o = new Order(123, user, [ ...items, ...items, ...items, ...items ]);
      expect(o).to.be.an.instanceOf(Order);
      expect(dateNowSpy).to.have.been.calledTwice;
      expect(o).to.have.property('ref').to.equal(123);
      expect(o).to.have.property('user').to.equal(user);
      expect(o).to.have.property('items').to.have.length(8);
      expect(o).to.have.property('status').to.equal('Pending');
      expect(o).to.have.property('createdAt').to.be.a('number');
      expect(o).to.have.property('updatedAt').to.be.a('number');
      expect(o).to.have.property('subtotal').to.equal(60);
      expect(o).to.have.property('shipping').to.equal(10);
      expect(o).to.have.property('total').to.equal(70);

      expect(o.save).to.be.a('function');
      expect(o.cancel).to.be.a('function');
      expect(o.ship).to.be.a('function');
    });
  });

  context('save', () => {
    it('should update status and return order details', () => {
      const o = new Order(123, user, items);
      const res = o.save();
      expect(dateNowSpy).to.have.been.calledThrice;
      expect(o).to.have.property('status').to.equal('Active');
      expect(res).to.be.a('object');
      expect(res).to.have.property('ref').to.equal(123);
      expect(res).to.have.property('user').to.equal(user.name);
      expect(res).to.have.property('updatedAt').to.be.a('number');
      expect(res).to.have.property('status').to.equal('Active');
      expect(res).to.have.property('items').to.equal(items);
      expect(res).to.have.property('shipping').to.equal(5);
      expect(res).to.have.property('total').to.equal(20);
    });
  });

  context('cancel', () => {
    it('should cancel an order, update status and set shipping and total to zero', () => {
      const o = new Order(123, user, items);
      const res = o.cancel();
      expect(dateNowSpy).to.have.been.calledThrice;
      expect(consoleWarnStub).to.have.been.calledOnce;
      expect(consoleWarnStub).to.have.been.calledWith('Order cancelled');

      expect(o).to.have.property('status').to.equal('Cancelled');
      expect(o).to.have.property('shipping').to.equal(0);
      expect(o).to.have.property('total').to.equal(0);
      expect(res).to.be.true;
    });
  });

  context('ship', () => {
    it('should update status to shipped', () => {
      const o = new Order(123, user, items);
      o.ship();
      expect(dateNowSpy).to.have.been.calledThrice;
      expect(o).to.have.property('status').to.equal('Shipped');
    });
  });

})
