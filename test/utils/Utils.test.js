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
