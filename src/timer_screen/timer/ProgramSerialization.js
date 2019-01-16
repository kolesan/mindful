import { map } from "../../utils/TreeUtils";

export default function inst(callbackDictionary) {
  return Object.freeze({
    serialize(program) {
      let serializedProgram = {...program};

      serializedProgram.mainEvent = map(program.mainEvent, node => {
        let clone = Object.assign({}, node);
        if (clone.callback) {
          let callbackDictionaryEntry = callbackDictionary.entries.find(([k, v]) => v == clone.callback);
          clone.callback = callbackDictionaryEntry[0];
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
            throw Error(`'${callbackDictionary}' callback dictionary does not contain function '${clone.callback}'`);
          }
          clone.callback = callbackFn;
        }
        return clone;
      });

      return deserializedProgram;
    }
  })
}