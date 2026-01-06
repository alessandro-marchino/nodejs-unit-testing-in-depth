import { Schema, model } from 'mongoose';

const UserSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: Number
}, {
  // overrides default collection name auto created
  collection: 'users'
});

export const User = model('User', UserSchema);
