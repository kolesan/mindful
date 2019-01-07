export function pp(o) {
  return JSON.stringify(o, undefined, "  ");
}

export function log(...args) {
  console.log(...args)
}

export function logo(o) {
  console.log(pp(o))
}

export function noop() {
  return Function.prototype;
}

export function last(arr) {
  return arr[arr.length-1];
}