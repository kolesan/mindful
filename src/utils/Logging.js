let logging = true;
let tracing = false;

function log(...args) {
  if (logging) {
    if (tracing) {
      console.log(...args, new Error().stack.replace("Error", ""));
    } else {
      console.log(...args);
    }
  }
}

function toggleLogging() {
  logging = !logging;
}
function toggleTracing() {
  tracing = !tracing;
}
export { toggleLogging, toggleTracing, log };