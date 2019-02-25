import { noop, callbackDictionary } from "../EventCallbacks";
import programElement from "./ProgramElement";
import durationMixin from "./DurationMixin";
import ToolNames from "../edit_screen/tools/ToolNames";

const programEvent = {
  name: "",
  callback: callbackDictionary.get(noop)
};

export default function inst(options) {
  return Object.assign(
    programElement(ToolNames.event),
    durationMixin(),
    Object.create(programEvent),
    options
  );
}