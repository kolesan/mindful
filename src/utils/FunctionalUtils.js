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
    get v() { return v },
    ifPresent(fn) {
      if (v) {
        fn(v)
      }
      return this;
    },
    ifEmpty(fn) {
      if (!v) {
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