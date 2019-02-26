import "@babel/polyfill";
import { inst as programElementSerialization }from './ProgramElementSerialization';

let a = jest.fn();
let b = jest.fn();
let c = jest.fn();

let callbacks = new Map()
  .set("a", a)
  .set("b", b)
  .set("c", c);

let service = programElementSerialization(callbacks);

let event = {
  element: "event",
  name: "MyEvent",
  duration: 30,
  callback: a,
  children: [
    {
      element: "event",
      name: "MyChildEvent",
      duration: 10,
      callback: b,
      children: []
    },
    {
      element: "loop",
      iterations: 4,
      duration: 20,
      children: [
        {
          element: "event",
          name: "MyGrandChildEvent",
          duration: 5,
          callback: c,
          children: []
        }
      ]
    }
  ]
};

let serializedEvent = {
  element: "event",
  name: "MyEvent",
  duration: 30,
  callback: "a",
  children: [
    {
      element: "event",
      name: "MyChildEvent",
      duration: 10,
      callback: "b",
      children: []
    },
    {
      element: "loop",
      iterations: 4,
      duration: 20,
      children: [
        {
          element: "event",
          name: "MyGrandChildEvent",
          duration: 5,
          callback: "c",
          children: []
        }
      ]
    }
  ]
};

it(`serializes program event element`, () => {
  expect(service.serialize(event)).toEqual(serializedEvent);
});

it(`serializes program loop element`, () => {
  let loop = event.children[1];
  let serializedLoop = serializedEvent.children[1];

  expect(service.serialize(loop)).toEqual(serializedLoop);
});


it(`deserializes program event element`, () => {
  expect(service.deserialize(serializedEvent)).toEqual(event);
});

it(`deserializes program loop element`, () => {
  let loop = event.children[1];
  let serializedLoop = serializedEvent.children[1];

  expect(service.deserialize(serializedLoop)).toEqual(loop);
});



it(`throws an error if unknown program element is passed to serialization`, () => {
  let unknown = {
    element: "SomeUnknownElement",
    someProperty: "woot",
    someOtherProperty: 1
  };

  expect(() => service.serialize(unknown))
    .toThrowWithMessage(
      Error,
      /Unknown element SomeUnknownElement encountered during program serialization\/deserialization for localStorage/
    );
});

it(`throws an error if unknown program element is passed to deserialization`, () => {
  let unknown = {
    element: "SomeUnknownElement",
    someProperty: "woot",
    someOtherProperty: 1
  };

  expect(() => service.deserialize(unknown))
    .toThrowWithMessage(
      Error,
      /Unknown element SomeUnknownElement encountered during program serialization\/deserialization for localStorage/
    );
});



it('throws an error if callback dictionary does not contain needed function during serialization', () => {
  let deserialized = service.deserialize(serializedEvent);
  deserialized.callback = function NoSuchFunction() {};

  expect(() => service.serialize(deserialized))
    .toThrowWithMessage(Error, /Provided callback dictionary does not contain.*NoSuchFunction/);
});

it('throws an error if callback dictionary does not contain needed function during deserialization', () => {
  let serialized = service.serialize(event);
  serialized.callback = "NoSuchFunction";

  expect(() => service.deserialize(serialized))
    .toThrowWithMessage(Error, /Provided callback dictionary does not contain.*NoSuchFunction/);
});



it('deserialize returns new instance of element', () => {
  let deserialized = service.deserialize(serializedEvent);
  deserialized.name = "DefinitelySomethingNew";
  deserialized.children[0].name = "AlsoDefinitelySomethingNew";

  expect(deserialized.name).toEqual("DefinitelySomethingNew");
  expect(serializedEvent.name).toEqual("MyEvent");

  expect(deserialized.children[0].name).toEqual("AlsoDefinitelySomethingNew");
  expect(serializedEvent.children[0].name).toEqual("MyChildEvent");
});

it('serialize returns new instance of serialized element', () => {
  let serialized = service.serialize(event);
  serialized.name = "DefinitelySomethingNew";
  serialized.children[0].name = "AlsoDefinitelySomethingNew";

  expect(serialized.name).toEqual("DefinitelySomethingNew");
  expect(event.name).toEqual("MyEvent");

  expect(serialized.children[0].name).toEqual("AlsoDefinitelySomethingNew");
  expect(event.children[0].name).toEqual("MyChildEvent");
});