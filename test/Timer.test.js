import { newTimerEvent, newTimer } from '../src/Timer';

let noop = () => {};
let mainEvent =
  newTimerEvent(`MainTimer`, 0, 10000, noop, [
    newTimerEvent(`l2_timer0`, 0, 2000, noop),
    newTimerEvent(`l2_timer1`, 2000, 7000, noop, [
      newTimerEvent(`l3_timer1.1`, 2000, 3000, noop),
      newTimerEvent(`l3_timer1.2`, 5000, 3000, noop)
    ])
  ]);

test('seeking sets current time', () => {
  let timer = newTimer(noop, noop, newTimerEvent("a", 0, 10000, noop, []));
  timer.seek(5000);
  expect(timer.getCurrentTime()).toBe(5000);
});

test('seeking sets current event properly', () => {
  let timer = newTimer(noop, noop, mainEvent);
  timer.seek(6000);
  let events = timer.currentEvents();
  expect(events[0].name).toBe("MainTimer");
  expect(events[1].name).toBe("l2_timer1");
  expect(events[2].name).toBe("l3_timer1.2");
});