// const Timer = require('../src/index');
import { Timer } from '../src/index';

test('sums up timer event duration during timer initialization', () => {
  expect((function(){
    let timer = Object.create(Timer);
    timer.init(null, null, null, [{duration: 1}, {duration: 2}, {duration: 3}]);
    return timer.duration;
  })()).toBe(6);
});