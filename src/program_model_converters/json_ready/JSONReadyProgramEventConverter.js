import { callbackDictionary } from "../../EventCallbacks";
import programEvent from '../../program_model/ProgramEvent';
import elementConverter from '../ElementConverter';
import ToolNames from "../../edit_screen/tools/ToolNames";

export default inst(callbackDictionary);

export function inst(callbackDictionary) {

  return Object.assign(Object.create(elementConverter), {
    type: ToolNames.event,
    serialize: serializeEvent,
    deserialize: deserializeEvent
  });


  function serializeEvent(event) {
    let { callback, ...serializedEvent } = event;
    serializedEvent.callback = callbackDictionary.getByValue(callback);
    return serializedEvent;
  }

  function deserializeEvent(event) {
    return programEvent({
      name: event.name,
      callback: callbackDictionary.get(event.callback),
      duration: event.duration
    });
  }
}