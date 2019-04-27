import elementConverterProto from '../ElementConverter';
import ToolNames from "../../edit_screen/tools/ToolNames";
import programLoop from "../../timer_screen/timer/iterable_program/IterableProgramLoop";

export default Object.freeze(Object.assign(Object.create(elementConverterProto), {
  type: ToolNames.loop,
  serialize(loop) {
    const { iterations, children, duration } = loop;

    return Object.create(programLoop)
      .init(iterations, children, duration);
  }
}));