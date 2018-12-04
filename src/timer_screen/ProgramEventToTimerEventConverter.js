import { ToolNames } from '../edit_screen/tools/Tools';
import { newTimerEvent } from './Timer';
import { callbackDictionary } from '../EventCallbacks';

function convertEvent(programEvent, startTime = 0, i = 1) {
  return newTimerEvent(
    programEvent.name.replace("{i}", i),
    startTime,
    programEvent.duration,
    callbackDictionary.get(programEvent.callback),
    convertProgramElementChildren(programEvent, startTime, i)
  );
}

function convertProgramElementChildren(programElement, startTime, i) {
  let children = [];
  programElement.children.forEach(it => {
    switch(it.element) {
      case ToolNames.event:
        children.push(convertEvent(it, startTime, i));
        startTime += it.duration;
        break;
      case ToolNames.loop:
        let childrenDurationSum = it.children.reduce((a, b) => a + b.duration, 0);
        for(let i = 0; i < it.iterations; i++) {
          children.push(...convertProgramElementChildren(it, startTime, i+1));
          startTime += childrenDurationSum;
        }
        break;
    }
  });
  return children;
}

export { convertEvent };