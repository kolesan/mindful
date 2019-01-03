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

export function fade({cmp, from, to, delay = 0, duration, easing = "ease-in-out", onFinish = noop}) {
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

export function isNormalNumber(v) {
  return typeof v == "number" && !Number.isNaN(v) && Number.isFinite(v);
}

export function last(arr) {
  if (!arr || arr.length == 0) {
    return;
  }
  return arr[arr.length - 1];
}

export function noSpaces(s) {
  return s.replace(/\s/g, "");
}

export function isFn(o) {
  return Function.isPrototypeOf(o);
}

export function arr(o) {
  return (o && Array.from(o)) || [];
}

export function rect(x, y, w, h) {
  return {
    x, y, w, h,
    get left() { return this.x },
    get right() { return this.x + this.w },
    get top() { return this.y },
    get bottom() { return this.y + this.h },
    get centerX() { return this.x + this.w / 2 },
    get centerY() { return this.y + this.h / 2 }
  };
}
export function point(x, y) {
  return {x, y};
}