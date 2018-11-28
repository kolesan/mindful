import './edit_screen.css';

import { createComponent, removeComponent } from '../utils/HtmlUtils';
import * as Map from '../utils/Map';
import * as Storage from '../Storage';
import * as Drawer from '../drawer/DrawerMenu';
import * as EventBus from '../utils/EventBus';
import { parseTime } from '../utils/TimeUtils';
import * as InputValidator from "../text_input/InputValidator";
import {fgong, sgong} from "../EventCallbacks";

export { onShow };
function onShow(programId) {
  titleValidator.validate();
}

export const Tools = {
  loop: "loop",
  event: "event"
};

const TRASH_ICON = "fas fa-drumstick-bite";
const LOOP_ICON = "fas fa-undo-alt";
const EVENT_ICON = "fas fa-bell";
export const PROGRAM_SAVED_EVENT = "PROGRAM_SAVED_EVENT";

let dragging = false;
let tool;
let originalToolStyle;
let movable;
let placeholder;
let showingPlaceholder = false;
let overProgram = false;

let count = 1;

let editorScreen = document.querySelector("#editScreen");

let loop = editorScreen.querySelector("#loopTool");
let event = editorScreen.querySelector("#eventTool");
let programEditor = editorScreen.querySelector(".program__editor");
let headingSection = editorScreen.querySelector(".program__heading");
let trashcan = editorScreen.querySelector(".tools__trash_can");
loop.addEventListener("mousedown", draggableMouseDownListener(Tools.loop));
event.addEventListener("mousedown", draggableMouseDownListener(Tools.event));

let menuBtn = editorScreen.querySelector("button[name=menuBtn]");
menuBtn.addEventListener("click", Drawer.toggleDrawerState);

let saveBtn = editorScreen.querySelector("#saveBtn");
saveBtn.addEventListener("click", saveProgram);

function validString(s) {
  return /^[a-zA-Z0-9-_\ ]*$/.test(s);
}

function markInvalid(input) {
  input.style.borderBottomColor = "red";
}
function markValid(input) {
  input.style.borderBottomColor = "";
}

let programTitles = loadProgramTitles();
function loadProgramTitles() {
  return Storage.loadPrograms().map(program => program.title);
}

let emptyStringValidation = InputValidator.validationWithStaticErrorMessage(
  notEmpty, "Program title is required"
);
let alphanumericValidation = InputValidator.validationWithStaticErrorMessage(
  validString, "Only alphanumeric characters, spaces, dashes and underscores allowed"
);
let uniqueTitleValidation = InputValidator.validationWithStaticErrorMessage(
  uniqueTitle, "Program with such name already exists"
);

let programTitleInput = editorScreen.querySelector(".basic_program_data input[name=programTitle]");
var titleValidator = InputValidator.inst(programTitleInput)
  .bindValidation(emptyStringValidation)
  .bindValidation(alphanumericValidation)
  .bindValidation(uniqueTitleValidation)
  .onFail(markInvalid)
  .onSuccess(markValid)
  .triggerOn("input");

function uniqueTitle(title) {
  let titleWithoutSpaces = noSpaces(title);
  return !programTitles.find(it => noSpaces(it) == titleWithoutSpaces);

  function noSpaces(s) {
    return s.replace(" ", "");
  }
}
function notEmpty(s) {
  return !/^\s*$/.test(s);
}

let mainEventNameInput = headingSection.querySelector("[name=mainEventNameInput");
InputValidator.inst(mainEventNameInput)
  .bindValidation(alphanumericValidation)
  .onFail(markInvalid)
  .onSuccess(markValid)
  .triggerOn("input");


function saveProgram() {
  let icon = editorScreen.querySelector(".basic_program_data button[name=selectIconBtn]").dataset.icon;
  let title = programTitleInput.value;
  let mainEvent = {
    name: mainEventNameInput.value,
    duration: parseTime(headingSection.querySelector("[name=mainEventDurationInput").value),
    callback: sgong
  };
  mainEvent.children = generateChildElements(programEditor.children);

  let program = {
    id: noSpaces(title),
    title,
    icon,
    description: "",
    mainEvent
  };
  console.log(program);
  Storage.saveProgram(program);
  EventBus.globalInstance.fire(PROGRAM_SAVED_EVENT, program);
  programTitles = loadProgramTitles();
}

function generateChildElements(viewChildren) {
  let viewElements = Array.from(viewChildren).filter(it => it.classList.contains("program__element"));
  let programElements = [];
  viewElements.forEach(viewElement => {
    console.log(viewElement);
    let tool = viewElement.dataset.element;
    let programElement = {element: tool};
    switch(tool) {
      case Tools.loop:
        let iterations = viewElement.querySelector("[name=iterationsInput").value;
        Object.assign(programElement, {iterations});
        break;
      case Tools.event:
        let name = viewElement.querySelector("[name=eventNameInput").value;
        let duration = parseTime(viewElement.querySelector("[name=eventDurationInput").value);
        Object.assign(programElement, {name, duration, callback: fgong});
        break;
    }
    programElement.children = generateChildElements(viewElement.children);
    console.log(programElement);
    programElements.push(programElement);
  });
  return programElements;
}
let dragHereCmp = dragHereHelpTextCmp();
function dragHereHelpTextCmp() {
  let wrapper = createComponent("div", "program__drag_here_txt_wrapper");
  wrapper.appendChild(createComponent("div", "program__drag_here_txt", "Drag items here to construct program"));
  return wrapper;
}
showDragHereTxt();

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
  let offsetX = mouseDownEvent.x - node.getBoundingClientRect().left;
  let offsetY = mouseDownEvent.y - node.getBoundingClientRect().top;
  let data = Map.inst();

  let dragImg = null;
  setDragImage(node.cloneNode(true));
  dragImg.style.width = node.getBoundingClientRect().width + "px";

  move(mouseDownEvent.x, mouseDownEvent.y);

  return Object.freeze({
    get offset() { return {x: offsetX, y: offsetY} },
    get data() { return data; },
    get style() { return dragImg.style },
    set style(style) { dragImg.style = style },
    get dragImage() { return dragImg },
    set dragImage(img) {
      setDragImage(img)
    },
    move,
    offsetBy(x, y) {
      offsetX = x;
      offsetY = y;
    },
    centerOn(x, y) {
      let rect = dragImg.getBoundingClientRect();
      offsetX = rect.width / 2;
      offsetY = rect.height / 2;
      move(x, y);
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

  function move(x, y) {
    dragImg.style.left = x - offsetX + "px";
    dragImg.style.top = y - offsetY + "px";
  }

  function intersects(a, b) {
    return !(a.left > b.right || a.right < b.left || a.top > b.bottom || a.bottom < b.top);
  }
}

function isCursorInside(event, elem, threshold) {
  return inside({x: event.x, y: event.y}, elem, threshold);
}

function inside(point, elem, threshold = 0) {
  let elemRect = elem.getBoundingClientRect();
  return point.x >= (elemRect.left - threshold) && point.x <= (elemRect.right + threshold) &&
    point.y >= (elemRect.top - threshold) && point.y <= (elemRect.bottom + threshold);
}

function createPlaceholder(draggable) {
  let placeholder = createComponent("div", `program__element program__element__placeholder`);
  placeholder.style.height = draggable.getBoundingClientRect().height + "px";
  return placeholder;
}

let offsetSave;
let dragImgSave;
let alreadyTrash = false;
window.addEventListener("mousemove", event => {
  if (dragging) {
    if (isCursorInside(event, trashcan, 24)) {
      if (!alreadyTrash) {
        alreadyTrash = true;
        dragImgSave = movable.dragImage;
        offsetSave = movable.offset;
        movable.dragImage = trashImage;
        movable.centerOn(event.x, event.y);
      } else {
        movable.move(event.x, event.y);
      }
    } else {
      alreadyTrash = false;
      if (dragImgSave) {
        movable.dragImage = dragImgSave;
        dragImgSave = null;
        movable.offsetBy(offsetSave.x, offsetSave.y);
      }
      movable.move(event.x, event.y);
    }
    overProgram = movable.over(programEditor);
    if (overProgram) {
      showPlaceholder(programEditor);
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
    if (programEditor.children.length > 0) {
      hideDragHereTxt();
    } else {
      showDragHereTxt();
    }
    movable.destroy();
    movable = undefined;
    tool.style = originalToolStyle;
    dragging = false;
    dragImgSave = null;
    alreadyTrash = false;
    removePlaceholder();
  }
});
function hideDragHereTxt() {
  removeComponent(dragHereCmp);
}
function showDragHereTxt() {
  programEditor.appendChild(dragHereCmp);
}

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

let trashImage = trashImageElement();
function trashImageElement() {
  let elem = createComponent("div", `program__element`);
  elem.appendChild(iconCmp(TRASH_ICON));
  elem.style.width = "3rem";
  elem.style.height = "3rem";
  return elem;
}
function createElement(tool) {
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
  input.setAttribute("name", "iterationsInput");
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
function nameInputCmp(name = `Timer${count++}`) {
  let input = createComponent("input", "text_input peh__name_input");
  input.setAttribute("type", "text");
  input.setAttribute("spellcheck", "false");
  input.setAttribute("name", "eventNameInput");
  input.value = name;
  input.addEventListener("mousedown", event => event.stopPropagation());

  InputValidator.inst(input)
    .bindValidation(alphanumericValidation)
    .onFail(markInvalid)
    .onSuccess(markValid)
    .triggerOn("input");

  return input;
}
function durationInputCmp() {
  let input = createComponent("input", "text_input peeh__duration_input");
  input.setAttribute("type", "time");
  input.setAttribute("step", "1000");
  input.setAttribute("name", "eventDurationInput");
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