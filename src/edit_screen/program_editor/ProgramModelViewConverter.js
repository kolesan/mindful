import { fgong, fsgong, noop, callbackDictionary } from "../../EventCallbacks";
import ToolNames from "../tools/ToolNames";
import { Tools } from "../tools/Tools";

function viewToProgram(viewChildren, depth = 0) {
  let viewElements = Array.from(viewChildren).filter(it => it.classList.contains("program__element"));
  let programElements = [];
  viewElements.forEach(viewElement => {
    let tool = viewElement.dataset.element;
    let programElement = {element: tool};
    switch(tool) {
      case ToolNames.loop:
        let iterations = viewElement.querySelector("[name=iterationsInput").value;
        let loopDuration = viewElement.querySelector("[name=durationDisplay").value;
        Object.assign(programElement, {iterations, duration: loopDuration});
        break;
      case ToolNames.event:
        let name = viewElement.querySelector("[name=eventNameInput").value;
        let duration = viewElement.querySelector("[name=eventDurationInput").value;
        let callback = viewElement.dataset.muted == "true" ?
          callbackDictionary.get(noop) :
          depth == 0 ? callbackDictionary.get(fgong) : callbackDictionary.get(fsgong);

        Object.assign(programElement, {name, duration, callback});
        break;
    }
    programElement.children = viewToProgram(viewElement.children, tool == ToolNames.event ? depth + 1 : depth);
    programElements.push(programElement);
  });
  return programElements;
}

export { viewToProgram }