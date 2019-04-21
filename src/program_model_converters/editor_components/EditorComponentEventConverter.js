import elementConverterProto from '../ElementConverter';
import ToolNames from "../../edit_screen/tools/ToolNames";
import { Tools } from "../../edit_screen/tools/Tools";
import { callbackDictionary } from "../../EventCallbacks";
import programEvent from '../../program_model/ProgramEvent';

export default inst(callbackDictionary);

export function inst(callbackDictionary) {
  return Object.freeze(Object.assign(Object.create(elementConverterProto), {
    type: ToolNames.event,
    serialize(event) {
      return Tools.create(ToolNames.event, event);
    },
    deserialize(eventElement) {
      return programEvent({
        name: eventElement.querySelector("[name=eventNameInput").value,
        callback: callbackDictionary.get(eventElement.dataset.callback),
        duration: eventElement.querySelector("[name=eventDurationInput").value
      });
    }
  }));
}