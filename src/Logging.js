let logging = true;
let logTrace = false;

function log(...args) {
  console.log(args);
  if (logging) {
    if (logTrace) {
      console.log(...args, new Error().stack.replace("Error", ""));
    } else {
      console.log(...args);
    }
  }
}

function trace(...args) {
  if (logging) {
    console.trace(...args);
  }
}

export { log, trace };