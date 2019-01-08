import programEvent from "../../src/program/ProgramEvent";

import { noop } from "../TestUtils";

test("Can create a program event", () => {
  let event = Object.create(programEvent).init("TestEvent", noop, undefined, 1000);

  expect(event.name).toEqual("TestEvent");
  expect(event.children).toEqual([]);
  expect(event.duration).toEqual(1000);
  expect(event.callback).toEqual(noop);
});

test("Can iterate through child elements using only successive 'nextChild()' calls", () => {
  let event = Object.create(programEvent).init(
    "TestEvent",
    noop,
    [
      {name: "child1"},
      {name: "child2"},
      {name: "child3"}
    ],
    1000
  );

  expect(event.nextChild().name).toEqual("child1");
  expect(event.nextChild().name).toEqual("child2");
  expect(event.nextChild().name).toEqual("child3");
  expect(event.nextChild()).toBeUndefined();
});

test("Can iterate backwards through child elements using 'skipToAfterLastChild()' and successive 'previousChild()' calls", () => {
  let event = Object.create(programEvent).init(
    "TestEvent",
    noop,
    [
      {name: "child1"},
      {name: "child2"},
      {name: "child3"}
    ],
    1000
  );
  event.skipToAfterLastChild();

  expect(event.nextChild()).toBeUndefined();
  expect(event.previousChild().name).toEqual("child3");
  expect(event.previousChild().name).toEqual("child2");
  expect(event.previousChild().name).toEqual("child1");
  expect(event.previousChild()).toBeUndefined();
});

test("'nextChild' does not increase index beyond lastChild+1", () => {
  let event = Object.create(programEvent).init(
    "TestEvent",
    noop,
    [
      {name: "child1"},
      {name: "child2"},
      {name: "child3"}
    ],
    1000
  );
  event.skipToAfterLastChild();

  expect(event.nextChild()).toBeUndefined();
  expect(event.nextChild()).toBeUndefined();
  expect(event.nextChild()).toBeUndefined();
  expect(event.nextChild()).toBeUndefined();
  expect(event.previousChild().name).toEqual("child3");
});

test("'previousChild' does not decrease index beyond -1", () => {
  let event = Object.create(programEvent).init(
    "TestEvent",
    noop,
    [
      {name: "child1"},
      {name: "child2"},
      {name: "child3"}
    ],
    1000
  );

  expect(event.previousChild()).toBeUndefined();
  expect(event.previousChild()).toBeUndefined();
  expect(event.previousChild()).toBeUndefined();
  expect(event.previousChild()).toBeUndefined();
  expect(event.nextChild().name).toEqual("child1");
});

test("Can reset index position to before first child", () => {
  let event = Object.create(programEvent).init(
    "TestEvent",
    noop,
    [
      {name: "child1"},
      {name: "child2"},
      {name: "child3"}
    ],
    1000
  );

  event.nextChild();
  event.nextChild();
  expect(event.nextChild().name).toEqual("child3");
  event.reset();
  expect(event.previousChild()).toBeUndefined();
  expect(event.nextChild().name).toEqual("child1");
});

test("Can reset index position to after last child", () => {
  let event = Object.create(programEvent).init(
    "TestEvent",
    noop,
    [
      {name: "child1"},
      {name: "child2"},
      {name: "child3"}
    ],
    1000
  );

  expect(event.nextChild().name).toEqual("child1");
  expect(event.nextChild().name).toEqual("child2");
  event.skipToAfterLastChild();
  expect(event.nextChild()).toBeUndefined();
  expect(event.previousChild().name).toEqual("child3");
});

test("Can change iteration direction 'mid-air'", () => {
  let event = Object.create(programEvent).init(
    "TestEvent",
    noop,
    [
      {name: "child1"},
      {name: "child2"},
      {name: "child3"}
    ],
    1000
  );

  expect(event.nextChild().name).toEqual("child1");
  expect(event.nextChild().name).toEqual("child2");
  expect(event.previousChild().name).toEqual("child1");
  expect(event.previousChild()).toBeUndefined();
  expect(event.nextChild().name).toEqual("child1");
  expect(event.nextChild().name).toEqual("child2");
  expect(event.nextChild().name).toEqual("child3");
  expect(event.previousChild().name).toEqual("child2");
  expect(event.nextChild().name).toEqual("child3");
  expect(event.nextChild()).toBeUndefined();
});

test("isLeaf() returns a boolean signaling if this element has any children", () => {
  let event = Object.create(programEvent).init(
    "TestEvent",
    noop,
    [
      {name: "child1"},
      {name: "child2"},
      {name: "child3"}
    ],
    1000
  );
  let eventLeaf = Object.create(programEvent).init(
    "TestEvent",
    noop,
    [],
    1000
  );

  expect(event.isLeaf()).toEqual(false);
  expect(eventLeaf.isLeaf()).toEqual(true);
});