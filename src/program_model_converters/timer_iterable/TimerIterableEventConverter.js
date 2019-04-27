import elementConverterProto from '../ElementConverter';
import ToolNames from "../../edit_screen/tools/ToolNames";
import programEvent from "../../timer_screen/timer/iterable_program/IterableProgramEvent";

export default Object.freeze(Object.assign(Object.create(elementConverterProto), {
  type: ToolNames.event,
  serialize(event) {
    const { name, callback, children, duration } = event;

    return Object.create(programEvent)
      .init(name, callback, children, duration);
  }
}));