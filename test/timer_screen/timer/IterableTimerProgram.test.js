import { last, log, logo } from "../../TestUtils";
import iterableTimerProgram from "../../../src/timer_screen/timer/IterableTimerProgram";

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
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 2", "1/2"],
    ["Mindful Yoga", "Hold pose 2", "2/2"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 3", "1/2"],
    ["Mindful Yoga", "Hold pose 3", "2/2"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Chill"]
  ]);
});

test('Start times should be set', () => {
  let iterable = iterableTimerProgram(program);

  let result = [];
  for (let it of iterable) {
    result.push(last(it).startTime);
  }

  expect(result).toEqual([
    0,
    30000,
    60000,
    90000,
    100000,
    130000,
    160000,
    170000,
    200000,
    230000,
    240000
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

  expect(result).toEqual([]);
});

test('Generated events have same ids for every iterator', () => {
  let iterable = iterableTimerProgram(program);

  let idsA = [];
  for(let it of iterable) {
    idsA.push(last(it).id);
  }

  let idsB = [];
  for(let it of iterable) {
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
    ["Mindful Yoga", "Chill"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 3", "2/2"],
    ["Mindful Yoga", "Hold pose 3", "1/2"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 2", "2/2"],
    ["Mindful Yoga", "Hold pose 2", "1/2"],
    ["Mindful Yoga", "Change pose"],
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
    240000,
    230000,
    200000,
    170000,
    160000,
    130000,
    100000,
    90000,
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
  result.push(toNames(iterator.next(-1).value));
  result.push(toNames(iterator.next(-1).value));
  result.push(toNames(iterator.next().value));
  result.push(toNames(iterator.next().value));

  let last = iterator.next();
  expect(last.value).toBeUndefined();
  expect(last.done).toEqual(true);

  expect(result).toEqual([
    ["Mindful Yoga", "Preparation"],
    ["Mindful Yoga", "Hold pose 1", "1/2"],
    ["Mindful Yoga", "Hold pose 1", "2/2"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 2", "1/2"],
    ["Mindful Yoga", "Hold pose 2", "2/2"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 2", "2/2"], //b
    ["Mindful Yoga", "Hold pose 2", "1/2"], //b
    ["Mindful Yoga", "Change pose"],  //b
    ["Mindful Yoga", "Hold pose 1", "2/2"], //b
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 2", "1/2"],
    ["Mindful Yoga", "Hold pose 2", "2/2"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Hold pose 3", "1/2"],
    ["Mindful Yoga", "Hold pose 3", "2/2"],
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Chill"],
    ["Mindful Yoga", "Change pose"], //b
    ["Mindful Yoga", "Hold pose 3", "2/2"], //b
    ["Mindful Yoga", "Change pose"],
    ["Mindful Yoga", "Chill"]
  ]);
});

test('Ids are always the same even when changing direction mid iteration', () => {
  let iterable = iterableTimerProgram(program);

  function toIds(path) {
    return path.map(it => it.id);
  }

  let result = [];
  let iterator = iterable[Symbol.iterator]();
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
  result.push(toIds(iterator.next(-1).value));
  result.push(toIds(iterator.next(-1).value));
  result.push(toIds(iterator.next().value));
  result.push(toIds(iterator.next().value));

  let last = iterator.next();
  expect(last.value).toBeUndefined();
  expect(last.done).toEqual(true);

  expect(result[7]).toEqual(result[5]);
  expect(result[8]).toEqual(result[4]);
  expect(result[9]).toEqual(result[3]);
  expect(result[10]).toEqual(result[2]);
  expect(result[19]).toEqual(result[17]);
  expect(result[20]).toEqual(result[16]);
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
  result.push(toStartTime(iterator.next(-1).value));
  result.push(toStartTime(iterator.next(-1).value));
  result.push(toStartTime(iterator.next().value));
  result.push(toStartTime(iterator.next().value));

  let last = iterator.next();
  expect(last.value).toBeUndefined();
  expect(last.done).toEqual(true);

  expect(result[7]).toEqual(result[5]);
  expect(result[8]).toEqual(result[4]);
  expect(result[9]).toEqual(result[3]);
  expect(result[10]).toEqual(result[2]);
  expect(result[19]).toEqual(result[17]);
  expect(result[20]).toEqual(result[16]);
});