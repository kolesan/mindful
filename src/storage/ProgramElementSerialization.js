import { callbackDictionary } from "../EventCallbacks";
import { mapTree } from "../utils/TreeUtils";
import ToolNames from "../edit_screen/tools/ToolNames";
import { optional } from "../utils/FunctionalUtils";
import programEvent from '../program_model/ProgramEvent';
import programLoop from '../program_model/ProgramLoop';

export default inst(callbackDictionary);

export function inst(callbackDictionary) {
  let dictionaryEntriesArray = [...callbackDictionary.entries()];

  const SerializationFunctions = new Map()
    .set(ToolNames.event, serializeEvent)
    .set(ToolNames.loop, serializeLoop);
  const DeserializationFunctions = new Map()
    .set(ToolNames.event, deserializeEvent)
    .set(ToolNames.loop, deserializeLoop);

  return Object.freeze({
    serialize: generateConversionFn(SerializationFunctions),
    deserialize: generateConversionFn(DeserializationFunctions)
  });


  function generateConversionFn(fnMap) {
    const getElementConversionFn = getFn(fnMap);
    return function(root) {
      return mapTree(root, element => {
        return getElementConversionFn(element.element)(element);
      });
    }
  }

  function getFn(fnMap) {
    return function(elementName) {
      return optional(fnMap.get(elementName))
        .ifPresentReturn()
        .orElse(() => {
          throw Error(`Unknown element ${elementName} encountered during program serialization/deserialization for localStorage`);
        });
    }
  }



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

  function serializeLoop(loop) {
    return { ...loop };
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

  function deserializeLoop(loop) {
    return programLoop({
      iterations: loop.iterations,
      duration: loop.duration
    });
  }
}