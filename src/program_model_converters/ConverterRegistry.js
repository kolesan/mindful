import jsonReadyConverter from "./json_ready/JSONReadyElementTreeConverter";
import editorDOMConverter from "./editor_components/EditorComponentTreeConverter";
// import iterableForTimerConverter from "";

export const Converters = {
  jsonReady: Symbol("Converts ProgramElements to and from JSON ready objects"),
  editorDOM: Symbol("Converts ProgramElements to and from DOM representations for editor"),
  // iterableForTimer: Symbol("Converts ProgramElements to iterable that can be used by timer"),
};

export default new Map()
  .set(Converters.jsonReady, jsonReadyConverter)
  .set(Converters.editorDOM, editorDOMConverter);
  // .set(Converters.iterableForTimer, iterableForTimerConverter);