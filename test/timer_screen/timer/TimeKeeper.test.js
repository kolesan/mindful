import { log, nowKeeper } from '../../TestUtils';
import timeKeeper from '../../../src/timer_screen/timer/TimeKeeper';

jest.useFakeTimers();

let now;
function advanceTime(t) {
  jest.advanceTimersByTime(t);
  now.advance(t);
}

beforeEach(() => {
  now = nowKeeper();
});

it('can be created', () => {
  let keeper = timeKeeper(0, now);

  expect(keeper.onProc).toBeFunction();

  expect(keeper.start).toBeFunction();
  expect(keeper.pause).toBeFunction();
  expect(keeper.stop).toBeFunction();
  expect(keeper.seek).toBeFunction();

  expect(keeper.running).toEqual(false);
  expect(keeper.paused).toEqual(false);
  expect(keeper.stopped).toEqual(true);

  expect(keeper).toContainAllKeys([
    "onProc", "start", "pause", "stop", "seek", "running", "paused", "stopped"
  ]);
});

describe.each`
  interval  | timesCalled | callTimeArr
  ${500}    | ${7}        | ${[500, 1000, 1500, 2000, 2500, 3000, 3500]}
  ${600}    | ${5}        | ${[600, 1200, 1800, 2400, 3000]}
  ${1000}   | ${3}        | ${[1000, 2000, 3000]}
  ${1100}   | ${3}        | ${[1100, 2200, 3300]}
`(`can bind a proc callback with interval $interval`, ({interval, timesCalled, callTimeArr}) => {
  it(`which will be called ${timesCalled} times during 3500 time period [${callTimeArr}]`, () => {
    let keeper = timeKeeper(interval, now);
    let procCb = jest.fn();
    keeper.onProc(procCb);

    keeper.start();
    advanceTime(3500);
    keeper.stop();

    expect(procCb).toBeCalledTimes(timesCalled);
    callTimeArr.forEach(it => expect(procCb).toHaveBeenCalledWith(it));
  });
});

it(`defaults interval to 1000`, () => {
  let keeper = timeKeeper(undefined, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(4500);
  keeper.stop();

  expect(procCb).toBeCalledTimes(4);
  [1000, 2000, 3000, 4000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );
});

it(`defaults nowKeeper to Date`, () => {
  let dateNow = Date.now;
  Date.now = jest.fn();


  let keeper = timeKeeper();
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(4500);
  keeper.stop();

  expect(Date.now).toBeCalledTimes(1);
  expect(procCb).toBeCalledTimes(4);
  [1000, 2000, 3000, 4000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );


  Date.now = dateNow;
});

it('can be started, paused and then resumed', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(1500);
  keeper.pause();

  advanceTime(5500);

  keeper.start();
  advanceTime(2500);
  keeper.stop();

  expect(procCb).toBeCalledTimes(4);
  [1000, 2000, 3000, 4000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );
});

it('can be started, stopped and then started again', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(1500);
  keeper.stop();

  advanceTime(5500);

  keeper.start();
  advanceTime(2500);
  keeper.stop();

  expect(procCb).toBeCalledTimes(3);
  [1000, 1000, 2000].forEach(it =>
    expect(procCb).toHaveBeenCalledWith(it)
  );
});

it('can be paused right at the boundary of procs without any problem', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(1000);
  expect(procCb).toBeCalledTimes(1);
  expect(procCb).toHaveBeenCalledWith(1000);
  keeper.pause();

  advanceTime(1000);

  keeper.start();
  advanceTime(999);
  expect(procCb).toBeCalledTimes(1);
  keeper.pause();

  keeper.start();
  advanceTime(1001);
  expect(procCb).toBeCalledTimes(3);
  expect(procCb).toHaveBeenCalledWith(2000);
  expect(procCb).toHaveBeenCalledWith(3000);
  keeper.pause();
  keeper.stop();

  expect(procCb).toBeCalledTimes(3);
  [1000, 2000, 3000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );
});

it('allows seeking - setting the current time, without proccing the intermidiate procs', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(1000);
  keeper.seek(3400);
  advanceTime(600);
  keeper.stop();

  expect(procCb).toBeCalledTimes(2);
  [1000, 4000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );
});

it('allows seeking backwards', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(4000);
  keeper.seek(2500);
  advanceTime(700);
  keeper.stop();

  expect(procCb).toBeCalledTimes(5);
  [1000, 2000, 3000, 4000, 3000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );
});

it('stays paused after seeking (if was paused before)', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(2000);
  keeper.pause();
  keeper.seek(2500);
  expect(keeper.paused).toBeTrue();
  advanceTime(700);
  keeper.stop();

  expect(procCb).toBeCalledTimes(2);
  [1000, 2000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );
});

it('continues running after seeking (if was running before)', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(2000);
  keeper.seek(2500);
  expect(keeper.running).toBeTrue();
  advanceTime(700);
  keeper.stop();

  expect(procCb).toBeCalledTimes(3);
  [1000, 2000, 3000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );
});

it('becomes paused after seeking if it was stopped', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.seek(2500);
  expect(keeper.paused).toBeTrue();

  keeper.start();
  advanceTime(700);
  keeper.stop();

  expect(procCb).toBeCalledTimes(1);
  [3000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );
});

it('does not proc if seeked right on the proc boundary', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  keeper.seek(1000);
  advanceTime(1);
  keeper.seek(2000);
  advanceTime(1);
  keeper.seek(3000);
  advanceTime(1);
  keeper.stop();

  expect(procCb).toHaveBeenCalledTimes(0);
});

it('can be stopped through first onProc callback', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn(() => keeper.stop());
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(5000);

  expect(keeper.stopped).toBeTrue();
  expect(procCb).toHaveBeenCalledTimes(1);
  [1000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );
});

it('can be stopped through onProc callback', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  procCb.mockImplementationOnce();
  procCb.mockImplementationOnce();
  procCb.mockImplementationOnce(() => keeper.stop());
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(5000);

  expect(keeper.stopped).toBeTrue();
  expect(procCb).toHaveBeenCalledTimes(3);
  [1000, 2000, 3000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );
});

it('can be paused through onProc callback', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  procCb.mockImplementationOnce();
  procCb.mockImplementationOnce();
  procCb.mockImplementationOnce(() => keeper.pause());
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(5000);
  expect(keeper.paused).toBeTrue();
  keeper.stop();

  expect(procCb).toHaveBeenCalledTimes(3);
  [1000, 2000, 3000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );
});

it('can be seeked through onProc callback', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  procCb.mockImplementationOnce();
  procCb.mockImplementationOnce();
  procCb.mockImplementationOnce(() => keeper.seek(500));
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(5000);
  keeper.stop();

  expect(procCb).toHaveBeenCalledTimes(5);
  [1000, 2000, 3000, 1000, 2000].forEach(
    it => expect(procCb).toHaveBeenCalledWith(it)
  );
});

test('starting does nothing if already started', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  keeper.start();
  advanceTime(1500);
  keeper.start();
  keeper.start();
  advanceTime(1500);
  keeper.start();
  keeper.stop();

  expect(procCb).toBeCalledTimes(3);
  [1000, 2000, 3000].forEach(it =>
    expect(procCb).toHaveBeenCalledWith(it)
  );
});

test('pausing does nothing if already paused', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(1500);
  keeper.pause();
  keeper.pause();
  advanceTime(1500);
  keeper.pause();
  keeper.pause();
  keeper.stop();

  expect(procCb).toBeCalledTimes(1);
  [1000].forEach(it =>
    expect(procCb).toHaveBeenCalledWith(it)
  );
});

test('stopping does nothing if already stopped', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  advanceTime(2500);
  keeper.stop();
  keeper.stop();
  advanceTime(1500);
  keeper.stop();
  keeper.stop();

  expect(procCb).toBeCalledTimes(2);
  [1000, 2000].forEach(it =>
    expect(procCb).toHaveBeenCalledWith(it)
  );
});

test('start changes running to `true` and other state getter to `false`', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  expect(keeper.running).toEqual(true);
  expect(keeper.paused).toEqual(false);
  expect(keeper.stopped).toEqual(false);
  keeper.stop();
});

test('pause changes paused to `true` and other state getter to `false`', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  keeper.pause();
  expect(keeper.running).toEqual(false);
  expect(keeper.paused).toEqual(true);
  expect(keeper.stopped).toEqual(false);
  keeper.stop();
});

test('stop changes stopped to `true` and other state getter to `false`', () => {
  let keeper = timeKeeper(1000, now);
  let procCb = jest.fn();
  keeper.onProc(procCb);

  keeper.start();
  keeper.stop();
  expect(keeper.running).toEqual(false);
  expect(keeper.paused).toEqual(false);
  expect(keeper.stopped).toEqual(true);
});