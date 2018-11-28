import * as audio from './Audio';
import * as Map from './utils/Map';
import * as utils from "./utils/Utils";

const noop = "noop";
const fgong = "fgong";
const ffgong = "ffgong";
const sgong = "sgong";
const fsgong = "fsgong";

let callbackDictionary = Map.inst()
  .put(noop, utils.noop)
  .put(fgong, audio.fgong)
  .put(ffgong, audio.ffgong)
  .put(sgong, audio.sgong)
  .put(fsgong, audio.fsgong);

export { noop, fgong, ffgong, sgong, fsgong, callbackDictionary }