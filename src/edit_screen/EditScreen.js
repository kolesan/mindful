import './edit_screen.css';

import { setIcon } from '../utils/HtmlUtils';
import * as Storage from '../Storage';
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
let programTitleInput = editScreen.querySelector(".basic_program_data [name=programTitleInput]");
let currentProgram;

let uniqueTitleValidation = InputValidator.validationWithStaticErrorMessage(
  uniqueTitle, "Program with such name already exists"
);
function uniqueTitle(title) {
  let titleWithoutSpaces = noSpaces(title);
  let didNotChange = title == currentProgram.title;
  let sameTitleExists = !programTitles.find(it => noSpaces(it) == titleWithoutSpaces);

  return didNotChange || sameTitleExists;
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
saveBtn.addEventListener("click", event => {
  if (!titleValidator.validate() || !programEventsEditor.validate()) {
    return;
  }
  save(currentProgram.id);
});

function loadProgramTitles() {
  return Storage.loadPrograms().map(program => program.title);
}

let programIconInput = editScreen.querySelector(".basic_program_data [name=selectIconBtn]");
function save(oldId) {
  let title = programTitleInput.value;
  let program = {
    id: noSpaces(title),
    title,
    icon: programIconInput.dataset.icon,
    description: "",
    mainEvent: programEventsEditor.save()
  };
  console.log("saving", program);
  if (oldId) {
    Storage.overrideProgram(oldId, program);
    EventBus.globalInstance.fire(PROGRAM_SAVED_EVENT, program);
  } else {
    Storage.saveProgram(program);
    EventBus.globalInstance.fire(NEW_PROGRAM_SAVED_EVENT, program);
  }
  programTitles = loadProgramTitles();
}

function newProgram(programTitles) {
  return {
    id: null,
    title: generateNewProgramTitle(programTitles),
    icon: "fas fa-heartbeat",
    description: "",
    mainEvent: newMainEvent()
  };
}

function generateNewProgramTitle(programTitles) {
  return programTitles
    .filter(title => /^New Program.*/.test(title))
    .reduce((a, b) => a != b ? a : appendCounter(a), "New Program");

  function appendCounter(s) {
    let counter = Number(s.charAt(s.length - 1)) || 1;
    return `New Program ${counter + 1}`;
  }
}

function load(program) {
  programTitleInput.value = program.title;
  programIconInput.dataset.icon = program.icon;
  setIcon(programIconInput, program.icon);

  console.log("loading", program);
  programEventsEditor.load(program.mainEvent);

  currentProgram = program;
}

function onShow(program) {
  programEventsEditor.init();
  programTitles = loadProgramTitles();
  load(program || newProgram(programTitles));
  markValid(programTitleInput);
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