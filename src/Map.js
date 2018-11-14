function inst() {
  let map = {};
  return Object.freeze({
    entries() {
      return Object.keys(map).map(k => {
        return {
          k,
          v: map[k]
        }
      });
    },
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