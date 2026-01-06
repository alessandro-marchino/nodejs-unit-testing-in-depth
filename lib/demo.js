module.exports.add = (a, b) => {
    return a + b;
}

module.exports.addCallback  = (a, b, callback) => {
  setTimeout(() => callback(null, a + b), 500);
}

module.exports.addPromise  = (a, b) => {
  // return Promise.reject(new Error('fake'));
  return Promise.resolve(a + b);
}

// spy on log
module.exports.foo  = () => {
  // some operation
  console.log('console.log was called');
  console.warn('console.warn was called');
  return;
}

// stub createfile
module.exports.bar = async (fileName) => {
  await module.exports.createFile(fileName);
  const result = await callDB(fileName);

  return result;
}

module.exports.createFile = (fileName) => {
  console.log('---in createFile')
  // fake create file
  return new Promise((resolve) => setTimeout(() => {
    console.log('fake file created');
    return Promise.resolve('done');
  }, 100));
}

function callDB(fileName) {
  console.log('---in callDB')
  // fake create file
  return new Promise((resolve) => setTimeout(() => {
    console.log('fake db call');
    resolve('saved');
  }, 100));
}
