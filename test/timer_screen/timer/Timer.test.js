import { newTimerEvent, newTimer } from '../../../src/timer_screen/timer/Timer';

let noop = () => {};
let mainEvent =
  newTimerEvent(`MainTimer`, 0, 10000, noop, [
    newTimerEvent(`l2_timer0`, 0, 2000, noop),
    newTimerEvent(`l2_timer1`, 2000, 7000, noop, [
      newTimerEvent(`l3_timer1.1`, 2000, 3000, noop),
      newTimerEvent(`l3_timer1.2`, 5000, 3000, noop)
    ])
  ]);

let traversal = MockEventTraversal();

function MockEventTraversal() {
  return {
    path: []
  }
}

test('Can create a Timer object', () => {
  let timer = newTimer(traversal);

  expect(timer.running).toBeDefined();
  expect(timer.paused).toBeDefined();
  expect(timer.stopped).toBeDefined();

  expect(timer.onStart).toBeDefined();
  expect(timer.onPause).toBeDefined();
  expect(timer.onFinish).toBeDefined();
  expect(timer.onTick).toBeDefined();
  expect(timer.onLevelUpdate).toBeDefined();
  expect(timer.onSeek).toBeDefined();

  expect(timer.init).toBeDefined();
  expect(timer.start).toBeDefined();
  expect(timer.seek).toBeDefined();
  expect(timer.pause).toBeDefined();
  expect(timer.stop).toBeDefined();

  expect(timer.currentEvents).toBeDefined();
});