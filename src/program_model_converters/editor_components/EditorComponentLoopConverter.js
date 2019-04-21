import elementConverterProto from '../ElementConverter';
import ToolNames from "../../edit_screen/tools/ToolNames";
import { Tools } from "../../edit_screen/tools/Tools";
import programLoop from '../../program_model/ProgramLoop';

export default Object.freeze(Object.assign(Object.create(elementConverterProto), {
  type: ToolNames.loop,
  serialize(loop) {
    return Tools.create(ToolNames.loop, loop);
  },
  deserialize(loopElement) {
    return programLoop({
      iterations: loopElement.querySelector("[name=iterationsInput").value,
      duration: loopElement.querySelector("[name=durationDisplay").value
    });
  }
}));