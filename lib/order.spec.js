const { expect, use } = require('chai');
const { createSandbox } = require('sinon');
const { default: sinonChai } = require('sinon-chai');
use(sinonChai);

const { Order } = require('./order');

describe.only('User model', () => {
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
})
