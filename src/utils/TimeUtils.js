import { div } from "./MathUtils";
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

export function timeObject(h = 0, m = 0, s = 0, ms = 0) {
  return {
    h, m, s, ms,
    get timestamp() {
      return this.h * hd + this.m * md + this.s * sd + this.ms;
    },
    toString() {
      let h  = cond(this.h,  "h");
      let m  = cond(this.m,  "m");
      let s  = cond(this.s,  "s");
      let ms = cond(this.ms, "ms");

      let durationString = [ms, s, m, h]
        .filter(it => it)
        .reduce((a, i) => (a === "" ? i : i + " " + a), "");

      return durationString ? durationString : "0ms";

      function cond(v, l) {
        return v ? v + l : "";
      }
    }
  }
}

export function timestampToTimeObject(timestamp) {
  let h = div(timestamp, hd);
  timestamp -= h*hd;
  let m = div(timestamp, md);
  timestamp -= m*md;
  let s = div(timestamp, sd);
  timestamp -= s*sd;

  return timeObject(h, m, s, timestamp);
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