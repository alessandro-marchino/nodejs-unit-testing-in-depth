const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: Number
}, {
  // overrides default collection name auto created
  collection: 'users'
});

module.exports.User = mongoose.model('User', UserSchema);
