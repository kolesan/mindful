export function minmax(min, max) {
  return function(val) {
    return Math.max(Math.min(val, max), min);
  }
}

export function parseTime(timeString) {
  let timeArray = timeString.split(":");
  let h = Number(timeArray[0]) || 0;
  let m = Number(timeArray[1]) || 0;
  let s = Number(timeArray[2]) || 0;
  return h*1000*60*60 + m*1000*60 + s*1000;
}

export function formatTime(timestamp) {
  const sd = 1000;
  const md = sd*60;
  const hd = md*60;

  function div(a, b) {
    return Math.floor(a / b);
  }

  function format(num) {
    let prefix = "";
    if (num < 10) {
      prefix = "0";
    }
    return prefix + num;
  }

  let h = div(timestamp, hd);
  timestamp -= h*hd;

  let m = div(timestamp, md);
  timestamp -= m*md;

  let s = div(timestamp, sd);

  return `${format(h)}:${format(m)}:${format(s)}`;
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

export function createComponent(tag, styles, content) {
  let elem = document.createElement(tag);
  styles.forEach(function(it) {
    elem.classList.add(it);
  });
  if (content) {
    elem.innerHTML = content;
  }
  return elem;
}

export function removeComponent(node) {
  node.parentNode.removeChild(node);
}