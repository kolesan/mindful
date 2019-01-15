import { log, logo, noop } from "../../TestUtils";

import { newTimer } from '../../../src/timer_screen/timer/Timer';

function MockEventTraversal() {
  return {
    next: jest.fn(),
    return: jest.fn(),
    reset: jest.fn(),
    seek: jest.fn(),

    head: {
      endTime: 100500,
      callback: jest.fn()
    },
    path: [],
    diff: {},

    finishedMock: jest.fn(),
    get finished() { return this.finishedMock(); }
  }
}

function MockTimeKeeper() {
  let state = "s";
  let _cb = noop;
  return {
    onProc: jest.fn(function(cb) { _cb = cb; return this; }),

    start: jest.fn(() => state = "r"),
    pause: jest.fn(() => state = "p"),
    stop: jest.fn(() => state = "s"),
    seek: jest.fn(),

    doProc(t) { _cb(t) },

    runningMock: jest.fn(() => state == "r"),
    pausedMock: jest.fn(() => state == "p"),
    stoppedMock: jest.fn(() => state == "s"),
    get running() { return this.runningMock(); },
    get paused() { return this.pausedMock(); },
    get stopped() { return this.stoppedMock(); },
  }
}

it('can be created', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

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
});

it('can bet started', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  timer.start();
  expect(timeKeeper.start).toHaveBeenCalledTimes(1);
  timer.stop();
});

it('can have onStart callback', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  let callCount = 0;
  timer.onStart(() => callCount++);

  timer.start();
  timer.stop();

  expect(callCount).toEqual(1);
});

test('start does nothing if already started', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  let callCount = 0;
  timer.onStart(() => callCount++);

  timer.start();
  timer.start();
  timer.start();
  timer.start();
  expect(callCount).toEqual(1);
  expect(timeKeeper.start).toHaveBeenCalledTimes(1);
  timer.stop();
});


it('can be paused', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  timer.start();
  timer.pause();
  timer.stop();
  expect(timeKeeper.pause).toHaveBeenCalledTimes(1);
});

it('can have onPause callback', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  let callCount = 0;
  timer.onPause(() => callCount++);

  timer.start();
  timer.pause();
  timer.stop();

  expect(callCount).toEqual(1);
});

test('pause does nothing if stopped or paused', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  let callCount = 0;
  timer.onPause(() => callCount++);

  timer.start();
  timer.pause();
  timer.pause();
  timer.stop();
  timer.pause();
  expect(callCount).toEqual(1);
  expect(timeKeeper.pause).toHaveBeenCalledTimes(1);
  timer.stop();
});


it('can bet stopped', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  timer.start();
  timer.stop();
  expect(timeKeeper.stop).toHaveBeenCalledTimes(1);
  expect(traversal.reset).toHaveBeenCalledTimes(1);
});

it('can bet stopped while paused', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  timer.start();
  timer.pause();
  timer.stop();
  expect(timeKeeper.stop).toHaveBeenCalledTimes(1);
});

it('can have onFinish callback', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  let callCount = 0;
  timer.onFinish(() => callCount++);

  timer.start();
  timer.stop();

  expect(callCount).toEqual(1);
});

test('stop does nothing if already stopped', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  let callCount = 0;
  timer.onFinish(() => callCount++);

  timer.start();
  timer.stop();
  timer.stop();
  timer.stop();
  expect(callCount).toEqual(1);
  expect(timeKeeper.stop).toHaveBeenCalledTimes(1);
});


it('can have onTick callback', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  let callCount = 0;
  timer.onTick(() => callCount++);

  timer.start();
  timeKeeper.doProc(10);
  timeKeeper.doProc(20);
  timer.stop();

  expect(callCount).toEqual(2);
});

it('can have onTick callback', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  let callCount = 0;
  timer.onTick(() => callCount++);

  timer.start();
  timeKeeper.doProc(10);
  timeKeeper.doProc(20);
  timer.stop();

  expect(callCount).toEqual(2);
});


it('can bee seeked to some time', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  let callCount = 0;
  let seekTime = 0;
  let seekDiff = [];
  timer.onSeek((t, diff) => {
    callCount++;
    seekTime = t;
    seekDiff = diff;
  });

  traversal.diff = [1, 2, 3];
  traversal.finishedMock.mockReturnValue(false);


  timer.seek(500);


  expect(traversal.seek).toHaveBeenCalledTimes(1);
  expect(traversal.seek).toHaveBeenCalledWith(500);

  expect(traversal.finishedMock).toHaveBeenCalledTimes(1);

  expect(timeKeeper.seek).toHaveBeenCalledTimes(1);
  expect(timeKeeper.seek).toHaveBeenCalledWith(500);
  expect(callCount).toEqual(1);
  expect(seekTime).toEqual(500);
  expect(seekDiff).toEqual([1, 2, 3]);
});

it('can bee seeked to some time that will finish the timer', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  let finishCallbackCallCount = 0;
  timer.onFinish(() => finishCallbackCallCount++);
  let seekCallbackCallCount = 0;
  timer.onSeek(() => seekCallbackCallCount++);

  traversal.finishedMock.mockReturnValue(true);


  timer.seek(500);


  expect(traversal.seek).toHaveBeenCalledTimes(1);
  expect(traversal.seek).toHaveBeenCalledWith(500);

  expect(traversal.finishedMock).toHaveBeenCalledTimes(1);

  expect(timeKeeper.stop).toHaveBeenCalledTimes(1);
  expect(traversal.reset).toHaveBeenCalledTimes(1);
  expect(finishCallbackCallCount).toEqual(1);
  expect(seekCallbackCallCount).toEqual(0);
});


it('binds timeKeeper onProc during creation', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  expect(timeKeeper.onProc).toHaveBeenCalledTimes(1);
});

it('calls callbacks of all events that should have happened since last tick', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  let levelUpdateCbCallCount = 0;
  let diff = [];
  timer.onLevelUpdate(d => {
    levelUpdateCbCallCount++;
    diff.push(d);
  });

  traversal.head.endTime = 200;
  traversal.next.mockImplementationOnce(() => {
    traversal.head.endTime = 500;
    traversal.diff = 1;
  });
  traversal.next.mockImplementationOnce(() => {
    traversal.head.endTime = 600;
    traversal.diff = 2;
  });
  traversal.next.mockImplementationOnce(() => {
    traversal.head.endTime = 1100;
    traversal.diff = 3;
  });


  timer.start();
  timeKeeper.doProc(1000);
  timer.stop();


  expect(traversal.head.callback).toHaveBeenCalledTimes(3);
  expect(levelUpdateCbCallCount).toEqual(3);
  expect(diff).toEqual([1, 2, 3]);
});

it('stops when traversal is finished', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  let levelUpdateCbCallCount = 0;
  timer.onLevelUpdate(() => levelUpdateCbCallCount++);
  let finishCallbackCallCount = 0;
  timer.onFinish(() => finishCallbackCallCount++);

  traversal.head.endTime = 200;
  traversal.next.mockImplementationOnce(() => {
    traversal.head.endTime = 1500;
  });
  traversal.finishedMock.mockReturnValueOnce(false);
  traversal.finishedMock.mockReturnValueOnce(true);

  timer.start();
  timeKeeper.doProc(1000);
  timeKeeper.doProc(2000);
  timer.stop();

  expect(traversal.finishedMock).toHaveBeenCalledTimes(2);
  expect(traversal.head.callback).toHaveBeenCalledTimes(2);
  expect(levelUpdateCbCallCount).toEqual(2);
  expect(finishCallbackCallCount).toEqual(1);
  expect(timeKeeper.stop).toHaveBeenCalledTimes(1);
  expect(traversal.reset).toHaveBeenCalledTimes(1);
});


it('currentEvents returns the current path in eventTraversal', () => {
  let timeKeeper = MockTimeKeeper();
  let traversal = MockEventTraversal();
  let timer = newTimer(timeKeeper, traversal);

  traversal.path = [1, 2, 3];

  expect(timer.currentEvents).toEqual([1, 2, 3]);
});
