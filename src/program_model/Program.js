import { log } from "../utils/Logging";

import { noSpaces } from "../utils/Utils";
import programEvent from "./ProgramEvent";

const program = {
  id: "",
  title: "",
  icon: "",
  description: "",
  timesOpened: 0,
  mainEvent: programEvent()
};

export default function inst(options) {
  validate(options);

  let instance = Object.create(program);

  return Object.assign(instance, options);
}

function validate(program) {
  if (program.id !== noSpaces(program.title)) {
    throw Error("id should be equal to title but with no spaces");
  }
}
