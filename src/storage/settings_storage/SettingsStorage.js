import localStorage from '../local_storage/LocalStorage';
import defaultSettings from '../../settings/Settings';
import { optional } from '../../utils/FunctionalUtils';

const SETTINGS_KEY = "settings";

export default inst(localStorage);

export function inst(storage) {
  return Object.freeze({
    load() {
      let settings = optional(storage.get(SETTINGS_KEY))
        .or(defaultSettings);
      return { ...settings };
    },
    save(settings) {
      let oldSettings = optional(storage.get(SETTINGS_KEY))
        .or(defaultSettings);
      let mergedSettings = Object.assign({}, oldSettings, settings);
      storage.put(SETTINGS_KEY, mergedSettings);
    }
  });
}