import converterProto from '../../ElementConverter';
import converter from '../JSONReadyProgramLoopConverter';
import ToolNames from "../../../edit_screen/tools/ToolNames";

let loop = {
  element: "loop",
  iterations: 4,
  duration: 20,
  children: []
};

let serializedLoop = {
  element: "loop",
  iterations: 4,
  duration: 20,
  children: []
};

it(`is a converter for loop program elements`, () => {
  expect(converterProto.isPrototypeOf(converter)).toBeTrue();
  expect(converter.type).toEqual(ToolNames.loop);
  expect(converter.serialize).toBeFunction();
  expect(converter.deserialize).toBeFunction();
  expect(converter).toContainAllKeys(["type", "serialize", "deserialize"]);
});

it(`serializes program loop element`, () => {
  expect(converter.serialize(loop)).toEqual(serializedLoop);
});

it(`deserializes program loop element`, () => {
  expect(converter.deserialize(serializedLoop)).toEqual(loop);
});

it('serialize returns new instance of serialized element', () => {
  let serialized = converter.serialize(loop);
  serialized.iterations = 100500;

  expect(serialized.iterations).toEqual(100500);
  expect(loop.iterations).toEqual(4);
});

it('deserialize returns new instance of element', () => {
  let loop = converter.deserialize(serializedLoop);
  loop.iterations = 100500;

  expect(loop.iterations).toEqual(100500);
  expect(serializedLoop.iterations).toEqual(4);
});
