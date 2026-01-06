export function add(a, b) {
    return a + b;
}

export function addCallback (a, b, callback) {
  setTimeout(() => callback(null, a + b), 500);
}

export function addPromise (a, b) {
  // return Promise.reject(new Error('fake'));
  return Promise.resolve(a + b);
}

// spy on log
export function foo () {
  // some operation
  console.log('console.log was called');
  console.warn('console.warn was called');
  return;
}

// stub createfile
export async function bar (fileName) {
  await createFile(fileName);
  const result = await callDB(fileName);

  return result;
}

export function createFile(fileName) {
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
