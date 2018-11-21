import './edit_screen.css';

import { createComponent, removeComponent } from '../utils/HtmlUtils';
import * as Map from '../utils/Map';

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
let placeholder;
let showingPlaceholder = false;
let overProgram = false;

//Pick up tool
loop.addEventListener("mousedown", event => {
  tool = event.currentTarget;

  //Create element that will float under mouse
  movable = draggable(event);
  movable.data.put("tool", Tools.loop);

  //Paint picked up element differently
  originalToolStyle = tool.style;
  tool.style.opacity = 0.7;
  tool.style.border = "1px dashed gray";

  dragging = true;
  placeholder = createPlaceholder(tool);
});


function draggable(mouseDownEvent) {
  let node = mouseDownEvent.currentTarget;
  let clickX = mouseDownEvent.x - node.getBoundingClientRect().left;
  let clickY = mouseDownEvent.y - node.getBoundingClientRect().top;
  let dragImg = node.cloneNode(true);
  let data = Map.inst();

  dragImg.style.position = "absolute";
  dragImg.style.margin = "0";
  document.querySelector("body").appendChild(dragImg);
  move(mouseDownEvent.x, mouseDownEvent.y);

  return Object.freeze({
    get data() { return data; },
    move,
    destroy() {
      removeComponent(dragImg);
    },
    over(elem) {
      return intersects(dragImg.getBoundingClientRect(), elem.getBoundingClientRect());
    },
    compareY(elem) {
      let elemCenter = centerY(elem);
      let dragImgCenter = centerY(dragImg);

      if (dragImgCenter < elemCenter) {
        return -1;
      } else if (dragImgCenter > elemCenter) {
        return 1;
      }
      return 0;
    },
    centerIsInside(elem, threshold) {
      console.log({inside: inside(center(dragImg), elem), center: center(dragImg), threshold, elem});
      return inside(center(dragImg), elem, threshold);
    },
    centerIsAbove(elem) {
      return center(dragImg).y < center(elem).y;
    }
  });

  function center(elem) {
    let rect = elem.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function inside(point, elem, threshold) {
    let elemRect = elem.getBoundingClientRect();
    return point.x >= (elemRect.left - threshold) && point.x <= (elemRect.right + threshold) &&
           point.y >= (elemRect.top - threshold) && point.y <= (elemRect.bottom + threshold);
  }

  function move(x, y) {
    dragImg.style.top = y - clickY + "px";
    dragImg.style.left = x - clickX + "px";
  }

  function intersects(a, b) {
    return !(a.left > b.right || a.right < b.left || a.top > b.bottom || a.bottom < b.top);
  }

}

function droppable(node) {
  return Object.freeze({
    under() {

    }
  })
}


function createPlaceholder(tool) {
  let placeholder = createComponent("div", `program__element program__element__placeholder`);
  placeholder.style.height = tool.getBoundingClientRect().height + "px";
  return placeholder;
}

window.addEventListener("mousemove", event => {
  if (dragging) {
    movable.move(event.x, event.y);
    overProgram = movable.over(program);
    if (overProgram) {
      showPlaceholder(program);
    } else {
      removePlaceholder();
    }
    // console.log({overProgram: overProgram});
  }
});


let elemNearPlaceholder;
function showPlaceholder(parent) {
  for(let child of parent.children) {
    if (!child.classList.contains("program__element") || child.classList.contains("program__element__placeholder")) {
      continue;
    }
    if (movable.centerIsInside(child, -5)) {
      showPlaceholder(child);
      showingPlaceholder = true;
      return;
    }
    if (movable.centerIsAbove(child)) {
      parent.insertBefore(placeholder, child);
      showingPlaceholder = true;
      return;
    }
  }
  parent.appendChild(placeholder);
  showingPlaceholder = true;
}
function removePlaceholder() {
  if (showingPlaceholder) {
    removeComponent(placeholder);
    showingPlaceholder = false;
  }
}

window.addEventListener("mouseup", event => {
  if (dragging) {
    if (overProgram) {
      addTool(movable.data.get("tool"));
    }

    movable.destroy();
    movable = undefined;

    tool.style = originalToolStyle;

    dragging = false;

    removePlaceholder();
  }
});

const LOOP_ICON = "fas fa-undo-alt";
const EVENT_ICON = "fas fa-bell";
function addTool(tool) {
  let newElem;
  switch(tool) {
    case Tools.loop:
      newElem = createElement(Tools.loop, LOOP_ICON);
      break;
    case Tools.event:
      newElem = createElement(Tools.event, EVENT_ICON);
      break;
  }
  placeholder.parentNode.insertBefore(newElem, placeholder);
}

let count = 1;
function createElement(tool, icon) {
  let elem = createComponent("div", `program__element program__element__${tool}`, count++);
  elem.appendChild(iconCmp(icon));
  return elem;
}
function iconCmp(classes) {
  return createComponent("i", classes);
}

program.addEventListener("mouseenter", event => {
  // console.log("program enter", event)
});
program.addEventListener("mouseover", event => {
  // console.log("program over", event)
});
program.addEventListener("mousemove", event => {
  // console.log("program move", event)
});