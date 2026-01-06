import { sendPasswordResetEmail, sendWelcomeEmail } from './mailer.mjs';
import { User } from './models/user.mjs';

export function getUser(id, callback) {
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

export function deleteUser(id) {
  // return Promise.resolve()
  if (!id) {
    return Promise.reject(new Error('Invalid id'));
  }
  return User.deleteOne({
    _id: id
  });
}

export function createUser(data) {
  if (!data || !data.email || !data.name) {
    return Promise.reject(new Error('Invalid arguments'));
  }
  const user = new User(data);
  // console.log('user', user)
  return user.save()
  .then((result) => sendWelcomeEmail(data.email, data.name)
    .then(() => ({
      message: 'User created',
      userId: result.id
    }))
  ).catch((err) => Promise.reject(err));
}

export async function updateUser(id, data) {
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

export function resetPassword(email) {
  if (!email) {
    return Promise.reject(new Error('Invalid email'));
  }
  //some operations
  return sendPasswordResetEmail(email);
}
