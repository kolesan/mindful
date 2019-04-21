import elementConverterProto from '../ElementConverter';
import ToolNames from "../../edit_screen/tools/ToolNames";
import { Tools } from "../../edit_screen/tools/Tools";

export default Object.freeze(Object.assign(Object.create(elementConverterProto), {
  type: ToolNames.loop,
  serialize(loop) {
    return Tools.create(ToolNames.loop, loop);
  }
}));