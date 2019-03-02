import { log } from "../../utils/Logging";

import programInstance from '../../program_model/Program';
import converterRegistry, { Converters } from "../ConverterRegistry";

export default inst(converterRegistry.get(Converters.jsonReady));

export function inst(elementConverter) {

  return Object.freeze({
    serialize(program) {
      let { mainEvent, ...serializedProgram } = program;
      serializedProgram.mainEvent = mainEvent ? elementConverter.serialize(mainEvent) : null;
      return serializedProgram;
    },
    deserialize(program) {
      return programInstance({
        id: program.id,
        title: program.title,
        icon: program.icon,
        description: program.description,
        timesOpened: program.timesOpened,
        mainEvent: program.mainEvent ? elementConverter.deserialize(program.mainEvent) : null
      });
    }
  })

}