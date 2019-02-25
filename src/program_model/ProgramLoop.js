import programElement from "./ProgramElement";
import durationMixin from "./DurationMixin";
import ToolNames from "../edit_screen/tools/ToolNames";

const programLoop = {
  iterations: 0
};

export default function inst(options) {
  return Object.assign(
    programElement(ToolNames.loop),
    durationMixin(),
    Object.create(programLoop),
    options
  );
}