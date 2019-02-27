import jsonReadyConverter from "./json_ready/JSONReadyElementConverter";
// import editorScreenDOMConverter from "";
// import iterableFroTimerConverter from "";

export const Converters = {
  jsonReady: Symbol("Converts ProgramElements to and from JSON ready objects"),
  // editorScreenDOM: Symbol("Converts ProgramElements to and from DOM representations for editor screen"),
  // iterableForTimer: Symbol("Converts ProgramElements to iterable that can be used by timer"),
};

export default new Map()
  .set(Converters.jsonReady, jsonReadyConverter);
  // .set(Converters.editorScreenDOM, editorScreenDOMConverter)
  // .set(Converters.iterableForTimer, iterableFroTimerConverter);