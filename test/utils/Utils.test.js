import * as Utils from '../../src/utils/Utils';
import * as utils from '../TestUtils';
import { log } from "../TestUtils";

test('assignDefinedProperties assigns only defined properties', () => {
  let a = {x: 1, y: 2, w: 3, h: 4};
  Utils.assignDefinedProperties(a, {w: 30, x: 10, asd: ""});
  expect(a).toEqual({x: 10, y: 2, w: 30, h: 4, asd: ""});
});

test('can generate minmax function using `minmax`', () => {
  let minmaxFn = Utils.minmax(-1, 20);

  expect(minmaxFn(-100500)).toEqual(-1);
  expect(minmaxFn(-2)).toEqual(-1);
  expect(minmaxFn(-1)).toEqual(-1);
  expect(minmaxFn(0)).toEqual(0);
  expect(minmaxFn(5)).toEqual(5);
  expect(minmaxFn(19)).toEqual(19);
  expect(minmaxFn(20)).toEqual(20);
  expect(minmaxFn(21)).toEqual(20);
  expect(minmaxFn(250012)).toEqual(20);
});

test('isArray checks if passed object is an Array', () => {
  expect(Utils.isArray([])).toBeTrue();
  expect(Utils.isArray([1,2,3])).toBeTrue();
  expect(Utils.isArray({})).toBeFalse();
  expect(Utils.isArray(1)).toBeFalse();
  expect(Utils.isArray("")).toBeFalse();
});

test('px() calls + "px" string on provided obj', () => {
  expect(Utils.px(1)).toEqual("1px");
});

test('noop is a function that does nothing', () => {
  expect(Utils.noop.toString()).toEqual("function noop() {}");
});

test('last returns last element of an array', () => {
  expect(Utils.last()).toBeUndefined();
  expect(Utils.last([])).toBeUndefined();
  expect(Utils.last([1,2,3])).toEqual(3);
  expect(Utils.last([1,2,"3"])).toEqual("3");
});

test('noSpaces trims whitespace from a string', () => {
  expect(Utils.noSpaces(" a b   c")).toEqual("abc");
  expect(Utils.noSpaces("")).toEqual("");
  expect(Utils.noSpaces()).toBeUndefined();
  expect(Utils.noSpaces([])).toBeUndefined();
  expect(Utils.noSpaces({})).toBeUndefined();
  expect(Utils.noSpaces(undefined)).toBeUndefined();
  expect(Utils.noSpaces(null)).toBeUndefined();
});

test('isFn checks if passed object is a function', () => {
  expect(Utils.isFn(() => {})).toBeTrue();
  expect(Utils.isFn(jest.fn())).toBeTrue();
  expect(Utils.isFn(function a(){})).toBeTrue();

  expect(Utils.isFn({})).toBeFalse();
  expect(Utils.isFn("obj.fn")).toBeFalse();
  expect(Utils.isFn([])).toBeFalse();
  expect(Utils.isFn(1)).toBeFalse();
  expect(Utils.isFn()).toBeFalse();
  expect(Utils.isFn(null)).toBeFalse();
});