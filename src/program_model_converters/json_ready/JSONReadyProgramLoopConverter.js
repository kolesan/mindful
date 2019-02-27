import programLoop from '../../program_model/ProgramLoop';
import elementConverter from '../ElementConverter';
import ToolNames from "../../edit_screen/tools/ToolNames";

export default Object.assign(Object.create(elementConverter), {
  type: ToolNames.loop,
  serialize(loop) {
    return {
      ...loop
    };
  },
  deserialize(loop) {
    return programLoop({
      iterations: loop.iterations,
      duration: loop.duration
    });
  }
});