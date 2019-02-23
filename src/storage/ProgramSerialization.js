import { log } from "../utils/Logging";
import { mapTree } from "../utils/TreeUtils";
import { callbackDictionary } from '../EventCallbacks';
import { fnFind } from '../utils/PrototypeExtensions';
import { optional } from '../utils/FunctionalUtils';

export default newInstance(callbackDictionary);

export function newInstance(callbackDictionary) {
  let dictionaryEntriesArray = [...callbackDictionary.entries()];
  return Object.freeze({
    serialize(program) {
      let serializedProgram = {...program};

      serializedProgram.mainEvent = mapTree(program.mainEvent, node => {
        let clone = {...node};
        if (node.callback) {
          dictionaryEntriesArray
            [fnFind](([k, v]) =>
              v === node.callback
            )
            .ifPresent(entry => {
              clone.callback = entry[0]
            })
            .ifEmpty(() => {
              throw Error(`'Provided callback dictionary does not contain function '${node.callback}'`)
            })
        }
        return clone;
      });

      return serializedProgram;
    },
    deserialize(program) {
      let deserializedProgram = {...program};

      deserializedProgram.mainEvent = mapTree(program.mainEvent, node => {
        let clone = {...node};
        if (node.callback) {
          optional(callbackDictionary.get(node.callback))
            .ifPresent(callbackFn =>
              clone.callback = callbackFn
            )
            .ifEmpty(() => {
              throw Error(`'Provided callback dictionary does not contain function '${node.callback}'`);
            })
        }
        return clone;
      });

      return deserializedProgram;
    }
  })
}