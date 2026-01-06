const { User } = require('../models/user');

module.exports.login = async (req, res) => {
  const userToLogIn = await User.findOne({ email: req.body.email });

  if (!userToLogIn) {
    return res.status(401).json({ message: authFailedMsg });
  }
}
