function inst() {
  let map = {};
  return Object.freeze({
    findByValue(v) {
      for(let k of Object.keys(map)) {
        if (map[k] === v) {
          return k;
        }
      }
      return null;
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