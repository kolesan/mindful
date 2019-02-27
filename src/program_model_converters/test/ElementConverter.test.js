import elementConverter from '../ElementConverter';

it(`Is an interface that provides serialization and deserialization methods`, () => {
  let newConverter = Object.create(elementConverter);

  expect(newConverter.type).toEqual("");

  expect(newConverter.serialize).toBeFunction();
  expect(() => newConverter.serialize()).toThrow();

  expect(newConverter.deserialize).toBeFunction();
  expect(() => newConverter.deserialize()).toThrow();

  expect(elementConverter).toContainAllKeys(["type", "serialize", "deserialize"]);
});