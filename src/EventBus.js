let instance = instantiate();

function instantiate() {
  let listeners = [];
  return Object.freeze({
    fire: function(eventType, ...args) {
      listeners.forEach((listener) => {
        if (listener.type == eventType) {
          listener.evoke(args);
        }
      })
    },
    bindListener: function(listener) {
      if (!listener.evoke) {
        throw Error("Provided listener object does not contain required 'evoke' function");
      }
      if (!listener.type) {
        throw Error("Provided listener object does not contain required 'type' property");
      }
      listeners.push(listener);
    }
  });
}

function listener(type, callback) {
  return {
    type,
    evoke: callback
  }
}

export { instance, listener };