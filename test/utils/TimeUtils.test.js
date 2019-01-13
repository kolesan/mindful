import * as TimeUtils from '../../src/utils/TimeUtils';
import * as utils from '../TestUtils';
import { log } from "../TestUtils";

test('timeObject creates a time object', () => {
  let timeObj = TimeUtils.timeObject(1, 2, 3, 4);

  expect(timeObj.h).toEqual(1);
  expect(timeObj.m).toEqual(2);
  expect(timeObj.s).toEqual(3);
  expect(timeObj.ms).toEqual(4);
  expect(timeObj.timestamp).toEqual(3723004);
  expect(timeObj.toString()).toEqual("1h 2m 3s 4ms");
});

test('timeObject constructor defaults params to 0', () => {
  let timeObj = TimeUtils.timeObject();

  expect(timeObj.h).toEqual(0);
  expect(timeObj.m).toEqual(0);
  expect(timeObj.s).toEqual(0);
  expect(timeObj.ms).toEqual(0);
  expect(timeObj.timestamp).toEqual(0);
});

test('0 duration time object toString returns 0ms', () => {
  let timeObj = TimeUtils.timeObject();

  expect(timeObj.toString()).toEqual("0ms");
});

test('timestamp and toString are always up to date with tim variable changes', () => {
  let timeObj = TimeUtils.timeObject(1, 2, 3, 4);

  expect(timeObj.timestamp).toEqual(3723004);
  expect(timeObj.toString()).toEqual("1h 2m 3s 4ms");

  timeObj.h = 2;
  expect(timeObj.timestamp).toEqual(7323004);
  expect(timeObj.toString()).toEqual("2h 2m 3s 4ms");

  timeObj.m = 3;
  expect(timeObj.timestamp).toEqual(7383004);
  expect(timeObj.toString()).toEqual("2h 3m 3s 4ms");

  timeObj.s = 4;
  expect(timeObj.timestamp).toEqual(7384004);
  expect(timeObj.toString()).toEqual("2h 3m 4s 4ms");

  timeObj.ms = 5;
  expect(timeObj.timestamp).toEqual(7384005);
  expect(timeObj.toString()).toEqual("2h 3m 4s 5ms");

  expect(timeObj.h).toEqual(2);
  expect(timeObj.m).toEqual(3);
  expect(timeObj.s).toEqual(4);
  expect(timeObj.ms).toEqual(5);
});

test('timeStampToTimeObject creates a time object from timestamp', () => {
  let timeObj = TimeUtils.timestampToTimeObject(123456789);

  expect(timeObj.h).toEqual(34);
  expect(timeObj.m).toEqual(17);
  expect(timeObj.s).toEqual(36);
  expect(timeObj.ms).toEqual(789);
  expect(timeObj.timestamp).toEqual(123456789);
  expect(timeObj.toString()).toEqual("34h 17m 36s 789ms");
});