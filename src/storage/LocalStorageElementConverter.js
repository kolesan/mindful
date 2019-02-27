import newElementTreeConverter from '../program_model_converters/ElementTreeConverter';
import eventConverter from './LocalStorageProgramEventConverter';
import loopConverter from './LocalStorageProgramLoopConverter';

export default newElementTreeConverter(
  eventConverter,
  loopConverter
);
