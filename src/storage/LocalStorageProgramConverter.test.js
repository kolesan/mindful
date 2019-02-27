import "@babel/polyfill";
import { inst as programSerialization } from './LocalStorageProgramConverter';

let converter = {
  serialize: jest.fn( () => ({}) ),
  deserialize: jest.fn( () => ({}) )
};

let service = programSerialization(converter);

let serializedProgram = {
  id: "MyProgram",
  title: "My Program",
  icon: "fas fa-bender",
  description: "Some program",
  timesOpened: 25,
  mainEvent: expect.anything()
};

let deserializedProgram = {
  id: "MyProgram",
  title: "My Program",
  icon: "fas fa-bender",
  description: "Some program",
  timesOpened: 25,
  mainEvent: expect.anything()
};

it('can be created', () => {
  expect(service.serialize).toBeFunction();
  expect(service.deserialize).toBeFunction();

  expect(service).toContainAllKeys([
    "serialize", "deserialize"
  ])
});

it('can deserialize a program', () => {
  expect(service.deserialize(serializedProgram)).toEqual(deserializedProgram);
  expect(converter.deserialize).toHaveBeenCalledTimes(1);
});

it('can serialize a program', () => {
  expect(service.serialize(deserializedProgram)).toEqual(serializedProgram);
  expect(converter.serialize).toHaveBeenCalledTimes(1);
});



it('deserialize returns new instance of program', () => {
  let deserialized = service.deserialize(serializedProgram);
  deserialized.title = "DefinitelySomethingNew";
  deserialized.timesOpened = 100500;

  expect(deserialized.title).toEqual("DefinitelySomethingNew");
  expect(serializedProgram.title).toEqual("My Program");

  expect(deserialized.timesOpened).toEqual(100500);
  expect(serializedProgram.timesOpened).toEqual(25);
});

it('serialize returns new instance of program', () => {
  let serialized = service.serialize(deserializedProgram);
  serialized.title = "DefinitelySomethingNew";
  serialized.timesOpened = 100500;

  expect(serialized.title).toEqual("DefinitelySomethingNew");
  expect(deserializedProgram.title).toEqual("My Program");

  expect(serialized.timesOpened).toEqual(100500);
  expect(deserializedProgram.timesOpened).toEqual(25);
});