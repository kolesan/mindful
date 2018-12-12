import { createElement } from "../utils/HtmlUtils";
import { px } from "../utils/Utils";

export function markPoint({x, y, d = 5, color = "red", opacity = 1}) {
  console.log("Marking point", {x, y, d, color});
  let point = createElement("div", "debug_point");
  point.style.top = px(y);
  point.style.left = px(x);
  point.style.width = px(d);
  point.style.height = px(d);
  point.style.backgroundColor = color;
  point.style.opacity = opacity;
  document.body.appendChild(point);
}