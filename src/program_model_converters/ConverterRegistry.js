import jsonReadyConverter from "./json_ready/JSONReadyElementTreeConverter";
import editorDOMConverter from "./editor_components/EditorComponentTreeConverter";
import timerIterableConverter from "./timer_iterable/TimerIterableTreeConverter";

export const Converters = {
  jsonReady: Symbol("To and from JSON ready objects"),
  editorDOM: Symbol("To tool components and from editor DOM elements"),
  timerIterable: Symbol("To an iterable that can be used by the timer"),
};

export default new Map()
  .set(Converters.jsonReady, jsonReadyConverter)
  .set(Converters.editorDOM, editorDOMConverter)
  .set(Converters.timerIterable, timerIterableConverter);