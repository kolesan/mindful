import { fgong, fsgong } from "../../EventCallbacks";
import { Tools, ToolNames } from "../tools/Tools";

function viewToProgram(viewChildren, depth = 0) {
  let viewElements = Array.from(viewChildren).filter(it => it.classList.contains("program__element"));
  let programElements = [];
  viewElements.forEach(viewElement => {
    let tool = viewElement.dataset.element;
    let programElement = {element: tool};
    switch(tool) {
      case ToolNames.loop:
        let iterations = viewElement.querySelector("[name=iterationsInput").value;
        Object.assign(programElement, {iterations});
        break;
      case ToolNames.event:
        let name = viewElement.querySelector("[name=eventNameInput").value;
        let duration = viewElement.querySelector("[name=eventDurationInput").value;
        let callback = depth == 0 ? fgong : fsgong;
        Object.assign(programElement, {name, duration, callback});
        break;
    }
    programElement.children = viewToProgram(viewElement.children, tool == ToolNames.event ? depth + 1 : depth);
    programElements.push(programElement);
  });
  return programElements;
}

function programToView(parent, afterToolCreationHook) {
  let elements = [];
  parent.children.forEach(programElement => {
    let toolCmp = Tools.create(programElement.element, programElement);
    let viewElement = toolCmp.element;
    programToView(programElement, afterToolCreationHook).forEach(it => viewElement.appendChild(it));
    afterToolCreationHook(toolCmp);
    elements.push(viewElement)
  });
  return elements;
}

export { viewToProgram, programToView }