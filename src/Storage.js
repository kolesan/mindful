import { isArray } from "./utils/Utils";

const PROGRAMS_KEY = "programs";

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


export { saveProgram, overrideProgram, loadPrograms, loadProgram };