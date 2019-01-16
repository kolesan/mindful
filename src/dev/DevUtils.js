import { log } from '../utils/Logging';
import { createElement } from "../utils/HtmlUtils";
import { last, px } from "../utils/Utils";
import { noop } from "../EventCallbacks";
import ToolNames from "../edit_screen/tools/ToolNames";

export function programBuilder(name) {
  let program = newEvent(name, 0, noop);
  let elemStack = [program];
  return Object.freeze({
    loop(iterations) {
      addElem(newLoop(iterations));
      return this;
    },
    event(name, duration, callback = noop) {
      addElem(newEvent(name, duration, callback));
      return this;
    },
    end() {
      elemStack.pop();
      return this;
    },
    build() {
      program.duration = calculateDuration(program);
      return program;
    }
  });

  function calculateDuration(parent) {
    return parent.children.reduce((a, b) => {
      if (b.element == ToolNames.event) {
        return a + b.duration;
      } else {
        return a + calculateDuration(b) * b.iterations;
      }
    }, 0);
  }

  function addElem(elem) {
    let parent = last(elemStack);
    if (!parent) {
      throw new Error("DSL error, trying to add child to non existent parent. Check your 'end`s'.");
    }

    parent.children.push(elem);
    elemStack.push(elem);
  }
  function newLoop(iterations, children = []) {
    return { element: ToolNames.loop, iterations, children };
  }
  function newEvent(name, duration, callback, children = []) {
    return { element: ToolNames.event, name, duration, callback, children };
  }
}

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