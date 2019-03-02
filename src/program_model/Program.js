import { log } from "../utils/Logging";

import { assignDefinedProperties } from "../utils/Utils";
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
  let instance = Object.create(program);
  return assignDefinedProperties(instance, options);
}
