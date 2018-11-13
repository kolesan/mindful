import * as audio from './Audio';

let callbackDictionary = {
  fgong: audio.fgong,
  ffgong: audio.ffgong,
  sgong: audio.sgong,
  fsgong: audio.fsgong
};

console.log(callbackDictionary);
export { callbackDictionary }