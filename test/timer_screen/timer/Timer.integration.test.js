import { log, logo, nowKeeper } from "../../TestUtils";

import { newTimer } from '../../../src/timer_screen/timer/Timer';
import timeKeeper from '../../../src/timer_screen/timer/TimeKeeper';
import eventTraversal from '../../../src/timer_screen/timer/EventTraversal';
import iterableTimerProgram from '../../../src/timer_screen/timer/IterableTimerProgram';

let notALeafCb = jest.fn();
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
  notALeafCb.mockReset();
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
    callback: notALeafCb,
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
            callback: notALeafCb,
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

it('timer is considered finished if it was not paused but time passed > program duration', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let onFinishCb = jest.fn();
  timer.onFinish(onFinishCb);

  timer.start();
  advanceTime(310000 + 1000); //Program duration + 1s

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
  advanceTime(1000);

  timer.pause();
  advanceTime(1000);

  timer.stop();
  advanceTime(1000);

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
  advanceTime(310000 + 1000); //Program duration + 1s

  expect(onFinishCb).toHaveBeenCalledTimes(1);
});

it('onTick callback is called every time timer tick occurs', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let onTickCb = jest.fn();
  timer.onTick(onTickCb);

  timer.start();
  advanceTime(310000 + 1000); //Program duration + 1s

  expect(onTickCb).toHaveBeenCalledTimes(310);
});

it('onTick callback does not occur during pause or stop', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let onTickCb = jest.fn();
  timer.onTick(onTickCb);

  timer.start();
  advanceTime(3000);
  timer.pause();
  advanceTime(5000);
  timer.start();
  advanceTime(3000);
  timer.stop();
  advanceTime(5000);

  expect(onTickCb).toHaveBeenCalledTimes(6);
  [1000, 2000, 3000, 4000, 5000, 6000]
    .forEach(it => expect(onTickCb).toHaveBeenCalledWith(it));
});

it('onLevelUpdate callback occurs every time an event finishes', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let onLevelUpdateCb = jest.fn();
  timer.onLevelUpdate(onLevelUpdateCb);

  timer.start();
  advanceTime(310000 + 1000); //Program duration + 1s

  expect(onLevelUpdateCb).toHaveBeenCalledTimes(11);
});

it('onLevelUpdate callbacks provide diff objects that represent changes in timer event `stack`', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let onLevelUpdateCb = jest.fn();
  timer.onLevelUpdate(onLevelUpdateCb);

  timer.start();
  advanceTime(310000 + 1000); //Program duration + 1s

  //.mock.calls[0][0] => First call, first argument
  //.mock.calls[1][0] => Second call, first argument
  //etc.
  let diffs = onLevelUpdateCb.mock.calls.map(it => it[0]);

  let expectedDiffs = [
    {
      added: [
        {
          id: expect.anything(),
          name: "Hold pose 1",
          duration: 60000,
          startTime: 30000,
          endTime: 90000,
          callback: notALeafCb
        },
        {
          id: expect.anything(),
          name: "1/2",
          duration: 30000,
          startTime: 30000,
          endTime: 60000,
          callback: pose12Cb
        }
      ],
      removed: [
        {
          id: expect.anything(),
          name: "Preparation",
          duration: 30000,
          startTime: 0,
          endTime: 30000,
          callback: prepCb
        }
      ]
    },
    {
      added: [
        {
          id: expect.anything(),
          name: "2/2",
          duration: 30000,
          startTime: 60000,
          endTime: 90000,
          callback: pose22Cb
        }
      ],
      removed: [
        {
          id: expect.anything(),
          name: "1/2",
          duration: 30000,
          startTime: 30000,
          endTime: 60000,
          callback: pose12Cb
        }
      ]
    },
    {
      added: [
        {
          id: expect.anything(),
          name: "Change pose",
          duration: 10000,
          startTime: 90000,
          endTime: 100000,
          callback: changePoseCb
        }
      ],
      removed: [
        {
          id: expect.anything(),
          name: "Hold pose 1",
          duration: 60000,
          startTime: 30000,
          endTime: 90000,
          callback: notALeafCb
        },
        {
          id: expect.anything(),
          name: "2/2",
          duration: 30000,
          startTime: 60000,
          endTime: 90000,
          callback: pose22Cb
        }
      ]
    },
    {
      added: [
        {
          id: expect.anything(),
          name: "Hold pose 2",
          duration: 60000,
          startTime: 100000,
          endTime: 160000,
          callback: notALeafCb
        },
        {
          id: expect.anything(),
          name: "1/2",
          duration: 30000,
          startTime: 100000,
          endTime: 130000,
          callback: pose12Cb
        }
      ],
      removed: [
        {
          id: expect.anything(),
          name: "Change pose",
          duration: 10000,
          startTime: 90000,
          endTime: 100000,
          callback: changePoseCb
        }
      ]
    },
    {
      added: [
        {
          id: expect.anything(),
          name: "2/2",
          duration: 30000,
          startTime: 130000,
          endTime: 160000,
          callback: pose22Cb
        }
      ],
      removed: [
        {
          id: expect.anything(),
          name: "1/2",
          duration: 30000,
          startTime: 100000,
          endTime: 130000,
          callback: pose12Cb
        }
      ]
    },
    {
      added: [
        {
          id: expect.anything(),
          name: "Change pose",
          duration: 10000,
          startTime: 160000,
          endTime: 170000,
          callback: changePoseCb
        }
      ],
      removed: [
        {
          id: expect.anything(),
          name: "Hold pose 2",
          duration: 60000,
          startTime: 100000,
          endTime: 160000,
          callback: notALeafCb
        },
        {
          id: expect.anything(),
          name: "2/2",
          duration: 30000,
          startTime: 130000,
          endTime: 160000,
          callback: pose22Cb
        }
      ]
    },
    {
      added: [
        {
          id: expect.anything(),
          name: "Hold pose 3",
          duration: 60000,
          startTime: 170000,
          endTime: 230000,
          callback: notALeafCb
        },
        {
          id: expect.anything(),
          name: "1/2",
          duration: 30000,
          startTime: 170000,
          endTime: 200000,
          callback: pose12Cb
        }
      ],
      removed: [
        {
          id: expect.anything(),
          name: "Change pose",
          duration: 10000,
          startTime: 160000,
          endTime: 170000,
          callback: changePoseCb
        }
      ]
    },
    {
      added: [
        {
          id: expect.anything(),
          name: "2/2",
          duration: 30000,
          startTime: 200000,
          endTime: 230000,
          callback: pose22Cb
        }
      ],
      removed: [
        {
          id: expect.anything(),
          name: "1/2",
          duration: 30000,
          startTime: 170000,
          endTime: 200000,
          callback: pose12Cb
        }
      ]
    },
    {
      added: [
        {
          id: expect.anything(),
          name: "Change pose",
          duration: 10000,
          startTime: 230000,
          endTime: 240000,
          callback: changePoseCb
        }
      ],
      removed: [
        {
          id: expect.anything(),
          name: "Hold pose 3",
          duration: 60000,
          startTime: 170000,
          endTime: 230000,
          callback: notALeafCb
        },
        {
          id: expect.anything(),
          name: "2/2",
          duration: 30000,
          startTime: 200000,
          endTime: 230000,
          callback: pose22Cb
        }
      ]
    },
    {
      added: [
        {
          id: expect.anything(),
          name: "Chill",
          duration: 70000,
          startTime: 240000,
          endTime: 310000,
          callback: chillCb
        }
      ],
      removed: [
        {
          id: expect.anything(),
          name: "Change pose",
          duration: 10000,
          startTime: 230000,
          endTime: 240000,
          callback: changePoseCb
        }
      ]
    },
    {
      added: [],
      removed: [
        {
          id: expect.anything(),
          name: "Mindful Yoga",
          duration: 310000,
          startTime: 0,
          endTime: 310000,
          callback: notALeafCb
        },
        {
          id: expect.anything(),
          name: "Chill",
          duration: 70000,
          startTime: 240000,
          endTime: 310000,
          callback: chillCb
        }
      ]
    },
  ];

  expect(expectedDiffs).toEqual(diffs);
});

it('calls event callbacks', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));

  timer.start();
  advanceTime(310000  + 1000); //Duration + 1s

  expect(notALeafCb).toHaveBeenCalledTimes(0); //Callbacks of events with child events should not be called
  expect(prepCb).toHaveBeenCalledTimes(1);
  expect(pose12Cb).toHaveBeenCalledTimes(3);
  expect(pose22Cb).toHaveBeenCalledTimes(3);
  expect(changePoseCb).toHaveBeenCalledTimes(3);
  expect(chillCb).toHaveBeenCalledTimes(1);
});

it('can seek forward', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let tickCb = jest.fn();
  timer.onTick(tickCb);

  timer.seek(70000); //Should be at [yoga, hold, 2,2]
  timer.start();
  advanceTime(310000 - 70000 + 1000); //Duration - seek time + 1s

  expect(timer.stopped).toBeTrue();
  expect(tickCb).toHaveBeenCalledTimes(240);
});

it('can seek forward multiple times', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let tickCb = jest.fn();
  timer.onTick(tickCb);

  timer.start();
  timer.seek(70000); //Should be at [yoga, hold 1, 2/2]
  advanceTime(40000); //Should be at [yoga, hold 2, 1/2]
  timer.seek(180000); //Should be at [yoga, hold 3, 1/2]
  advanceTime(310000); //Any big number, enough to end

  expect(timer.stopped).toBeTrue();
  expect(tickCb).toHaveBeenCalledTimes(170); //310 - 70x2 (for two seeks forward)

  expect(prepCb).toHaveBeenCalledTimes(0); //Seeked over it in first seek
  expect(pose12Cb).toHaveBeenCalledTimes(1); //Only in hold 3 after both seeks
  expect(pose22Cb).toHaveBeenCalledTimes(2); //in hold 1 and hold 3
  expect(changePoseCb).toHaveBeenCalledTimes(2); // hold 1 and hold 3
  expect(chillCb).toHaveBeenCalledTimes(1);
});

it('can seek backwards', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let tickCb = jest.fn();
  timer.onTick(tickCb);

  timer.start();
  advanceTime(70000); //Should be at [yoga, hold 1, 2/2]
  timer.seek(40000); //Should be at [yoga, hold 1, 1/2]
  advanceTime(310000);

  expect(timer.stopped).toBeTrue();
  expect(tickCb).toHaveBeenCalledTimes(70+(310-40));

  expect(prepCb).toHaveBeenCalledTimes(1);
  expect(pose12Cb).toHaveBeenCalledTimes(4);
  expect(pose22Cb).toHaveBeenCalledTimes(3);
  expect(changePoseCb).toHaveBeenCalledTimes(3);
  expect(chillCb).toHaveBeenCalledTimes(1);
});

it('can seek backwards multiple times', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let tickCb = jest.fn();
  timer.onTick(tickCb);

  timer.start();
  advanceTime(70000); //Should be at [yoga, hold 1, 2/2]
  timer.seek(40000); //Should be at [yoga, hold 1, 1/2]
  advanceTime(70000); //Should be at [yoga, hold 2, 1/2]
  timer.seek(40000); //Should be at [yoga, hold 1, 1/2]
  advanceTime(310000);

  expect(timer.stopped).toBeTrue();
  expect(tickCb).toHaveBeenCalledTimes(70+70+(310-40));

  expect(prepCb).toHaveBeenCalledTimes(1);
  expect(pose12Cb).toHaveBeenCalledTimes(5);
  expect(pose22Cb).toHaveBeenCalledTimes(4);
  expect(changePoseCb).toHaveBeenCalledTimes(4);
  expect(chillCb).toHaveBeenCalledTimes(1);
});

it('can seek backwards to 0', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let tickCb = jest.fn();
  timer.onTick(tickCb);

  timer.start();
  advanceTime(70000); //Should be at [yoga, hold 1, 2/2]
  timer.seek(0); //Should be at [yoga, prep]
  advanceTime(310000); //Whole duration

  expect(timer.stopped).toBeTrue();
  expect(tickCb).toHaveBeenCalledTimes(310+70);

  expect(prepCb).toHaveBeenCalledTimes(2);
  expect(pose12Cb).toHaveBeenCalledTimes(4);
  expect(pose22Cb).toHaveBeenCalledTimes(3);
  expect(changePoseCb).toHaveBeenCalledTimes(3);
  expect(chillCb).toHaveBeenCalledTimes(1);
});

it('can seek forward and backward multiple times', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let tickCb = jest.fn();
  timer.onTick(tickCb);

  timer.start();
  timer.seek(80000);
  advanceTime(30000); //Happened(2/2, change)
  timer.seek(20000);
  advanceTime(90000); //Happened(prep, 1/2, 2/2, change)
  timer.seek(300000);
  advanceTime(310000); //Happened(chill)

  expect(timer.stopped).toBeTrue();
  expect(tickCb).toHaveBeenCalledTimes(30+90+10);

  expect(prepCb).toHaveBeenCalledTimes(1);
  expect(pose12Cb).toHaveBeenCalledTimes(1);
  expect(pose22Cb).toHaveBeenCalledTimes(2);
  expect(changePoseCb).toHaveBeenCalledTimes(2);
  expect(chillCb).toHaveBeenCalledTimes(1);
});

it('becomes paused if seeked while stopped', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));

  timer.stop();
  timer.seek(70000);

  expect(timer.paused).toBeTrue();
});

it('continues running if seeked while running', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));

  timer.start();
  timer.seek(70000);

  expect(timer.running).toBeTrue();

  timer.stop();
});

it('can seek almost to the end', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let tickCb = jest.fn();
  timer.onTick(tickCb);

  timer.start();
  timer.seek(310000 - 1);
  advanceTime(1);

  expect(timer.stopped).toBeTrue();
  expect(tickCb).toHaveBeenCalledTimes(1);
  expect(chillCb).toHaveBeenCalledTimes(1);
});

it('can seek to the end', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let tickCb = jest.fn();
  timer.onTick(tickCb);

  timer.start();
  timer.seek(310000);

  expect(timer.stopped).toBeTrue();
  expect(tickCb).toHaveBeenCalledTimes(0);
  expect(chillCb).toHaveBeenCalledTimes(0);
});

it('seeks to the end if seeked over the end', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));
  let tickCb = jest.fn();
  timer.onTick(tickCb);

  timer.start();
  timer.seek(310000*2);

  expect(timer.stopped).toBeTrue();
  expect(tickCb).toHaveBeenCalledTimes(0);
  expect(chillCb).toHaveBeenCalledTimes(0);
});

it('returns current events branch', () => {
  let timer = newTimer(timeKeeper(1000, now), eventTraversal(iterableTimerProgram(program)));

  function toNames(events) {
    return events.map(it => it.name);
  }

  timer.start();
  expect(toNames(timer.currentEvents)).toEqual(["Mindful Yoga", "Preparation"]);

  advanceTime(40000);
  expect(toNames(timer.currentEvents)).toEqual(["Mindful Yoga", "Hold pose 1", "1/2"]);

  advanceTime(40000);
  expect(toNames(timer.currentEvents)).toEqual(["Mindful Yoga", "Hold pose 1", "2/2"]);

  advanceTime(10000);
  expect(toNames(timer.currentEvents)).toEqual(["Mindful Yoga", "Change pose"]);

  advanceTime(70000);
  expect(toNames(timer.currentEvents)).toEqual(["Mindful Yoga", "Change pose"]);

  advanceTime(90000);
  expect(toNames(timer.currentEvents)).toEqual(["Mindful Yoga", "Chill"]);

  timer.stop();
});

it('Calls callback on all events that happened since last tick', () => {
  let timer = newTimer(timeKeeper(100000, now), eventTraversal(iterableTimerProgram(program)));
  let tickCb = jest.fn();
  timer.onTick(tickCb);

  timer.start();
  advanceTime(100000);
  expect(tickCb).toHaveBeenCalledTimes(1);

  expect(prepCb).toHaveBeenCalledTimes(1);
  expect(pose12Cb).toHaveBeenCalledTimes(1);
  expect(pose22Cb).toHaveBeenCalledTimes(1);
  expect(changePoseCb).toHaveBeenCalledTimes(1);
  expect(chillCb).toHaveBeenCalledTimes(0);

  advanceTime(310000);

  expect(timer.stopped).toBeTrue();
  expect(tickCb).toHaveBeenCalledTimes(4);

  expect(notALeafCb).toHaveBeenCalledTimes(0);
  expect(prepCb).toHaveBeenCalledTimes(1);
  expect(pose12Cb).toHaveBeenCalledTimes(3);
  expect(pose22Cb).toHaveBeenCalledTimes(3);
  expect(changePoseCb).toHaveBeenCalledTimes(3);
  expect(chillCb).toHaveBeenCalledTimes(1);
});