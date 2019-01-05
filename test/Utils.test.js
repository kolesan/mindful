import * as Utils from '../src/utils/Utils';
import * as utils from './TestUtils';
import { log } from "./TestUtils";

test('assignDefinedProperties assigns only defined properties', () => {
  let a = {x: 1, y: 2, w: 3, h: 4};
  Utils.assignDefinedProperties(a, {w: 30, x: 10, asd: ""});
  expect(a).toEqual({x: 10, y: 2, w: 30, h: 4, asd: ""});
});

