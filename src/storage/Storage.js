import { isArray } from "../utils/Utils";
import { log } from "../utils/Logging";
import programSerializationService from '../storage/ProgramSerialization';

const PROGRAMS_KEY = "programs";
const SETTINGS_KEY = "settings";

function saveProgram(program) {
  let programs = loadPrograms();
  programs.push(program);
  putProgramsInToStorage(programs);
}

function overrideProgram(oldId, program) {
  console.log("Overriding program", {oldId, program});
  let programs = loadPrograms();
  let oldProgram = programs.find(it => it.id == oldId);
  Object.assign(oldProgram, program);
  putProgramsInToStorage(programs);
}

function loadPrograms() {
  log("loading programs");
  let programs = JSON.parse(localStorage.getItem(PROGRAMS_KEY)) || [];
  if (!isArray(programs)) {
    throw new Error(`Program deserialization error. Serialized object '${programs}' is not an array.`);
  }

  return programs
    .map(programSerializationService.deserialize);
}

function loadProgram(id) {
  return loadPrograms().find(it => it.id == id);
}

function putProgramsInToStorage(programs) {
  localStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs.map(programSerializationService.serialize)))
}



function loadSettings() {
  return JSON.parse(localStorage.getItem(SETTINGS_KEY));
}

function saveSettings(settings) {
  let oldSettings = loadSettings();
  let combinedSettings = Object.assign({}, oldSettings, settings);
  log("Saving settings", combinedSettings);
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(combinedSettings))
}



export { saveProgram, overrideProgram, loadPrograms, loadProgram, loadSettings, saveSettings };