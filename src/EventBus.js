let globalInstance = instantiate();

function instantiate() {
  let listeners = [];
  return Object.freeze({
    fire: function(eventType, ...args) {
      listeners.forEach((listener) => {
        if (listener.type == eventType) {
          listener.evoke(...args);
        }
      })
    },
    bindListener: function(listener) {
      validateListener(listener);
      listeners.push(listener);
    }
  });
}

function validateListener(listener) {
  if (!listener) {
    throw Error(`Trying to bind invalid listener object '${listener}'`);
  }
  if (!listener.evoke) {
    throw Error("Provided listener object does not contain required 'evoke' function");
  }
  if (!listener.type) {
    throw Error("Provided listener object does not contain required 'type' property");
  }
}

function listener(type, callback) {
  return {
    type,
    evoke: callback
  }
}

export { globalInstance, instantiate, listener };