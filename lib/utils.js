const config = require('./config.js');
const crypto = require('crypto');

// foo = 1f0c01e25707f55ed3014d60bd0d0373
module.exports.getHash = (string) => {
  if(!string || typeof string !== 'string') {
    return null;
  }
  string += '_' + config.secret();
  const hash = crypto.createHash('md5').update(string).digest('hex');
  // console.log('Hash: ' , hash);
  return hash;
};
