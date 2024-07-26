import { ClArray } from '../src';

function* makeIterableOfPromises() {
  for (let i = 0; i < 5; i++) {
    yield new Promise((resolve) => setTimeout(() => resolve(i), 100));
  }
}

ClArray.fromAsync(makeIterableOfPromises()).then((res) => {
  console.log(res);
});
