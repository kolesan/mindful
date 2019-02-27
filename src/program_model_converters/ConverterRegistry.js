import localStorageConverter from "../storage/LocalStorageElementConverter";
// import editorScreenDOMConverter from "";
// import iterableFroTimerConverter from "";

export const Converters = {
  localStorage: Symbol("Converts ProgramElements to and from JSON ready objects"),
  // editorScreenDOM: Symbol("Converts ProgramElements to and from DOM representations for editor screen"),
  // iterableForTimer: Symbol("Converts ProgramElements to iterable that can be used by timer"),
};

export default new Map()
  .set(Converters.localStorage, localStorageConverter);
  // .set(Converters.editorScreenDOM, editorScreenDOMConverter)
  // .set(Converters.iterableForTimer, iterableFroTimerConverter);