import './edit_screen.css';

import { createComponent, removeComponent } from '../utils/HtmlUtils';
import * as Map from '../utils/Map';

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
let loop = document.querySelector("#loopTool");
let event = document.querySelector("#eventTool");
let program = document.querySelector(".program__editor");
loop.addEventListener("mousedown", draggableMouseDownListener(Tools.loop));
event.addEventListener("mousedown", draggableMouseDownListener(Tools.event));

function draggableMouseDownListener(toolName) {
  return event => {
    tool = event.currentTarget;

    //Create element that will float under mouse
    movable = draggable(event);
    movable.data.put("tool", toolName);

    //Paint picked up element differently
    originalToolStyle = tool.style;
    tool.style.opacity = 0.7;
    tool.style.border = "1px dashed gray";

    dragging = true;
    placeholder = createPlaceholder(tool);
  };
}

function draggable(mouseDownEvent) {
  let node = mouseDownEvent.currentTarget;
  let clickX = mouseDownEvent.x - node.getBoundingClientRect().left;
  let clickY = mouseDownEvent.y - node.getBoundingClientRect().top;
  let dragImg = node.cloneNode(true);
  let data = Map.inst();

  dragImg.style.position = "absolute";
  dragImg.style.margin = "0";
  dragImg.style.width = node.getBoundingClientRect().width + "px";

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
    centerIsInside(elem, threshold) {
      // console.log({inside: inside(center(dragImg), elem), center: center(dragImg), threshold, elem});
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


function createPlaceholder(draggable) {
  let placeholder = createComponent("div", `program__element program__element__placeholder`);
  placeholder.style.height = draggable.getBoundingClientRect().height + "px";
  return placeholder;
}

window.addEventListener("mousemove", event => {
  if (dragging) {
    movable.move(event.x, event.y);
    overProgram = movable.over(program);
    if (overProgram) {
      showPlaceholder(program);
      showingPlaceholder = true;
    } else {
      removePlaceholder();
    }
  }
});

function showPlaceholder(parent) {
  for(let child of parent.children) {
    if (!child.classList.contains("program__element") || child.classList.contains("program__element__placeholder")) {
      continue;
    }
    if (movable.centerIsInside(child, -5)) {
      showPlaceholder(child);
      return;
    }
    if (movable.centerIsAbove(child)) {
      parent.insertBefore(placeholder, child);
      return;
    }
  }
  parent.appendChild(placeholder);
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
      handleDrop(movable);
    }
    movable.destroy();
    movable = undefined;
    tool.style = originalToolStyle;
    dragging = false;
    removePlaceholder();
  }
});

function handleDrop(movable) {
  let tool = movable.data.get("tool");
  if (tool) {
    addTool(tool);
    return;
  }

  let element = movable.data.get("element");
  if (element) {
    putElement(element);
  }
}

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
  elem.addEventListener("mousedown", event => {
    event.stopPropagation();
    let element = event.currentTarget;

    dragging = true;
    movable = draggable(event);
    movable.data.put("element", element);

    showPlaceholderInsteadOf(element);
  });
  return elem;
}
function showPlaceholderInsteadOf(elem) {
  placeholder = createPlaceholder(elem);
  elem.parentNode.insertBefore(placeholder, elem);
  removeComponent(elem);
  showingPlaceholder = true;
}

function iconCmp(classes) {
  return createComponent("i", classes);
}
function putElement(element) {
  placeholder.parentNode.insertBefore(element, placeholder);
  removePlaceholder();
}