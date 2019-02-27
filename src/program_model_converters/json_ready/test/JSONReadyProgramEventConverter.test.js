import { inst as newEventConverter } from '../JSONReadyProgramEventConverter';

let a = jest.fn();
let b = jest.fn();
let c = jest.fn();

let callbacks = new Map()
  .set("a", a)
  .set("b", b)
  .set("c", c);

let converter = newEventConverter(callbacks);

let event = {
  element: "event",
  name: "MyEvent",
  duration: 30,
  callback: a,
  children: []
};

let serializedEvent = {
  element: "event",
  name: "MyEvent",
  duration: 30,
  callback: "a",
  children: []
};

it(`serializes program event element`, () => {
  expect(converter.serialize(event)).toEqual(serializedEvent);
});

it(`deserializes program event element`, () => {
  expect(converter.deserialize(serializedEvent)).toEqual(event);
});

it('throws an error if callback dictionary does not contain needed function during serialization', () => {
  let deserialized = converter.deserialize(serializedEvent);
  deserialized.callback = function NoSuchFunction() {};

  expect(() => converter.serialize(deserialized))
    .toThrowWithMessage(Error, /Provided callback dictionary does not contain.*NoSuchFunction/);
});

it('throws an error if callback dictionary does not contain needed function during deserialization', () => {
  let serialized = converter.serialize(event);
  serialized.callback = "NoSuchFunction";

  expect(() => converter.deserialize(serialized))
    .toThrowWithMessage(Error, /Provided callback dictionary does not contain.*NoSuchFunction/);
});

it('deserialize returns new instance of element', () => {
  let deserialized = converter.deserialize(serializedEvent);
  deserialized.name = "DefinitelySomethingNew";

  expect(deserialized.name).toEqual("DefinitelySomethingNew");
  expect(serializedEvent.name).toEqual("MyEvent");
});

it('serialize returns new instance of serialized element', () => {
  let serialized = converter.serialize(event);
  serialized.name = "DefinitelySomethingNew";

  expect(serialized.name).toEqual("DefinitelySomethingNew");
  expect(event.name).toEqual("MyEvent");
});