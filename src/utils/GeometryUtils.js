export function inside(point, elem, threshold = 0) {
  let elemRect = elem.getBoundingClientRect();
  return point.x >= (elemRect.left - threshold) && point.x <= (elemRect.right + threshold) &&
    point.y >= (elemRect.top - threshold) && point.y <= (elemRect.bottom + threshold);
}

export function center(elem) {
  let rect = elem.getBoundingClientRect();
  return point(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2
  );
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