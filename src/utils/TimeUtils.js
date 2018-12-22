const sd = 1000;
const md = sd*60;
const hd = md*60;

export function s(c) {
  return c*1000;
}
export function m(c) {
  return s(c)*60;
}
export function h(c) {
  return m(c)*60;
}

export function timeObject(h, m, s) {
  return {
    h, m, s,
    get timestamp() {
      return h * hd + m * md + s * sd;
    }
  }
}

export function timestampToTimeObject(timestamp) {
  let h = div(timestamp, hd);
  timestamp -= h*hd;
  let m = div(timestamp, md);
  timestamp -= m*md;
  let s = div(timestamp, sd);

  return timeObject(h, m, s);

  function div(a, b) {
    return Math.floor(a / b);
  }
}

export function formatTime(timestamp) {
  let {h, m, s} = timestampToTimeObject(timestamp);

  return `${format(h)}:${format(m)}:${format(s)}`;

  function format(num) {
    let prefix = "";
    if (num < 10) {
      prefix = "0";
    }
    return prefix + num;
  }
}