import programSerialization from '../../../src/timer_screen/timer/ProgramSerialization';

let a = jest.fn();
let b = jest.fn();
let c = jest.fn();

let callbacks = new Map()
  .set("a", a)
  .set("b", b)
  .set("c", c);

let serializedProgram = {
  mainEvent: {
    element: "event",
    name: "Mindful Yoga",
    duration: 310000,
    callback: "a",
    children: [
      {
        element: "event",
        name: "Preparation",
        duration: 30000,
        callback: "b",
        children: []
      },
      {
        element: "loop",
        iterations: 3,
        duration: 210000,
        children: [
          {
            element: "event",
            name: "Hold pose {i}",
            duration: 60000,
            callback: "b",
            children: [
              {
                element: "event",
                name: "1/2",
                duration: 30000,
                callback: "c",
                children: []
              },
              {
                element: "event",
                name: "2/2",
                duration: 30000,
                callback: "c",
                children: []
              }
            ]
          },
          {
            element: "event",
            name: "Change pose",
            duration: 10000,
            callback: "b",
            children: []
          }
        ]
      },
      {
        element: "event",
        name: "Chill",
        duration: 70000,
        callback: "a",
        children: []
      }
    ]
  }
};

let deserializedProgram = {
  mainEvent: {
    element: "event",
    name: "Mindful Yoga",
    duration: 310000,
    callback: a,
    children: [
      {
        element: "event",
        name: "Preparation",
        duration: 30000,
        callback: b,
        children: []
      },
      {
        element: "loop",
        iterations: 3,
        duration: 210000,
        children: [
          {
            element: "event",
            name: "Hold pose {i}",
            duration: 60000,
            callback: b,
            children: [
              {
                element: "event",
                name: "1/2",
                duration: 30000,
                callback: c,
                children: []
              },
              {
                element: "event",
                name: "2/2",
                duration: 30000,
                callback: c,
                children: []
              }
            ]
          },
          {
            element: "event",
            name: "Change pose",
            duration: 10000,
            callback: b,
            children: []
          }
        ]
      },
      {
        element: "event",
        name: "Chill",
        duration: 70000,
        callback: a,
        children: []
      }
    ]
  }
};

it('can be created', () => {
  let service = programSerialization(callbacks);

  expect(service.serialize).toBeFunction();
  expect(service.deserialize).toBeFunction();

  expect(service).toContainAllKeys([
    "serialize", "deserialize"
  ])
});

it('can deserialize a program', () => {
  let service = programSerialization(callbacks);

  expect(service.deserialize(serializedProgram)).toEqual(deserializedProgram)
});

it('can serialize a program', () => {
  let service = programSerialization(callbacks);

  expect(service.serialize(deserializedProgram)).toEqual(serializedProgram)
});

it('deserialize returns new instance of program', () => {
  let service = programSerialization(callbacks);

  let deserialized = service.deserialize(serializedProgram);
  deserialized.mainEvent.name = "DefinitelySomethingNew";
  deserialized.mainEvent.children[0].name = "AlsoDefinitelySomethingNew";

  expect(deserialized.mainEvent.name).toEqual("DefinitelySomethingNew");
  expect(serializedProgram.mainEvent.name).toEqual("Mindful Yoga");

  expect(deserialized.mainEvent.children[0].name).toEqual("AlsoDefinitelySomethingNew");
  expect(serializedProgram.mainEvent.children[0].name).toEqual("Preparation");
});

it('serialize returns new instance of program', () => {
  let service = programSerialization(callbacks);

  let serialized = service.serialize(deserializedProgram);
  serialized.mainEvent.name = "DefinitelySomethingNew";
  serialized.mainEvent.children[0].name = "AlsoDefinitelySomethingNew";

  expect(serialized.mainEvent.name).toEqual("DefinitelySomethingNew");
  expect(deserializedProgram.mainEvent.name).toEqual("Mindful Yoga");

  expect(serialized.mainEvent.children[0].name).toEqual("AlsoDefinitelySomethingNew");
  expect(deserializedProgram.mainEvent.children[0].name).toEqual("Preparation");
});

it('during serialization throws an error if callback dictionary does not contain needed function', () => {
  let service = programSerialization(callbacks);

  let deserializedClone = service.deserialize(serializedProgram);
  deserializedClone.mainEvent.callback = function NoSuchFunction() {};

  expect(() => service.serialize(deserializedClone))
    .toThrowWithMessage(Error, /Provided callback dictionary does not contain.*NoSuchFunction/);
});

it('during deserialization throws an error if callback dictionary does not contain needed function', () => {
  let service = programSerialization(callbacks);

  let serializedClone = service.serialize(deserializedProgram);
  serializedClone.mainEvent.callback = "NoSuchFunction";

  expect(() => service.deserialize(serializedClone))
    .toThrowWithMessage(Error, /Provided callback dictionary does not contain.*NoSuchFunction/);
});