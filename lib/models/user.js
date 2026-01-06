const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: Number
}, {
  // overrides default collection name auto created
  collection: 'users'
});

module.exports.User = model('User', UserSchema);
