import { last, logo } from "./TestUtils";
import iterableTimerProgram from "../src/timer_screen/timer/IterableTimerProgram";

window.customElements = {
  define() {}
};

let program = {
  id: "Yoga",
  title: "Yoga",
  icon: "fas fa-dumbbell",
  description: "3 1min poses, 10s for switching",
  mainEvent: {
    element: "event",
    name: "Mindful Yoga",
    duration: 310000,
    callback: "noop",
    children: [
      {
        element: "event",
        name: "Preparation",
        duration: 30000,
        callback: "ffgong",
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
            callback: "noop",
            children: [
              {
                element: "event",
                name: "1/2",
                duration: 30000,
                callback: "fsgong",
                children: []
              },
              {
                element: "event",
                name: "2/2",
                duration: 30000,
                callback: "fsgong",
                children: []
              }
            ]
          },
          {
            element: "event",
            name: "Change pose",
            duration: 10000,
            callback: "ffgong",
            children: []
          }
        ]
      },
      {
        element: "event",
        name: "Chill",
        duration: 70000,
        callback: "sgong",
        children: []
      }
    ]
  }
};

test('Created from a program and is an iterable', () => {
  let iterable = iterableTimerProgram(program);

  expect(iterable[Symbol.iterator]).toBeDefined();
});

test('Symbol.iterator should return a fresh unrelated instance of iterator', () => {
  let iterable = iterableTimerProgram(program);

  let iteratorA = iterable[Symbol.iterator]();
  let iteratorB = iterable[Symbol.iterator]();

  expect(last(iteratorA.next().value).name).toEqual("Preparation");
  expect(last(iteratorB.next().value).name).toEqual("Preparation");
  iteratorA.next();
  expect(last(iteratorA.next().value).name).toEqual("2/2");
  expect(last(iteratorB.next().value).name).toEqual("1/2");
});

test('Iterating through should yield a path with current node as last element at each iteration', () => {
  let iterable = iterableTimerProgram(program);

  let result = [];
  for (let it of iterable) {
    result.push(it.map(child => child.name));
  }

  expect(result).toEqual([
    ["Mindful Yoga", "Preparation"],
    ["Mindful Yoga", "Hold pose 1", "1/2"],
    ["Mindful Yoga", "Hold pose 1", "2/2"],
    ["Mindful Yoga", "Hold pose 1"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 2", "1/2"],
    ["Mindful Yoga", "Hold pose 2", "2/2"],
    ["Mindful Yoga", "Hold pose 2"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 3", "1/2"],
    ["Mindful Yoga", "Hold pose 3", "2/2"],
    ["Mindful Yoga", "Hold pose 3"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Chill"],
    ["Mindful Yoga"]
  ]);
});

test('Start times should be set', () => {
  let iterable = iterableTimerProgram(program);

  let result = [];
  for (let it of iterable) {
    // logo(it.map(pathElem => { return {name: pathElem.name, start: pathElem.startTime} }));
    result.push(last(it).startTime);
  }

  expect(result).toEqual([
    0,
    30000,
    60000,
    30000, //Going down the path (to parent event)
    90000,
    100000,
    130000,
    100000, //Going down the path (to parent event)
    160000,
    170000,
    200000,
    170000,  //Going down the path (to parent event)
    230000,
    240000,
    0  //Going down the path (to parent event)
  ]);
});