import * as Loop from "../tools/Loop";
import * as Event from "../tools/Event";
import { programElemChildren } from "./ToolComponent";
import ToolNames from "./ToolNames";

let ToolMap = new Map()
  .set(ToolNames.event, newTool(ToolNames.event, Event))
  .set(ToolNames.loop, newTool(ToolNames.loop, Loop));

let Tools = Object.freeze({
  create(name, props) {
    return ToolMap.get(name).create(props);
  },
  fromElement: function fromElement(element, afterCreationCb) {
    let tool = ToolMap.get(element.dataset.element);
    let cmp = tool.fromElement(element);

    programElemChildren(element)
      .map(childElement => fromElement(childElement, afterCreationCb))
      .forEach(childCmp => cmp.element.appendChild(childCmp.element));

    afterCreationCb(cmp);
    return cmp;
  }
});

function newTool(name, tool) {
  return {name, create: tool.create, fromElement: tool.fromElement};
}

export { ToolNames, Tools }