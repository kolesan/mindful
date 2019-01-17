import { instantiate, globalInstance } from '../../src/utils/EventBus';

it('can instantiate', () => {
  let bus = instantiate();

  expect(bus.fire).toBeFunction();
  expect(bus.bindListener).toBeFunction();

  expect(bus).toContainAllKeys([
    "fire", "bindListener"
  ])
});

it('can bindListener functions', () => {
  let bus = instantiate();

  bus.bindListener("TEST_EVENT", () => {});
});

it('throws an error if trying to bind not a function', () => {
  let bus = instantiate();

  expect(() => bus.bindListener("TEST_EVENT", {})).toThrowWithMessage(Error, /invalid listener/);
});

it('can fire events', () => {
  let bus = instantiate();

  bus.fire("TEST_EVENT");
});

it('bound listeners are executed when same type event is fired', () => {
  let bus = instantiate();

  let listner1 = jest.fn();
  let listner2 = jest.fn();

  bus.bindListener("TEST_EVENT", listner1);
  bus.bindListener("TEST_EVENT", listner2);

  bus.fire("TEST_EVENT");
  bus.fire("NO_SUCH_EVENT");
  bus.fire("NO_SUCH_EVENT_AS_WELL");

  expect(listner1).toHaveBeenCalledTimes(1);
  expect(listner2).toHaveBeenCalledTimes(1);
});

it('bound listeners receive arguments passed to fire', () => {
  let bus = instantiate();

  let fn = jest.fn();
  let listner1 = jest.fn();
  let listner2 = jest.fn();

  bus.bindListener("TEST_EVENT_1", listner1);
  bus.bindListener("TEST_EVENT_2", listner2);

  bus.fire("TEST_EVENT_1", "a", 2, [1, 2, 3], {a: "a"});
  bus.fire("TEST_EVENT_2", "b", 4, fn);

  expect(listner1).toHaveBeenCalledTimes(1);
  expect(listner1).toHaveBeenCalledWith("a", 2, [1, 2, 3], {a: "a"});
  expect(listner2).toHaveBeenCalledTimes(1);
  expect(listner2).toHaveBeenCalledWith("b", 4, fn);
});