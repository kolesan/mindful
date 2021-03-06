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

function orable(v) {
  return {
    get value() { return v },
    orElse(fn) {
      if (v !== undefined) {
        return v;
      }
      return fn();
    }
  };
}

export function optional(v) {
  return {
    get value() { return v },
    isEmpty() {
      return v === undefined;
    },
    ifPresent(fn) {
      if (v !== undefined) {
        fn(v)
      }
      return this;
    },
    ifPresentReturn() {
      return orable(v);
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
  };
}