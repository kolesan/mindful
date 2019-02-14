import programLoop from "../../src/program/ProgramLoop";

import { noop } from "../TestUtils";

test("Can create a program loop", () => {
  let loop = Object.create(programLoop).init(10, undefined, 1000);

  expect(loop.iterations).toEqual(10);
  expect(loop.children).toEqual([]);
  expect(loop.duration).toEqual(1000);
});

test("Can iterate through child elements using only successive 'nextChild()' calls", () => {
  let loop = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  expect(loop.nextChild().name).toEqual("child1");
  expect(loop.nextChild().name).toEqual("child2");
  expect(loop.nextChild().name).toEqual("child1");
  expect(loop.nextChild().name).toEqual("child2");
  expect(loop.nextChild()).toBeUndefined();
});

test("Can iterate backwards through child elements using 'skipToAfterLastChild()' and successive 'previousChild()' calls", () => {
  let loop = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  loop.skipToAfterLastChild();

  expect(loop.nextChild()).toBeUndefined();
  expect(loop.previousChild().name).toEqual("child2");
  expect(loop.previousChild().name).toEqual("child1");
  expect(loop.previousChild().name).toEqual("child2");
  expect(loop.previousChild().name).toEqual("child1");
  expect(loop.previousChild()).toBeUndefined();
});

test("'nextChild' does not increase index beyond lastChild+1", () => {
  let loop = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  loop.skipToAfterLastChild();

  expect(loop.nextChild()).toBeUndefined();
  expect(loop.nextChild()).toBeUndefined();
  expect(loop.nextChild()).toBeUndefined();
  expect(loop.nextChild()).toBeUndefined();
  expect(loop.previousChild().name).toEqual("child2");
});

test("'previousChild' does not decrease index beyond -1", () => {
  let loop = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  expect(loop.previousChild()).toBeUndefined();
  expect(loop.previousChild()).toBeUndefined();
  expect(loop.previousChild()).toBeUndefined();
  expect(loop.previousChild()).toBeUndefined();
  expect(loop.nextChild().name).toEqual("child1");
});

test("Can reset index position to before first child", () => {
  let loop = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  loop.nextChild();
  loop.nextChild();
  loop.nextChild();
  expect(loop.nextChild().name).toEqual("child2");
  loop.reset();
  expect(loop.previousChild()).toBeUndefined();
  expect(loop.nextChild().name).toEqual("child1");
});

test("Can reset index position to after last child", () => {
  let loop = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  expect(loop.nextChild().name).toEqual("child1");
  expect(loop.nextChild().name).toEqual("child2");
  loop.skipToAfterLastChild();
  expect(loop.nextChild()).toBeUndefined();
  expect(loop.previousChild().name).toEqual("child2");
});

test("Can reset index position to after last child", () => {
  let loop = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  expect(loop.nextChild().name).toEqual("child1");
  expect(loop.nextChild().name).toEqual("child2");
  loop.skipToAfterLastChild();
  expect(loop.nextChild()).toBeUndefined();
  expect(loop.previousChild().name).toEqual("child2");
});

test("Can change iteration direction 'mid-air'", () => {
  let loop = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  expect(loop.nextChild().name).toEqual("child1");
  expect(loop.nextChild().name).toEqual("child2");
  expect(loop.previousChild().name).toEqual("child1");
  expect(loop.previousChild()).toBeUndefined();
  expect(loop.nextChild().name).toEqual("child1");
  expect(loop.nextChild().name).toEqual("child2");
  expect(loop.nextChild().name).toEqual("child1");
  expect(loop.previousChild().name).toEqual("child2");
  expect(loop.nextChild().name).toEqual("child1");
  expect(loop.nextChild().name).toEqual("child2");
  expect(loop.nextChild()).toBeUndefined();
});

test("isLeaf() returns a boolean signaling if this element has any children", () => {
  let loop = Object.create(programLoop).init(
    2,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );
  let loopLeaf = Object.create(programLoop).init(
    2,
    [],
    1000
  );

  expect(loop.isLeaf()).toEqual(false);
  expect(loopLeaf.isLeaf()).toEqual(true);
});

test("Does not iterate loop with no children", () => {
  let loop = Object.create(programLoop).init(
    2,
    [],
    1000
  );

  expect(loop.previousChild()).toBeUndefined();
  expect(loop.nextChild()).toBeUndefined();
  expect(loop.nextChild()).toBeUndefined();
  expect(loop.nextChild()).toBeUndefined();
  expect(loop.previousChild()).toBeUndefined();
});

test("Does not iterate loop with 0 iterations", () => {
  let loop = Object.create(programLoop).init(
    0,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  expect(loop.previousChild()).toBeUndefined();
  expect(loop.nextChild()).toBeUndefined();
  expect(loop.nextChild()).toBeUndefined();
  expect(loop.nextChild()).toBeUndefined();
  expect(loop.previousChild()).toBeUndefined();
});

it('is transparent', () => {
  let loop = Object.create(programLoop).init(
    0,
    [
      {name: "child1"},
      {name: "child2"}
    ],
    1000
  );

  expect(loop.isTransparent()).toBeTrue();
});