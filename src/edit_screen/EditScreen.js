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
let trashcan = document.querySelector(".tools__trash_can");
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
  let data = Map.inst();

  let dragImg = null;
  setDragImage(node.cloneNode(true));
  dragImg.style.width = node.getBoundingClientRect().width + "px";

  moveDragImg(mouseDownEvent.x - clickX, mouseDownEvent.y - clickY);

  return Object.freeze({
    get data() { return data; },
    get style() { return dragImg.style },
    set style(style) { dragImg.style = style },
    move(x,  y) {
      moveDragImg(x - clickX, y - clickY);
    },
    get dragImage() { return dragImg },
    set dragImage(img) {
      setDragImage(img)
    },
    centerOn(x, y) {
      let rect = dragImg.getBoundingClientRect();
      clickX = rect.width / 2;
      clickY = rect.height / 2;
      this.move(x, y);
    },
    destroy() {
      removeComponent(dragImg);
    },
    over(elem) {
      return intersects(dragImg.getBoundingClientRect(), elem.getBoundingClientRect());
    },
    centerIsInside(elem, threshold = 0) {
      // console.log({inside: inside(center(dragImg), elem), center: center(dragImg), threshold, elem});
      return inside(center(dragImg), elem, threshold);
    },
    centerIsAbove(elem) {
      return center(dragImg).y < center(elem).y;
    }
  });
  function setDragImage(img) {
    removeComponent(dragImg);
    dragImg = img;
    dragImg.style.position = "absolute";
    dragImg.style.margin = "0";
    document.querySelector("body").appendChild(dragImg);
  }
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

  function moveDragImg(x, y) {
    dragImg.style.top = y + "px";
    dragImg.style.left = x + "px";
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

let dragImgSave;
let alreadyTrash = false;
window.addEventListener("mousemove", event => {
  if (dragging) {
    if (movable.centerIsInside(trashcan, 10)) {
      if (!alreadyTrash) {
        alreadyTrash = true;
        // elemStyle = movable.style;
        // x = elemStyle.left;
        // y = elemStyle.top;

        // movable.style.width = "3rem";
        // movable.style.height = "3rem";
        // movable.style.overflow = "hidden";
        console.log(dragImgSave);
        dragImgSave = movable.dragImage;
        movable.dragImage = trashImage;
        // console.log(trashImage);
        movable.centerOn(event.x, event.y);
      } else {
        movable.move(event.x, event.y);
      }
    } else {
      alreadyTrash = false;
      if (dragImgSave) {
        movable.dragImage = dragImgSave;
        dragImgSave = null;
        movable.centerOn(event.x, event.y);
      }
      movable.move(event.x, event.y);
    }
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
    dragImgSave = null;
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
      newElem = createElement(Tools.loop);
      newElem.appendChild(loopHeadingCmp());
      break;
    case Tools.event:
      newElem = createElement(Tools.event);
      newElem.appendChild(eventHeadingCmp());
      break;
  }
  newElem.dataset.element = tool;
  placeholder.parentNode.insertBefore(newElem, placeholder);
}

const TRASH_ICON = "fas fa-drumstick-bite";
let trashImage = trashImageElement();
function trashImageElement() {
  let elem = createComponent("div", `program__element`);
  elem.appendChild(iconCmp(TRASH_ICON));
  elem.style.width = "3rem";
  elem.style.height = "3rem";
  return elem;
}
let count = 1;
function createElement(tool, icon) {
  let elem = createComponent("div", `program__element program__element__${tool}`);
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
function loopHeadingCmp() {
  let heading = createComponent("div", "pel__heading");
  heading.appendChild(iconCmp(LOOP_ICON));
  heading.appendChild(loopIterationsInputCmp());
  return heading;
}
function loopIterationsInputCmp() {
  let input = createComponent("input", "text_input peh__iterations_input");
  input.setAttribute("type", "number");
  input.value = `2`;
  input.addEventListener("mousedown", event => event.stopPropagation());

  let label = createComponent("label", "", "x");
  label.appendChild(input);
  return label;
}
function eventHeadingCmp() {
  let heading = createComponent("div", "pee__heading");
  heading.appendChild(iconCmp(EVENT_ICON));
  heading.appendChild(nameInputCmp());
  heading.appendChild(durationInputCmp());
  return heading;
}
function nameInputCmp() {
  let input = createComponent("input", "text_input peh__name_input");
  input.setAttribute("type", "text");
  input.value = `Timer${count}`;
  input.addEventListener("mousedown", event => event.stopPropagation());
  return input;
}
function durationInputCmp() {
  let input = createComponent("input", "text_input peeh__duration_input");
  input.setAttribute("type", "time");
  input.setAttribute("step", "1000");
  input.value = `00:00:00`;
  input.addEventListener("mousedown", event => event.stopPropagation());
  return input;
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