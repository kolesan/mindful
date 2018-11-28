import * as audio from './Audio';
import * as Map from './utils/Map';
import * as utils from "./utils/Utils";

let callbackDictionary = Map.inst()
  .put("noop", utils.noop)
  .put("fgong", audio.fgong)
  .put("ffgong", audio.ffgong)
  .put("sgong", audio.sgong)
  .put("fsgong", audio.fsgong);

export { callbackDictionary }