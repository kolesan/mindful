import { log } from "../../utils/Logging";

import storage from '../Storage';

export default Object.assign(Object.create(storage), {
  put(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
  },
  get(name) {
    return JSON.parse(localStorage.getItem(name));
  },
  remove(name) {
    localStorage.removeItem(name);
  }
});