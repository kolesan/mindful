import * as Map from "../../utils/Map";
import * as Loop from "../tools/Loop";
import * as Event from "../tools/Event";
import ToolNames from "./ToolNames";

let ToolMap = Map.inst()
  .put(ToolNames.event, newTool(ToolNames.event, Event))
  .put(ToolNames.loop, newTool(ToolNames.loop, Loop));

let Tools = Object.freeze({
  create(name, props) {
    return ToolMap.get(name).create(props);
  }
});

function newTool(name, tool) {
  return {name, create: tool.create};
}

export { ToolNames, Tools }