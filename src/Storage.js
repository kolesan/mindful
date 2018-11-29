import { isArray } from "./utils/Utils";
import * as TreeUtils from "./utils/TreeUtils";
import { callbackDictionary } from "./EventCallbacks";

const PROGRAMS_KEY = "programs";

function saveProgram(program) {
  let programs = loadPrograms();
  programs.push(program);
  putProgramsInToStorage(programs);
}

function loadPrograms() {
  let programs = JSON.parse(window.localStorage.getItem(PROGRAMS_KEY)) || [];
  if (!isArray(programs)) {
    throw new Error(`Program deserialization error. Serialized object '${programs}' is not an array.`);
  }
  return programs;
}

function loadProgram(id) {
  return loadPrograms().find(it => it.id == id);
}

function putProgramsInToStorage(programs) {
  window.localStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs))
}


export { saveProgram, loadPrograms, loadProgram };