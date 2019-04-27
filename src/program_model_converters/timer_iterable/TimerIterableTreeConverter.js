import eventConverter from "./TimerIterableEventConverter";
import loopConverter from "./TimerIterableLoopConverter";

import newElementTreeConverter from '../ElementTreeConverter';

export default newElementTreeConverter(
  eventConverter,
  loopConverter
);
