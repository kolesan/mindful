export function minmax(min, max) {
  return function(val) {
    return Math.max(Math.min(val, max), min);
  }
}

export function makeSetIconByStateFunction(iconElem, iconTrue, iconFalse) {
  return function(status) {
    if (status) {
      iconElem.classList.remove(iconFalse);
      iconElem.classList.add(iconTrue);
    } else {
      iconElem.classList.remove(iconTrue);
      iconElem.classList.add(iconFalse);
    }
  }
}

export function isArray(o) {
  return Array.prototype.isPrototypeOf(o);
}