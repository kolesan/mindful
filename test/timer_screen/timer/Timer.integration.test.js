import { log, logo } from "../../TestUtils";
import { programBuilder } from "../../../src/dev/DevUtils";

import { newTimer } from '../../../src/timer_screen/timer/Timer';
import timeKeeper from '../../../src/timer_screen/timer/TimeKeeper';
import eventTraversal from '../../../src/timer_screen/timer/EventTraversal';
import iterableTimerProgram from '../../../src/timer_screen/timer/IterableTimerProgram';

let prepCb = jest.fn();
let pose12Cb = jest.fn();
let pose22Cb = jest.fn();
let changePoseCb = jest.fn();
let chillCb = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
});

let program = {
  mainEvent: programBuilder( `Mindful Yoga` )
                     .event( `Preparation`, 30000, prepCb ).end()
                     .loop(50)
                       .event( `Hold pose {i}`, 60000 )
                         .event( `1/2`, 30000, pose12Cb ).end()
                         .event( `2/2`, 30000, pose22Cb ).end()
                       .end()
                       .event( `Change pose`, 10000, changePoseCb ).end()
                     .end()
                     .event( `Chill`, 70000, chillCb )
                     .build()
};

it('can be created', () => {
  let timer = newTimer(timeKeeper(1000), eventTraversal(iterableTimerProgram(program)));

  expect(timer.running).toEqual(false);
  expect(timer.paused).toEqual(false);
  expect(timer.stopped).toEqual(true);

  expect(timer.onStart).toBeFunction();
  expect(timer.onPause).toBeFunction();
  expect(timer.onFinish).toBeFunction();
  expect(timer.onTick).toBeFunction();
  expect(timer.onLevelUpdate).toBeFunction();
  expect(timer.onSeek).toBeFunction();

  expect(timer.init).toBeFunction();
  expect(timer.start).toBeFunction();
  expect(timer.pause).toBeFunction();
  expect(timer.stop).toBeFunction();
  expect(timer.seek).toBeFunction();

  expect(timer.currentEvents).toBeDefined();

  expect(Object.getPrototypeOf(timer)).toContainAllKeys([
    "running", "paused", "stopped",
    "onStart", "onPause", "onFinish", "onTick", "onLevelUpdate", "onSeek",
    "init", "start", "pause", "stop", "seek",
    "currentEvents"
  ]);
});
