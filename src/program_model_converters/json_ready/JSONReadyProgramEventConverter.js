import { callbackDictionary } from "../../EventCallbacks";
import { optional } from "../../utils/FunctionalUtils";
import programEvent from '../../program_model/ProgramEvent';
import elementConverter from '../ElementConverter';
import ToolNames from "../../edit_screen/tools/ToolNames";

export default inst(callbackDictionary);

export function inst(callbackDictionary) {
  let dictionaryEntriesArray = [...callbackDictionary.entries()];

  return Object.assign(Object.create(elementConverter), {
    type: ToolNames.event,
    serialize: serializeEvent,
    deserialize: deserializeEvent
  });


  function serializeEvent(event) {
    let { callback, ...serializedEvent } = event;
    serializedEvent.callback = serializeCallback(callback);
    return serializedEvent;

    function serializeCallback(callback) {
      return optional(dictionaryEntriesArray.find(([name, fn]) => fn === callback))
        .ifEmpty(() => {
          throw Error(`Provided callback dictionary does not contain function '${callback}'`)
        })
        .value[0];
    }
  }

  function deserializeEvent(event) {
    return programEvent({
      name: event.name,
      callback: deserializeCallback(event.callback),
      duration: event.duration
    });

    function deserializeCallback(callback) {
      return optional(callbackDictionary.get(callback))
        .ifEmpty(() => {
          throw Error(`Provided callback dictionary does not contain function '${callback}'`);
        })
        .value;
    }
  }
}