import programLoop from "../../src/program/ProgramLoop";

import { noop } from "../TestUtils";

test("Can create a program loop", () => {
  let event = Object.create(programLoop).init(10, [{}, {}], 1000);

  expect(event.iterations).toEqual(10);
  expect(event.children).toEqual([{}, {}]);
  expect(event.duration).toEqual(1000);
});

test("Can iterate through child elements using only successive 'nextChild()' calls", () => {
  let event = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  expect(event.nextChild().name).toEqual("child1");
  expect(event.nextChild().name).toEqual("child2");
  expect(event.nextChild().name).toEqual("child1");
  expect(event.nextChild().name).toEqual("child2");
  expect(event.nextChild()).toBeUndefined();
});

test("Can iterate backwards through child elements using 'skipToAfterLastChild()' and successive 'previousChild()' calls", () => {
  let event = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  event.skipToAfterLastChild();

  expect(event.nextChild()).toBeUndefined();
  expect(event.previousChild().name).toEqual("child2");
  expect(event.previousChild().name).toEqual("child1");
  expect(event.previousChild().name).toEqual("child2");
  expect(event.previousChild().name).toEqual("child1");
  expect(event.previousChild()).toBeUndefined();
});

test("'nextChild' does not increase index beyond lastChild+1", () => {
  let event = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  event.skipToAfterLastChild();

  expect(event.nextChild()).toBeUndefined();
  expect(event.nextChild()).toBeUndefined();
  expect(event.nextChild()).toBeUndefined();
  expect(event.nextChild()).toBeUndefined();
  expect(event.previousChild().name).toEqual("child2");
});

test("'previousChild' does not decrease index beyond -1", () => {
  let event = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
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
  let event = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  event.nextChild();
  event.nextChild();
  event.nextChild();
  expect(event.nextChild().name).toEqual("child2");
  event.reset();
  expect(event.previousChild()).toBeUndefined();
  expect(event.nextChild().name).toEqual("child1");
});

test("Can reset index position to after last child", () => {
  let event = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  expect(event.nextChild().name).toEqual("child1");
  expect(event.nextChild().name).toEqual("child2");
  event.skipToAfterLastChild();
  expect(event.nextChild()).toBeUndefined();
  expect(event.previousChild().name).toEqual("child2");
});

test("Can reset index position to after last child", () => {
  let event = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  expect(event.nextChild().name).toEqual("child1");
  expect(event.nextChild().name).toEqual("child2");
  event.skipToAfterLastChild();
  expect(event.nextChild()).toBeUndefined();
  expect(event.previousChild().name).toEqual("child2");
});

test("Can change iteration direction 'mid-air'", () => {
  let event = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  expect(event.nextChild().name).toEqual("child1");
  expect(event.nextChild().name).toEqual("child2");
  expect(event.previousChild().name).toEqual("child1");
  expect(event.previousChild()).toBeUndefined();
  expect(event.nextChild().name).toEqual("child1");
  expect(event.nextChild().name).toEqual("child2");
  expect(event.nextChild().name).toEqual("child1");
  expect(event.previousChild().name).toEqual("child2");
  expect(event.nextChild().name).toEqual("child1");
  expect(event.nextChild().name).toEqual("child2");
  expect(event.nextChild()).toBeUndefined();
});