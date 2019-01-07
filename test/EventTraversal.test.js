import eventTraversal from '../src/timer_screen/timer/EventTraversal';
import { log, logo } from "./TestUtils";

/*
  Test events position through time

  0....5....10....15....20
  [..........e1..........]
  [.......e2......][..e7.]
  [....e3....][e6.].......
  [.e4.][.e5.]............

*/
let events = [
  {}, //Added for events[1] instead of events[0] to mean first event.
  {id: 1, name: 1, startTime:  0, endTime: 20},
  {id: 2, name: 2, startTime:  0, endTime: 15},
  {id: 3, name: 3, startTime:  0, endTime: 10},
  {id: 4, name: 4, startTime:  0, endTime:  5},
  {id: 5, name: 5, startTime:  5, endTime: 10},
  {id: 6, name: 6, startTime: 10, endTime: 15},
  {id: 7, name: 7, startTime: 15, endTime: 20},
];

let data = [
  [ events[1], events[2], events[3], events[4] ],
  [ events[1], events[2], events[3], events[5] ],
  [ events[1], events[2], events[3]            ],
  [ events[1], events[2], events[6]            ],
  [ events[1], events[2]                       ],
  [ events[1], events[7]                       ],
  [ events[1]                                  ],
];

let iterable = MockIterableWithDirectionalNext(data);

function MockIterableWithDirectionalNext(array) {
  return {
    [Symbol.iterator]() { return MockIteratorWithDirectionalNext(array) },
  }
}
function MockIteratorWithDirectionalNext(array) {
  let currentIndex = -1;
  return {
    next(direction = 1) {
      currentIndex += direction > 0 ? 1 : -1;
      log("Next called", direction, currentIndex, array[currentIndex]);
      return {
        value: array[currentIndex],
        done: currentIndex >= array.length
      };
    }
  }
}

test('creates event traversal from an iterable', () => {
  let traversal = eventTraversal(iterable);

  expect(traversal.next).toBeDefined();
  expect(traversal.return).toBeDefined();
  expect(traversal.reset).toBeDefined();
  expect(traversal.seek).toBeDefined();

  expect(traversal.head).toBeDefined();
  expect(traversal.path).toBeDefined();
  expect(traversal.diff).toBeDefined();
  expect(traversal.finished).toBeDefined();
});

test('Starts of on the first iteration (next() is called during creation)', () => {
  let traversal = eventTraversal(iterable);

  expect(traversal.head).toEqual(events[4]);
  expect(traversal.path).toEqual([events[1], events[2], events[3], events[4]]);
  expect(traversal.diff).toEqual({added: [events[1], events[2], events[3], events[4]], removed: []});
  expect(traversal.finished).toEqual(false);
});

test('is an iterator', () => {
  let traversal = eventTraversal(iterable);

  let result = [traversal.path];
  let it;
  while((it = traversal.next()) && !it.done) {
    result.push(it.value);
  }

  expect(result).toEqual(data);
});

test('provides finished status via `get finished()`', () => {
  let traversal = eventTraversal(iterable);

  let result = [traversal.path];
  let it;
  while((it = traversal.next()) && !traversal.finished) {
    result.push(it.value);
  }

  expect(result).toEqual(data);
});

test('provides current traversal path via `get path()`', () => {
  let traversal = eventTraversal(iterable);

  let result = [traversal.path];
  let it;
  while((it = traversal.next()) && !traversal.finished) {
    result.push(traversal.path);
  }

  expect(result).toEqual(data);
});

test('provides current path head via `get head()`', () => {
  let traversal = eventTraversal(iterable);

  let result = [traversal.head];
  let it;
  while((it = traversal.next()) && !traversal.finished) {
    result.push(traversal.head);
  }

  expect(result).toEqual([
    events[4],
    events[5],
    events[3],
    events[6],
    events[2],
    events[7],
    events[1]
  ]);
});

test('provides path diff after an iteration step via `get diff()`', () => {
  let traversal = eventTraversal(iterable);

  let result = [traversal.diff];
  let it;
  while((it = traversal.next()) && !traversal.finished) {
    result.push(traversal.diff);
  }

  expect(result).toEqual([
    {added: [ events[1], events[2], events[3], events[4] ], removed: [           ]},
    {added: [ events[5]                                  ], removed: [ events[4] ]},
    {added: [                                            ], removed: [ events[5] ]},
    {added: [ events[6]                                  ], removed: [ events[3] ]},
    {added: [                                            ], removed: [ events[6] ]},
    {added: [ events[7]                                  ], removed: [ events[2] ]},
    {added: [                                            ], removed: [ events[7] ]}
  ]);
});

test('allows early termination via `return()`', () => {
  let traversal = eventTraversal(iterable);

  traversal.next();
  traversal.next();
  traversal.next();
  expect(traversal.finished).toEqual(false);

  traversal.return();
  expect(traversal.finished).toEqual(true);
  expect(traversal.next().done).toEqual(true);
  expect(traversal.next().value).toEqual(undefined);
  expect(traversal.next().done).toEqual(true);
  expect(traversal.next().value).toEqual(undefined);
});

test('allows resetting iteration to the beginning via `reset()`', () => {
  let traversal = eventTraversal(iterable);

  traversal.next();
  traversal.next();
  traversal.next();
  traversal.reset();

  let result = [traversal.path];
  while(traversal.next() && !traversal.finished) {
    result.push(traversal.path);
  }

  expect(result).toEqual(data);
});

test('allows seeking by time via `seek(time)`', () => {
  let traversal = eventTraversal(iterable);

  let result = [];
  result.push(
    traversal.seek( 0).head, //4
    traversal.seek( 2).head, //4
    traversal.seek( 4).head, //4
    traversal.seek( 5).head, //5
    traversal.seek( 7).head, //5
    traversal.seek( 9).head, //5
    traversal.seek(15).head, //7
    traversal.seek(17).head, //7
    traversal.seek(19).head, //7
    traversal.seek(14).head, //6
    traversal.seek(12).head, //6
    traversal.seek(10).head, //6
    traversal.seek(20).head,  //undefined
    traversal.seek(100500).head,  //undefined
    traversal.seek(15).head,  //7
    traversal.seek(2).head  //4
  );

  expect(result).toEqual([
    events[4],
    events[4],
    events[4],
    events[5],
    events[5],
    events[5],
    events[7],
    events[7],
    events[7],
    events[6],
    events[6],
    events[6],
    undefined,
    undefined,
    events[7],
    events[4]
  ]);
});

test('seeking throws errors for negative or NaN values', () => {
  let traversal = eventTraversal(iterable);

  expect(traversal.seek(0).head).toEqual(events[4]);
  expect(() => traversal.seek(-1)).toThrowError(/Can not seek.*-1/);
  expect(() => traversal.seek(-1356)).toThrowError(/Can not seek.*-1356/);
  expect(() => traversal.seek(undefined)).toThrowError(/Can not seek.*undefined/);
  expect(() => traversal.seek(null)).toThrowError(/Can not seek.*null/);
  expect(() => traversal.seek(NaN)).toThrowError(/Can not seek.*NaN/);
  expect(() => traversal.seek("")).toThrowError(/Can not seek/);
  expect(() => traversal.seek("asdfg")).toThrowError(/Can not seek.*asdfg/);
  expect(() => traversal.seek(Infinity)).toThrowError(/Can not seek.*Infinity/);
});

