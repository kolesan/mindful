import { optional } from "./FunctionalUtils";

export default function inst(callbackDictionaryMap) {
  const dictionaryEntriesArray = [...callbackDictionaryMap.entries()];
  return {
    get(callback) {
      return optional(callbackDictionaryMap.get(callback))
        .ifEmpty(() => {
          throw Error(`Provided callback dictionary does not contain function '${callback}'`);
        })
        .value;
    },
    getByValue(callback) {
      return optional(dictionaryEntriesArray.find(([name, fn]) => fn === callback))
        .ifEmpty(() => {
          throw Error(`Provided callback dictionary does not contain function '${callback}'`);
        })
        .value[0];
    }
  }
}