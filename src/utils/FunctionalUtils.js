import { log } from "./Logging";

export function Identity(value) {
  return {
    value,
    map(fn) {
      return Identity(fn(value));
    }
  }
}

export function trace(v) {
  console.log("Tracing: ", v);
  return v;
}

export function optional(v) {
  return Object.freeze({
    get value() { return v },
    ifPresent(fn) {
      if (v !== undefined) {
        fn(v)
      }
      return this;
    },
    ifEmpty(fn) {
      if (v === undefined) {
        fn();
      }
      return this;
    },
    or(o) {
      if (v) {
        return v;
      }
      return o;
    }
  });
}