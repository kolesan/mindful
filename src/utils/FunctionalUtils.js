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