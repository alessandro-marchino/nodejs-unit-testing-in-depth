const { sendPasswordResetEmail, sendWelcomeEmail } = require('./mailer.js');
const { User } = require('./models/user.js');

module.exports.getUser = (id, callback) => {
  if (!id) {
    return callback(new Error('Invalid user id'));
  }
  User.findById(id, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}

module.exports.deleteUser = (id) => {
  // return Promise.resolve()
  if (!id) {
    return Promise.reject(new Error('Invalid id'));
  }
  return User.deleteOne({
    _id: id
  });
}

module.exports.createUser = (data) => {
  if (!data || !data.email || !data.name) {
    return Promise.reject(new Error('Invalid arguments'));
  }
  console.log('data', data);
  const user = new User(data);
  console.log('user', user)
  return user.save()
  .then((result) => {
    console.log('result');
    return sendWelcomeEmail(data.email, data.name)
      .then(() => {
        console.log('after sendWelcomeMail')
        return {
          message: 'User created',
          userId: result.id
        };
      })
  })
  .catch((err) => Promise.reject(err));
}

module.exports.updateUser = async (id, data) => {
  try {
    const user = await User.findById(id);
    for (const prop in data) {
      user[prop] = data[prop];
    }
    const result = await user.save();
    return result;
  } catch (err) {
    // console.warn(err);
    return Promise.reject(err);
  }
}

module.exports.resetPassword = (email) => {
  if (!email) {
    return Promise.reject(new Error('Invalid email'));
  }
  //some operations
  return sendPasswordResetEmail(email);
}
