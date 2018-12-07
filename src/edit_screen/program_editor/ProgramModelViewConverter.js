import { fgong } from "../../EventCallbacks";
import { Tools, ToolNames } from "../tools/Tools";

function viewToProgram(viewChildren) {
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
        Object.assign(programElement, {name, duration, callback: fgong});
        break;
    }
    programElement.children = viewToProgram(viewElement.children);
    programElements.push(programElement);
  });
  return programElements;
}

function programToView(parent, afterToolCreationHook) {
  let elements = [];
  parent.children.forEach(programElement => {
    let viewElement = null;
    let tool = Tools.get(programElement.element);
    switch(tool.name) {
      case ToolNames.event:
        viewElement = tool.create(programElement.name, programElement.duration);
        break;
      case ToolNames.loop:
        viewElement = tool.create(programElement.iterations);
        break;
    }
    programToView(programElement, afterToolCreationHook).forEach(it => viewElement.appendChild(it));
    afterToolCreationHook(viewElement);
    elements.push(viewElement)
  });
  return elements;
}

export { viewToProgram, programToView }