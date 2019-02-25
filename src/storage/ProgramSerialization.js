import { log } from "../utils/Logging";

import { mapTree } from "../utils/TreeUtils";
import { callbackDictionary } from '../EventCallbacks';
import { optional } from '../utils/FunctionalUtils';
import programInstance from '../program_model/Program';
import programEvent from '../program_model/ProgramEvent';
import programLoop from '../program_model/ProgramLoop';
import ToolNames from "../edit_screen/tools/ToolNames";

export default newInstance(callbackDictionary);

export function newInstance(callbackDictionary) {
  let dictionaryEntriesArray = [...callbackDictionary.entries()];
  return Object.freeze({
    serialize(program) {
      let { mainEvent, ...serializedProgram } = program;

      serializedProgram.mainEvent = mapTree(mainEvent, serializeElement);

      return serializedProgram;

      function serializeElement(element) {
        let { callback, ...serializedElement } = element;
        if (callback) {
          serializedElement.callback = serializeCallback(callback);
        }
        return serializedElement;
      }

      function serializeCallback(callback) {
        return optional(dictionaryEntriesArray.find(([name, fn]) => fn === callback))
          .ifEmpty(() => {
            throw Error(`Provided callback dictionary does not contain function '${callback}'`)
          })
          .value[0];
      }
    },
    deserialize(program) {
      return programInstance({
        id: program.id,
        title: program.title,
        icon: program.icon,
        description: program.description,
        timesOpened: program.timesOpened,
        mainEvent: deserializeElements(program.mainEvent)
      });

      function deserializeElements(mainEvent) {
        return mapTree(mainEvent, node => {
          let element = deserializeElement(node);
          element.children = node.children || [];
          return element;
        })
      }

      function deserializeElement(element) {
        switch(element.element) {
          case ToolNames.loop:
            return deserializeLoop(element);
          case ToolNames.event:
            return deserializeEvent(element);
          default:
            throw Error(`Unknown program element ${element.element} encountered`);
        }
      }

      function deserializeLoop(loop) {
        return programLoop({
          iterations: loop.iterations,
          duration: loop.duration
        });
      }

      function deserializeEvent(event) {
        return programEvent({
          name: event.name,
          callback: deserializeCallback(event.callback),
          duration: event.duration
        });
      }

      function deserializeCallback(callback) {
        return optional(callbackDictionary.get(callback))
          .ifEmpty(() => {
            throw Error(`Provided callback dictionary does not contain function '${callback}'`);
          })
          .value;
      }
    }
  })

}