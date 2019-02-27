import "@babel/polyfill";
import elementTreeConverter from './ElementTreeConverter';

it(`can be created`, () => {
  let treeConverter = elementTreeConverter();

  expect(treeConverter.serialize).toBeFunction();
  expect(treeConverter.deserialize).toBeFunction();

  expect(treeConverter).toContainAllKeys(["serialize", "deserialize"]);
});

it(`serializes a tree using type converters provided during creation`, () => {
  let treeConverter = elementTreeConverter(
    converterA,
    converterB
  );

  expect(treeConverter.serialize(tree)).toEqual(serializedTree);
  expect(converterA.serialize).toHaveBeenCalledTimes(3);
  expect(converterB.serialize).toHaveBeenCalledTimes(1);
});

it(`deserializes a tree using type converters provided during creation`, () => {
  let treeConverter = elementTreeConverter(
    converterA,
    converterB
  );

  expect(treeConverter.deserialize(serializedTree)).toEqual(tree);
  expect(converterA.deserialize).toHaveBeenCalledTimes(3);
  expect(converterB.deserialize).toHaveBeenCalledTimes(1);
});

const converterA = {
  type: "a",
  serialize: jest.fn(elem => ({ ...elem, counter: elem.counter + 1 })),
  deserialize: jest.fn(elem => ({ ...elem, counter: elem.counter - 1 }))
};
const converterB = {
  type: "b",
  serialize: jest.fn(elem => ({ ...elem, counter: elem.counter + 10 })),
  deserialize: jest.fn(elem => ({ ...elem, counter: elem.counter - 10 }))
};

let tree = {
  element: "a",
  counter: 1,
  children: [
    {
      element: "a",
      counter: 1,
      children: []
    },
    {
      element: "b",
      counter: 1,
      children: [
        {
          element: "a",
          counter: 1,
          children: []
        }
      ]
    }
  ]
};

let serializedTree = {
  element: "a",
  counter: 2,
  children: [
    {
      element: "a",
      counter: 2,
      children: []
    },
    {
      element: "b",
      counter: 11,
      children: [
        {
          element: "a",
          counter: 2,
          children: []
        }
      ]
    }
  ]
};
