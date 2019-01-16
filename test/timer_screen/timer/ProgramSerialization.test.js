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