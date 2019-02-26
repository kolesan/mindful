import { log } from "../utils/Logging";

import programInstance from '../program_model/Program';
import converterRegistry, { Converters } from "../program_model_converters/ConverterRegistry";

export default newInstance(converterRegistry.get(Converters.localStorage));

export function newInstance(elementConverter) {
  return Object.freeze({
    serialize(program) {
      let { mainEvent, ...serializedProgram } = program;
      serializedProgram.mainEvent = elementConverter.serialize(mainEvent);
      return serializedProgram;
    },
    deserialize(program) {
      return programInstance({
        id: program.id,
        title: program.title,
        icon: program.icon,
        description: program.description,
        timesOpened: program.timesOpened,
        mainEvent: elementConverter.deserialize(program.mainEvent)
      });
    }
  })

}