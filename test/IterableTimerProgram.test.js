import { last, log, logo } from "./TestUtils";
import iterableTimerProgram from "../src/timer_screen/timer/IterableTimerProgram";
import { ffgong, fsgong, noop, sgong } from "../src/EventCallbacks";

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
    logo(it.map(pathElem => { return {name: pathElem.name, start: pathElem.startTime} }));
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

test('Zero iteration loops should be ignored', () => {
  let program = {
    mainEvent: {
      element: "event",
      name: "NoLoops",
      duration: 310000,
      callback: "noop",
      children: [
        {
          element: "loop",
          iterations: 0,
          duration: 0,
          children: [
            {
              element: "event",
              name: "I exist, but I do not",
              duration: 60000,
              callback: "ffgong",
              children: []
            }
          ]
        }
      ]
    }
  };

  let iterable = iterableTimerProgram(program);

  let result = [];
  for (let it of iterable) {
    result.push(last(it).name);
  }

  expect(result).toEqual([
    "NoLoops"
  ]);
});

test('Callbacks should be deserialized to functions', () => {
  let iterable = iterableTimerProgram(program);

  for (let it of iterable) {
    let callback = last(it).callback;
    expect(Function.prototype.isPrototypeOf(callback)).toEqual(true);
  }
});

test('Generated events have same ids for every iterator', () => {
  let iterable = iterableTimerProgram(program);

  let idsA = [];
  for(let it of iterable) {
    idsA.push(last(it).id);
  }

  let idsB = [];
  for(let it of iterable) {
    logo(it);
    idsB.push(last(it).id);
  }

  expect(idsA).toEqual(idsB);
});

test('Loop generates unique ids for all virtual children', () => {
  let program = {
    mainEvent: {
      element: "event",
      name: "Loops",
      duration: 310000,
      callback: "noop",
      children: [
        {
          element: "loop",
          iterations: 3,
          duration: 0,
          children: [
            {
              element: "event",
              name: "1",
              duration: 60000,
              callback: "ffgong",
              children: []
            },
            {
              element: "event",
              name: "2",
              duration: 60000,
              callback: "ffgong",
              children: []
            },
            {
              element: "event",
              name: "3",
              duration: 60000,
              callback: "ffgong",
              children: []
            }
          ]
        }
      ]
    }
  };

  let iterable = iterableTimerProgram(program);

  let ids = [];
  for(let it of iterable) {
    ids.push(last(it).id);
  }
  ids.pop(); //Remove id of mainEvent, we only need the looped events

  let unique = ids.reduce((a, b) => a.includes(b) ? a : a.concat(b), []);
  expect(ids).toEqual(unique);
});

test('Can iterate backwards', () => {
  let iterable = iterableTimerProgram(program);

  let result = [];

  let backwardsIterator = iterable[Symbol.iterator](-1);
  let iterationResult;
  while((iterationResult = backwardsIterator.next(-1)) && !iterationResult.done) {
    result.push(iterationResult.value.map(child => child.name));
  }

  expect(result).toEqual([
    ["Mindful Yoga"],
    ["Mindful Yoga", "Chill"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 3"],
    ["Mindful Yoga", "Hold pose 3", "2/2"],
    ["Mindful Yoga", "Hold pose 3", "1/2"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 2"],
    ["Mindful Yoga", "Hold pose 2", "2/2"],
    ["Mindful Yoga", "Hold pose 2", "1/2"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 1"],
    ["Mindful Yoga", "Hold pose 1", "2/2"],
    ["Mindful Yoga", "Hold pose 1", "1/2"],
    ["Mindful Yoga", "Preparation"]
  ]);
});

test('Start times should be set correctly when iterating backwards', () => {
  let iterable = iterableTimerProgram(program);

  let result = [];

  let backwardsIterator = iterable[Symbol.iterator](-1);
  let iterationResult;
  while((iterationResult = backwardsIterator.next(-1)) && !iterationResult.done) {
    result.push(last(iterationResult.value).startTime);
  }

  expect(result).toEqual([
    0,
    240000,
    230000,
    170000,
    200000,
    170000,
    160000,
    100000,
    130000,
    100000,
    90000,
    30000,
    60000,
    30000,
    0
  ]);
});

test('Loop generates unique ids for all virtual children when iterating backwards', () => {
  let program = {
    mainEvent: {
      element: "event",
      name: "Loops",
      duration: 310000,
      callback: "noop",
      children: [
        {
          element: "loop",
          iterations: 3,
          duration: 0,
          children: [
            {
              element: "event",
              name: "1",
              duration: 60000,
              callback: "ffgong",
              children: []
            },
            {
              element: "event",
              name: "2",
              duration: 60000,
              callback: "ffgong",
              children: []
            },
            {
              element: "event",
              name: "3",
              duration: 60000,
              callback: "ffgong",
              children: []
            }
          ]
        }
      ]
    }
  };

  let iterable = iterableTimerProgram(program);

  let ids = [];

  let backwardsIterator = iterable[Symbol.iterator](-1);
  backwardsIterator.next(-1); //Skip id of mainEvent, we only need the looped events

  let iterationResult;
  while((iterationResult = backwardsIterator.next(-1)) && !iterationResult.done) {
    ids.push(last(iterationResult.value).id);
  }

  let unique = ids.reduce((a, b) => a.includes(b) ? a : a.concat(b), []);
  expect(ids).toEqual(unique);
});

test('Ids generated while going backwards are the same as when going forward', () => {
  let iterable = iterableTimerProgram(program);

  let idsForward = [];
  for(let it of iterable) {
    idsForward.push(last(it).id);
  }

  let idsBacwards = [];

  let backwardsIterator = iterable[Symbol.iterator](-1);
  let iterationResult;
  while((iterationResult = backwardsIterator.next(-1)) && !iterationResult.done) {
    idsBacwards.push(last(iterationResult.value).id);
  }

  expect(idsForward).toEqual(idsBacwards.reverse());
});

test('Ids generated while going backwards are the same as when going forward', () => {
  let iterable = iterableTimerProgram(program);

  let idsForward = [];
  for(let it of iterable) {
    idsForward.push(last(it).id);
  }

  let idsBacwards = [];

  let backwardsIterator = iterable[Symbol.iterator](-1);
  let iterationResult;
  while((iterationResult = backwardsIterator.next(-1)) && !iterationResult.done) {
    idsBacwards.push(last(iterationResult.value).id);
  }

  expect(idsForward).toEqual(idsBacwards.reverse());
});

test('Can change iteration direction at any time', () => {
  let iterable = iterableTimerProgram(program);

  let result = [];

  function toNames(path) {
    return path.map(it => it.name);
  }
  let iterator = iterable[Symbol.iterator]();
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next(-1).value));
  result.push(toNames(iterator.next(-1).value));
  result.push(toNames(iterator.next(-1).value));
  result.push(toNames(iterator.next(-1).value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next(-1).value));
  result.push(toNames(iterator.next(-1).value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));

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
    ["Mindful Yoga", "Hold pose 2"], //b
    ["Mindful Yoga", "Hold pose 2", "2/2"], //b
    ["Mindful Yoga", "Hold pose 2", "1/2"], //b
    ["Mindful Yoga", "Change pose"],  //b
    ["Mindful Yoga", "Hold pose 2", "1/2"],
    ["Mindful Yoga", "Hold pose 2", "2/2"],
    ["Mindful Yoga", "Hold pose 2"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 3", "1/2"],
    ["Mindful Yoga", "Hold pose 3", "2/2"],
    ["Mindful Yoga", "Hold pose 3"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Chill"],
    ["Mindful Yoga", "Change pose"], //b
    ["Mindful Yoga", "Hold pose 3"], //b
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Chill"],
    ["Mindful Yoga"],
    undefined
  ]);
});

test('Ids are always the same even when changing direction mid iteration', () => {
  let iterable = iterableTimerProgram(program);

  let result = [];

  function toIds(path) {
    return path.map(it => it.id);
  }
  let iterator = iterable[Symbol.iterator]();
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next(-1).value));
  result.push(toIds(iterator.next(-1).value));
  result.push(toIds(iterator.next(-1).value));
  result.push(toIds(iterator.next(-1).value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next(-1).value));
  result.push(toIds(iterator.next(-1).value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));

  expect(result).toEqual([
    ["0", "00"],
    ["0", "010", "0100"],
    ["0", "010", "0101"],
    ["0", "010"],
    ["0", "02"],
    ["0", "030", "0300"],
    ["0", "031", "0310"],
    ["0", "03"],
    ["0", "04"],
    ["0", "03"], //b
    ["0", "031", "0310"], //b
    ["0", "030", "0300"], //b
    ["0", "02"],  //b
    ["0", "030", "0300"],
    ["0", "031", "0310"],
    ["0", "03"],
    ["0", "04"],
    ["0", "050", "0500"],
    ["0", "051", "0510"],
    ["0", "05"],
    ["0", "06"],
    ["0", "07"],
    ["0", "06"], //b
    ["0", "05"], //b
    ["0", "06"],
    ["0", "07"],
    ["0"],
    undefined
  ]);
});

test('StartTimes are always set properly even when changing direction mid iteration', () => {
  let iterable = iterableTimerProgram(program);

  let result = [];

  function toStartTime(path) {
    return path.map(it => it.startTime);
  }
  let iterator = iterable[Symbol.iterator]();
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next(-1).value));
  result.push(toStartTime(iterator.next(-1).value));
  result.push(toStartTime(iterator.next(-1).value));
  result.push(toStartTime(iterator.next(-1).value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next(-1).value));
  result.push(toStartTime(iterator.next(-1).value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));

  expect(result).toEqual([
    [0, 0],
    [0, 30000, 30000],
    [0, "010", "0101"],
    [0, "010"],
    [0, "02"],
    [0, "030", "0300"],
    [0, "031", "0310"],
    [0, "03"],
    [0, "04"],
    [0, "03"], //b
    [0, "031", "0310"], //b
    [0, "030", "0300"], //b
    [0, "02"],  //b
    [0, "030", "0300"],
    [0, "031", "0310"],
    [0, "03"],
    [0, "04"],
    [0, "050", "0500"],
    [0, "051", "0510"],
    [0, "05"],
    [0, "06"],
    [0, "07"],
    [0, "06"], //b
    [0, "05"], //b
    [0, "06"],
    [0, "07"],
    [0],
    undefined
  ]);
});