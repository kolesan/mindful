import './edit_screen.css';

import { setIcon } from '../utils/HtmlUtils';
import * as Storage from '../Storage';
import * as Drawer from '../drawer/DrawerMenu';
import * as EventBus from '../utils/EventBus';
import * as InputValidator from "../text_input/InputValidator";
import { makeDraggable } from "./dragndrop/Draggable";
import * as ProgramEventsEditor from "./program_editor/ProgramEventsEditor";
import { alphanumericValidation, emptyStringValidation, markInvalid, markValid } from "../Validation";
import { noSpaces } from "../utils/Utils";
import { ToolNames } from "./tools/Tools";
import { newMainEvent } from "./program_editor/ProgramEventsEditor";

const PROGRAM_SAVED_EVENT = "PROGRAM_SAVED_EVENT";
const NEW_PROGRAM_SAVED_EVENT = "NEW_PROGRAM_SAVED_EVENT";

const TRASH_ICON = "fas fa-drumstick-bite";

let editScreen = document.querySelector("#editScreen");

let loop = editScreen.querySelector("#loopTool");
let event = editScreen.querySelector("#eventTool");

let programEditorContainer = editScreen.querySelector(".program_events");
let programEventsEditor = ProgramEventsEditor.inst(programEditorContainer);
let programTitles;
let programTitleInput = editScreen.querySelector(".basic_program_data input[name=programTitle]");

let uniqueTitleValidation = InputValidator.validationWithStaticErrorMessage(
  uniqueTitle, "Program with such name already exists"
);
function uniqueTitle(title) {
  let titleWithoutSpaces = noSpaces(title);
  return !programTitles.find(it => noSpaces(it) == titleWithoutSpaces);
}

let titleValidator = InputValidator.inst(programTitleInput)
  .bindValidation(emptyStringValidation)
  .bindValidation(alphanumericValidation)
  .bindValidation(uniqueTitleValidation)
  .onFail(markInvalid)
  .onSuccess(markValid)
  .triggerOn("input");


function asTransparentDashed(style) {
  style.opacity = 0.7;
  style.border = "1px dashed gray";
}
function putToolNameToData(toolName) {
  return function(dragged) {
    dragged.data.put("tool", toolName);
  }
}
function makeToolDraggable(toolCmp, toolName) {
  makeDraggable(toolCmp)
    .onDragStart(putToolNameToData(toolName))
    .stylePlaceholder(asTransparentDashed)
    .bindDropZone(programEventsEditor.dropZone)
    .allowTouch();
}
makeToolDraggable(loop, ToolNames.loop);
makeToolDraggable(event, ToolNames.event);


let saveBtn = editScreen.querySelector("#saveBtn");
saveBtn.addEventListener("click", save);

function loadProgramTitles() {
  return Storage.loadPrograms().map(program => program.title);
}

let programIconInput = editScreen.querySelector(".basic_program_data button[name=selectIconBtn]");
function save() {
  if (!titleValidator.validate()) {
    return;
  }
  let icon = programIconInput.dataset.icon;
  let title = programTitleInput.value;
  let mainEvent = programEventsEditor.save();

  let program = {
    id: noSpaces(title),
    title,
    icon,
    description: "",
    mainEvent
  };
  console.log(program);
  Storage.saveProgram(program);
  EventBus.globalInstance.fire(NEW_PROGRAM_SAVED_EVENT, program);
  programTitles = loadProgramTitles();
}

function newProgram() {
  return {
    id: null,
    title: "New Program",
    icon: "fas fa-heartbeat",
    description: "",
    mainEvent: newMainEvent()
  };
}

function load(program) {
  programTitleInput.value = program.title;
  markValid(programTitleInput);

  programIconInput.dataset.icon = program.icon;
  setIcon(programIconInput, program.icon);

  console.log("loading", program);
  programEventsEditor.load(program.mainEvent);
}

// let trashcan = editScreen.querySelector(".tools__trash_can");
// let trashImage = trashImageElement();
// function trashImageElement() {
//   let elem = createComponent("div", `program__element`);
//   elem.appendChild(iconCmp(TRASH_ICON));
//   elem.style.width = "3rem";
//   elem.style.height = "3rem";
//   return elem;
// }

function onShow(program) {
  load(program || newProgram());
  programTitles = loadProgramTitles();
}

let screen = {
  title: function(program) {
    if (program) {
      return `Edit ${program.title}`;
    } else {
      return `New program`;
    }
  },
  cmp: editScreen,
  onShow
};

export { screen, PROGRAM_SAVED_EVENT, NEW_PROGRAM_SAVED_EVENT };