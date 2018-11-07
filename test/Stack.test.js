import { newEventStack } from '../src/Stack';
import * as utils from './TestUtils';

let entryPoint = {
  name: 1,
  children: [
    { name: 1.1, children: [] },
    { name: 2,
      children: [
        { name: 3,
          children: [
            { name: 4, children: [ { name: 5, children: [] }]},
            { name: 6, children: []},
            { name: 7, children: [
              { name: 8, children: [ {name: 9, children: []} ] },
              { name: 10, children: [] }
            ]}
          ]
        }
      ]
    }
  ]
};

test('walks a tree', () => {
  let result = [];

  let stack = newEventStack(entryPoint);
  do {
    result.push(stack.head().event.name);
  } while(stack.next());

  expect(result).toEqual([1.1, 5, 4, 6, 9, 8, 10, 7, 3, 2, 1]);
});

test("new stack head is first leaf to the left", () => {
  let stack = newEventStack(entryPoint);
  expect(stack.get(0).event.name).toBe(1);
  expect(stack.get(1).event.name).toBe(1.1);
});

test('returns its head', () => {
  let stack = newEventStack(entryPoint);
  expect(stack.head().event.name).toBe(1.1);
});

test('head is undefined if stack is empty', () => {
  let stack = newEventStack(entryPoint);
  while(stack.length() > 0) {
    stack.next();
  }
  expect(stack.head()).toBe(undefined);
});

test("can reset so that 'head' passes a provided predicate", () => {
  let stack = newEventStack(entryPoint);
  stack.seek(it => it.event.name == 8);
  expect(stack.get(0).event.name).toBe(1);
  expect(stack.get(1).event.name).toBe(2);
  expect(stack.get(2).event.name).toBe(3);
  expect(stack.get(3).event.name).toBe(7);
  expect(stack.get(4).event.name).toBe(8);
});

test("seeking is continued from the current event until end of the stack is reached", () => {
  let stack = newEventStack(entryPoint);
  let nameIsBetween3And8 = it => it.event.name > 3 && it.event.name < 8;

  stack.seek(nameIsBetween3And8);
  expect(stack.head().event.name).toBe(5);

  stack.next();
  stack.seek(nameIsBetween3And8);
  expect(stack.head().event.name).toBe(4);

  stack.next();
  stack.seek(nameIsBetween3And8);
  expect(stack.head().event.name).toBe(6);

  stack.next();
  stack.seek(nameIsBetween3And8);
  expect(stack.head().event.name).toBe(7);

  stack.next();
  stack.seek(nameIsBetween3And8);
  expect(stack.head()).toBe(undefined);
});

test("returns head() if seeking is successful", () => {
  let stack = newEventStack(entryPoint);
  expect(stack.seek(it => it.event.name == 8)).toBe(stack.head());
});

test("returns undefined if seeking is unsuccessful", () => {
  let stack = newEventStack(entryPoint);
  expect(stack.seek(it => it.event.name == "DefinitelyNoSuchElementHere")).toBe(undefined);
});

test("stack is empty if seeking is unsuccessful (we searched till the end and found nothing)", () => {
  let stack = newEventStack(entryPoint);
  stack.seek(it => it.event.name == "DefinitelyNoSuchElementHere");
  expect(stack.length()).toBe(0);
});

test("can reset stack to initial state", () => {
  let stack = newEventStack(entryPoint);
  stack.seek(it => it.event.name == 8);
  stack.reset();
  expect(stack.get(0).event.name).toBe(1);
  expect(stack.get(1).event.name).toBe(1.1);
});