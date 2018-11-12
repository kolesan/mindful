function inst() {
  let map = {};
  return Object.freeze({
    put(k, v) {
      map[String(k)] = v;
      return this;
    },
    get(k) {
      return map[String(k)]
    }
  });
}

export { inst };