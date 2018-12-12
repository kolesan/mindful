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

export function px(v) {
  return v + "px";
}

export function noop() {}

export function fade(cmp, from, to, delay, duration, easing, onFinish = noop) {
  cmp.style.opacity = from;
  let animation = cmp.animate(
    [
      { opacity: from },
      { opacity: to }
    ],
    { delay, duration, easing }
  );
  animation.onfinish = () => {
    cmp.style.opacity = to;
    onFinish(cmp);
  }
}

export function last(arr) {
  return arr[arr.length - 1];
}

export function noSpaces(s) {
  return s.replace(/\s/g, "");
}