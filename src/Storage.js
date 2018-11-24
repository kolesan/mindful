import { isArray } from "./utils/Utils";
import * as TreeUtils from "./utils/TreeUtils";
import { callbackDictionary } from "./EventCallbacks";

const PROGRAMS_KEY = "programs";

function saveProgram(program) {
  let programs = getProgramsFromStorage();
  programs.push(cloneProgramAndSerializeCallbacks(program));
  putProgramsInToStorage(programs);
}

function cloneProgramAndSerializeCallbacks(program) {
  let clone = Object.assign({}, program);
  serializeCallbacks(clone);
  return clone;
}

function serializeCallbacks(program) {
  TreeUtils.visit(program.mainEvent, event => event.callback = callbackDictionary.findByValue(event.callback));
}


function getProgramsFromStorage() {
  let programs = JSON.parse(window.localStorage.getItem(PROGRAMS_KEY)) || [];
  if (!isArray(programs)) {
    throw new Error(`Program deserialization error. Serialized object '${programs}' is not an array.`);
  }
  return programs;
}
function putProgramsInToStorage(programs) {
  window.localStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs))
}


function deserializePrograms() {
  let programs = getProgramsFromStorage();

  programs.forEach(program => deserializeCallbackFunctions(program));

  return programs;
}

function deserializeCallbackFunctions(program) {
  TreeUtils.visit(program.mainEvent, event => event.callback = callbackDictionary.get(event.callback));
}


export { saveProgram };