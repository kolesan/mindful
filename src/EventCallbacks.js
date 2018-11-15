import * as audio from './timer_screen/Audio';
import * as Map from './utils/Map';

let callbackDictionary = Map.inst()
  .put("fgong", audio.fgong)
  .put("ffgong", audio.ffgong)
  .put("sgong", audio.sgong)
  .put("fsgong", audio.fsgong);

export { callbackDictionary }