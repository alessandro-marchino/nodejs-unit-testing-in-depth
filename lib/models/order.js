const { Schema, model } = require('mongoose');

const OrderSchema = Schema({
  item: String,
  total: Number,
  notes: String
}, {
  // overrides default collection name auto created
  collection: 'orders'
});

module.exports.Order = model('Order', OrderSchema);
