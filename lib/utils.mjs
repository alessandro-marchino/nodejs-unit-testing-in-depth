import { secret } from './config.mjs';
import { createHash } from 'node:crypto';

// foo = 1f0c01e25707f55ed3014d60bd0d0373
export function getHash(string) {
  if(!string || typeof string !== 'string') {
    return null;
  }
  string += '_' + secret();
  const hash = createHash('md5').update(string).digest('hex');
  // console.log('Hash: ' , hash);
  return hash;
};
