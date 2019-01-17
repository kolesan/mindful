import { log, toggleTracing, toggleLogging } from '../../src/utils/Logging';

it('logs to console', () => {
  console.log = jest.fn();

  log("Abc", "3", 3, [3], {3: 3});

  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith("Abc", "3", 3, [3], {3: 3});
});

it('can toggleLogging ', () => {
  console.log = jest.fn();

  log();
  toggleLogging();
  log();
  toggleLogging();
  log();

  expect(console.log).toHaveBeenCalledTimes(2);
});

it('can toggleTracing', () => {
  console.log = jest.fn();

  log();
  toggleTracing();
  log();
  toggleTracing();
  log();

  expect(console.log).toHaveBeenCalledTimes(3);
  expect(console.log).toHaveBeenNthCalledWith(1);
  expect(console.log).toHaveBeenNthCalledWith(2, expect.any(String));
  expect(console.log).toHaveBeenNthCalledWith(3);
});