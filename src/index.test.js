import { toggleVolume } from '../src/index';

test('toggleVolume changes volume from 0 to 1', () => {
  expect(toggleVolume(0)).toBe(1);
});

test('toggleVolume changes volume from 1 to 0', () => {
  expect(toggleVolume(1)).toBe(0);
});

test('toggleVolume changes volume from 0.5 to 0', () => {
  expect(toggleVolume(0.5)).toBe(0);
});