import * as audio from './Audio';
import * as utils from "./utils/Utils";
import newCallbackDictionary from './utils/CallbackDictionary';

const noop = "noop";
const fgong = "fgong";
const ffgong = "ffgong";
const sgong = "sgong";
const fsgong = "fsgong";


const callbackDictionary = newCallbackDictionary(new Map()
  .set(noop, utils.noop)
  .set(fgong, audio.fgong)
  .set(ffgong, audio.ffgong)
  .set(sgong, audio.sgong)
  .set(fsgong, audio.fsgong)
);


export { noop, fgong, ffgong, sgong, fsgong, callbackDictionary }