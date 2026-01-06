import { Schema, model } from 'mongoose';

const OrderSchema = Schema({
  item: String,
  total: Number,
  notes: String
}, {
  // overrides default collection name auto created
  collection: 'orders'
});

export const Order = model('Order', OrderSchema);
