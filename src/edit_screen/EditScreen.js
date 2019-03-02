import './edit_screen.css';

import { setChildIcon } from '../utils/HtmlUtils';
import programsStorage from "../storage/programs_storage/ProgramsStorage";
import * as EventBus from '../utils/EventBus';
import newProgram from '../program_model/Program';
import * as InputValidator from "../text_input/InputValidator";
import { makeDraggable } from "./dragndrop/Draggable";
import * as ProgramEventsEditor from "./program_editor/ProgramEventsEditor";
import { alphanumericValidation, markInvalid, markValid } from "../Validation";
import { noSpaces } from "../utils/Utils";
import ToolNames from "./tools/ToolNames";
import { newMainEvent } from "./program_editor/ProgramEventsEditor";

const COPY_BUTTON_ACTIVE_CLASS = "tools__copy_toggle-active";

const PROGRAM_SAVED_EVENT = "PROGRAM_SAVED_EVENT";
const NEW_PROGRAM_SAVED_EVENT = "NEW_PROGRAM_SAVED_EVENT";

let editScreen = document.querySelector("#editScreen");
let editingExistingProgram = false;

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
    dragged.data.set("tool", toolName);
  }
}
function makeToolDraggable(toolCmp, toolName) {
  makeDraggable(toolCmp)
    .onDragStart(putToolNameToData(toolName))
    .stylePlaceholder(asTransparentDashed)
    .bindDropZone(programEventsEditor.dropZone.zone)
    .allowTouch();
}
makeToolDraggable(loop, ToolNames.loop);
makeToolDraggable(event, ToolNames.event);

let copyButton = editScreen.querySelector("#copyModeToggle");
copyButton.addEventListener("click", event => {
  programEventsEditor.dropZone.setCopyMode(!programEventsEditor.dropZone.getCopyMode());
  copyButton.classList.toggle(COPY_BUTTON_ACTIVE_CLASS);
});
window.addEventListener("keydown", event => {
  if (event.key === "Control") {
    programEventsEditor.dropZone.setCopyMode(true);
    copyButton.classList.add(COPY_BUTTON_ACTIVE_CLASS);
  }
});
window.addEventListener("keyup", event => {
  if (event.key === "Control") {
    programEventsEditor.dropZone.setCopyMode(false);
    copyButton.classList.remove(COPY_BUTTON_ACTIVE_CLASS);
  }
});

let saveBtn = editScreen.querySelector("#saveBtn");
saveBtn.addEventListener("click", event => {
  if (!titleValidator.validate() || !programEventsEditor.validate()) {
    return;
  }
  save();
});

let programIconInput = editScreen.querySelector(".basic_program_data [name=selectIconBtn]");
function save() {
  let program = newProgram({
    title: programTitleInput.value || generateUniqueTitle(programTitles),
    icon: programIconInput.dataset.icon,
    description: "",
    mainEvent: programEventsEditor.save()
  });
  console.log("saving", program, currentProgram);
  if (editingExistingProgram) {
    let id = programsStorage.update(currentProgram.id, program);
    EventBus.globalInstance.fire(PROGRAM_SAVED_EVENT, id);
  } else {
    let id = programsStorage.save(program);
    EventBus.globalInstance.fire(NEW_PROGRAM_SAVED_EVENT, id);
  }
  programTitles = loadProgramTitles();
}

function loadProgramTitles() {
  return programsStorage.loadAll().map(program => program.title);
}

function generateFreshProgram() {
  return newProgram({
    id: null,
    title: "",
    icon: "fas fa-heartbeat",
    description: "",
    mainEvent: newMainEvent()
  });
}

function generateUniqueTitle(programTitles) {
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
  setChildIcon(programIconInput, program.icon);

  console.log("loading", program);
  programEventsEditor.load(program.mainEvent);

  currentProgram = program;
}

function onShow(program) {
  programTitles = loadProgramTitles();
  editingExistingProgram = !!program;
  load(program || generateFreshProgram());
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