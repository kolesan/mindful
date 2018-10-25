let logging = true;

function log(...args) {
  if (logging) {
    console.log(...args);
  }
}

function trace(...args) {
  if (logging) {
    console.trace(...args);
  }
}

export { log, trace };