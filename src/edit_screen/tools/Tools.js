import * as Loop from "../tools/Loop";
import * as Event from "../tools/Event";
import ToolNames from "./ToolNames";

let ToolMap = new Map()
  .set(ToolNames.event, newTool(ToolNames.event, Event))
  .set(ToolNames.loop, newTool(ToolNames.loop, Loop));

let Tools = Object.freeze({
  create(name, props) {
    return ToolMap.get(name).create(props);
  },
  fromElement(element, afterCreationCb) {
    return ToolMap.get(element.dataset.element).fromElement(element, afterCreationCb);
  }
});

function newTool(name, tool) {
  return {name, create: tool.create, fromElement: tool.fromElement};
}

export { ToolNames, Tools }