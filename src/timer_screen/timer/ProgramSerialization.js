import { map } from "../../utils/TreeUtils";
import { callbackDictionary } from '../../EventCallbacks';

export default newInstance(callbackDictionary);

export function newInstance(callbackDictionary) {
  return Object.freeze({
    serialize(program) {
      let serializedProgram = {...program};

      serializedProgram.mainEvent = map(program.mainEvent, node => {
        let clone = Object.assign({}, node);
        if (clone.callback) {
          let entries = [...callbackDictionary.entries()];
          let fnEntry = entries.find(([k, v]) => v == clone.callback);
          if (!fnEntry) {
            throw Error(`'Provided callback dictionary does not contain function '${clone.callback}'`);
          }
          clone.callback = fnEntry[0];
        }
        return clone;
      });

      return serializedProgram;
    },
    deserialize(program) {
      let deserializedProgram = {...program};

      deserializedProgram.mainEvent = map(program.mainEvent, node => {
        let clone = Object.assign({}, node);
        if (clone.callback) {
          let callbackFn = callbackDictionary.get(clone.callback);
          if (!callbackFn) {
            throw Error(`'Provided callback dictionary does not contain function '${clone.callback}'`);
          }
          clone.callback = callbackFn;
        }
        return clone;
      });

      return deserializedProgram;
    }
  })
}