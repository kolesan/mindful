export function minmax(min, max) {
  return function(val) {
    return Math.max(Math.min(val, max), min);
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

export function isNormalPositiveNumber(v) {
  return typeof v == "number" && !Number.isNaN(v) && Number.isFinite(v) && v > 0;
}

export function last(arr) {
  if (!arr || arr.length == 0) {
    return;
  }
  return arr[arr.length - 1];
}

export function noSpaces(s) {
  if (typeof s !== "string") {
    return;
  }
  return s.replace(/\s/g, "");
}

export function isFn(o) {
  return typeof o === "function";
}

export function arr(o) {
  return (o && Array.from(o)) || [];
}

export function assignDefinedProperties(target, ...sources) {
  sources.forEach(source => {
    Object.entries(source).forEach(([k, v]) => {
      if (v !== undefined) {
        target[k] = v;
      }
    })
  });
  return target;
}