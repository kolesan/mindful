import './edit_screen.css';

import { createComponent, removeComponent } from '../utils/HtmlUtils';

let loop = document.querySelector("#loopTool");
let event = document.querySelector("#eventTool");
let program = document.querySelector(".program__editor");

const Tools = {
  loop: "loop",
  event: "event"
};

let dragging = false;
let tool;
let originalToolStyle;
let movable;
// let clickX = 0;
// let clickY = 0;

//Pick up tool
loop.addEventListener("mousedown", event => {
  tool = event.currentTarget;

  //Create element that will float under mouse
  movable = draggable(event);
  movable.move(event.x, event.y);

  //Paint picked up element differently
  originalToolStyle = tool.style;
  tool.style.opacity = 0.7;
  tool.style.border = "1px dashed gray";

  dragging = true;
});


function draggable(mouseDownEvent) {
  let node = mouseDownEvent.currentTarget;
  let clone = node.cloneNode(true);
  let rect = node.getBoundingClientRect();
  let clickX = mouseDownEvent.x - rect.left;
  let clickY = mouseDownEvent.y - rect.top;

  clone.style.position = "absolute";
  clone.style.margin = "0";
  document.querySelector("body").appendChild(clone);

  return Object.freeze({
    move(x, y) {
      // console.log({x, y, clickX, clickY});
      clone.style.top = y - clickY + "px";
      clone.style.left = x - clickX + "px";
    },
    destroy() {
      removeComponent(clone);
    },
    over(elem) {
      return intersect(clone.getBoundingClientRect(), elem.getBoundingClientRect())
    }
  });

  function intersect(a, b) {
    return !(a.left > b.right || a.right < b.left || a.top > b.bottom || a.bottom < b.top);
  }
}

function droppable(node) {
  return Object.freeze({
    under() {

    }
  })
}

let placeholder = createComponent("div", `program__element program__element__${tool}`);
placeholder.style.border = "2px dashed gray";
placeholder.style.opacity = "0.8";
let showingPlaceholder = false;

window.addEventListener("mousemove", event => {
  if (dragging) {
    movable.move(event.x, event.y);
    let overProgram = movable.over(program);
    if (overProgram) {
      if (!showingPlaceholder) {
        program.appendChild(placeholder);
        showingPlaceholder = true;
      }
    } else {
      if (showingPlaceholder) {
        removeComponent(placeholder);
        showingPlaceholder = false;
      }
    }
    console.log({overProgram: overProgram});
  }
});

window.addEventListener("mouseup", event => {
  if (dragging) {

    movable.destroy();
    movable = undefined;

    tool.style = originalToolStyle;

    dragging = false;
  }
});

program.addEventListener("mouseenter", event => {
  // console.log("program enter", event)
});
program.addEventListener("mouseover", event => {
  // console.log("program over", event)
});
program.addEventListener("mousemove", event => {
  // console.log("program move", event)
});