const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  item: String,
  total: Number,
  notes: String
}, {
  // overrides default collection name auto created
  collection: 'orders'
});

module.exports.Order = mongoose.model('Order', OrderSchema);
