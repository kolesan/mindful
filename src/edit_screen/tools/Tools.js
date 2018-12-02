import * as Map from "../../utils/Map";
import * as Loop from "../tools/Loop";
import * as Event from "../tools/Event";

const ToolNames = {
  loop: "loop",
  event: "event"
};

let Tools = Map.inst()
  .put(ToolNames.event, newTool(ToolNames.event, Event.create))
  .put(ToolNames.loop, newTool(ToolNames.loop, Loop.create));

function newTool(name, createFn) {
  return {name, create: createFn};
}

export { ToolNames, Tools }