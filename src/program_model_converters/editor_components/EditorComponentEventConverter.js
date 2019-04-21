import elementConverterProto from '../ElementConverter';
import ToolNames from "../../edit_screen/tools/ToolNames";
import { Tools } from "../../edit_screen/tools/Tools";

export default Object.freeze(Object.assign(Object.create(elementConverterProto), {
  type: ToolNames.event,
  serialize(event) {
    return Tools.create(ToolNames.event, event);
  }
}));