import * as Map from './Map';

let globalInstance = instantiate();

function instantiate() {
  let listeners = Map.inst();
  return Object.freeze({
    fire: function(eventType, ...args) {
      let listenersOfType = listeners.get(eventType);
      if (listenersOfType) {
        listenersOfType.forEach(listener => listener(...args));
      }
    },
    bindListener: function(eventType, listener) {
      validateListener(listener);
      let listenersOfType = listeners.get(eventType);
      if (listenersOfType) {
        listenersOfType.push(listener);
      } else {
        listeners.put(eventType, [listener]);
      }
    }
  });
}

function validateListener(listener) {
  if (!Function.prototype.isPrototypeOf(listener)) {
    throw Error(`Trying to bind invalid listener object '${listener}'`);
  }
}

export { globalInstance, instantiate };