import { gzip, unGzip } from '../src';

const str =
  'hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world';

gzip(str).then((res) => {
  console.log('gzip', res);
  unGzip(res).then((res) => {
    console.log('ungzip', res, res === str);
  });
});
