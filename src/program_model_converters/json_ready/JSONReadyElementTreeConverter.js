import newElementTreeConverter from '../ElementTreeConverter';
import eventConverter from './JSONReadyProgramEventConverter';
import loopConverter from './JSONReadyProgramLoopConverter';

export default newElementTreeConverter(
  eventConverter,
  loopConverter
);
