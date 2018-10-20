import { Timer } from '../src/Timer';

test('sums up timer event duration during timer initialization', () => {
  expect((function(){
    let timer = Object.create(Timer);
    timer.init(null, null, null, [{duration: 1}, {duration: 2}, {duration: 3}]);
    return timer.duration;
  })()).toBe(6);
});

test('sums up empty array of timer events to 0 duration', () => {
  expect((function(){
    let timer = Object.create(Timer);
    timer.init(null, null, null, []);
    return timer.duration;
  })()).toBe(0);
});