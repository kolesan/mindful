import { log, logo, nowKeeper } from "../../TestUtils";

import { newTimer } from '../../../src/timer_screen/timer/Timer';
import timeKeeper from '../../../src/timer_screen/timer/TimeKeeper';
import eventTraversal from '../../../src/timer_screen/timer/EventTraversal';
import iterableTimerProgram from '../../../src/timer_screen/timer/IterableTimerProgram';

let noop = jest.fn();
let prepCb = jest.fn();
let pose12Cb = jest.fn();
let pose22Cb = jest.fn();
let changePoseCb = jest.fn();
let chillCb = jest.fn();

jest.useFakeTimers();
let now = nowKeeper();
function advanceTime(t) {
  jest.advanceTimersByTime(t);
  now.advance(t);
}

afterEach(() => {
  //jest.resetAllMocks() for some reason prevents setInterval from happening in TimeKeeper
  //so we need to reset all mocks by hand
  noop.mockReset();
  prepCb.mockReset();
  pose12Cb.mockReset();
  pose22Cb.mockReset();
  changePoseCb.mockReset();
  chillCb.mockReset();

  now = nowKeeper();
});

let program = {
  mainEvent: {
    element: "event",
    name: "Mindful Yoga",
    duration: 310000,
    callback: noop,
    children: [
      {
        element: "event",
        name: "Preparation",
        duration: 30000,
        callback: prepCb,
        children: []
      },
      {
        element: "loop",
        iterations: 3,
        duration: 210000,
        children: [
          {
            element: "event",
            name: "Hold pose {i}",
            duration: 60000,
            callback: noop,
            children: [
              {
                element: "event",
                name: "1/2",
                duration: 30000,
                callback: pose12Cb,
                children: []
              },
              {
                element: "event",
                name: "2/2",
                duration: 30000,
                callback: pose22Cb,
                children: []
              }
            ]
          },
          {
            element: "event",
            name: "Change pose",
            duration: 10000,
            callback: changePoseCb,
            children: []
          }
        ]
      },
      {
        element: "event",
        name: "Chill",
        duration: 70000,
        callback: chillCb,
        children: []
      }
    ]
  }
};

it('can be created', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));

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

it('state change from start, pause and stop is reflected through running, paused and stopped', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));

  timer.start();
  advanceTime(100);

  expect(timer.running).toEqual(true);
  expect(timer.paused).toEqual(false);
  expect(timer.stopped).toEqual(false);

  timer.pause();
  advanceTime(100);

  expect(timer.running).toEqual(false);
  expect(timer.paused).toEqual(true);
  expect(timer.stopped).toEqual(false);

  timer.stop();
  advanceTime(100);

  expect(timer.running).toEqual(false);
  expect(timer.paused).toEqual(false);
  expect(timer.stopped).toEqual(true);
});

it('onStart, onPause and onFinish callbacks are called on start, pause and stop', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let onStartCb = jest.fn();
  let onPauseCb = jest.fn();
  let onFinishCb = jest.fn();
  timer.onStart(onStartCb);
  timer.onPause(onPauseCb);
  timer.onFinish(onFinishCb);

  timer.start();
  advanceTime(100);

  timer.pause();
  advanceTime(100);

  timer.stop();
  advanceTime(100);

  expect(onStartCb).toHaveBeenCalledTimes(1);
  expect(onStartCb).toHaveBeenCalledBefore(onPauseCb);
  expect(onStartCb).toHaveBeenCalledBefore(onFinishCb);

  expect(onPauseCb).toHaveBeenCalledTimes(1);
  expect(onPauseCb).toHaveBeenCalledAfter(onStartCb);
  expect(onPauseCb).toHaveBeenCalledBefore(onFinishCb);

  expect(onFinishCb).toHaveBeenCalledTimes(1);
  expect(onFinishCb).toHaveBeenCalledAfter(onStartCb);
  expect(onFinishCb).toHaveBeenCalledAfter(onPauseCb);
});

it('onFinish callback is called after the last event occurs and the timer is considered finished', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let onFinishCb = jest.fn();
  timer.onFinish(onFinishCb);

  timer.start();
  advanceTime(310000+1000); //Program duration + 1s

  expect(timer.running).toEqual(false);
  expect(timer.paused).toEqual(false);
  expect(timer.stopped).toEqual(true);

  expect(onFinishCb).toHaveBeenCalledTimes(1);
});

it('', () => {

});
