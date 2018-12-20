import { minmax } from '../../utils/Utils';
import * as log from '../../utils/Logging';

const ZERO_VOLUME = 0;
const MAX_VOLUME = 100;
const UNMUTE_VOLUME = 15;
const DEFAULT_VOLUME = 65;

const minmaxVolume = minmax(ZERO_VOLUME, MAX_VOLUME);

function normalizeVolume(val = UNMUTE_VOLUME) {
  return minmaxVolume(val);
}

function newInstance(muted = false, volume = DEFAULT_VOLUME) {
  let _muted = muted;
  let _volume = volume;

  return Object.freeze({
    get muted() {
      return _muted;
    },
    set muted(muted) {
      _muted = muted;
      if (!muted && _volume == ZERO_VOLUME) {
        _volume = UNMUTE_VOLUME;
      }

      log.log({_muted, _volume});
    },

    get volume() {
      return _volume;
    },
    set volume(volume) {
      _volume = normalizeVolume(volume);
      _muted = _volume == ZERO_VOLUME;

      log.log({_muted, _volume});
    }
  });
}

export { newInstance };