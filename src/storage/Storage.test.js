import storageProto from './Storage';

it(`is an interface with storage manipulation methods`, () => {
  let storage = Object.create(storageProto);

  expect(typeof storageProto).toEqual("object");
  expect(storageProto.isPrototypeOf(storage)).toBeTrue();

  expect(storage.put).toBeFunction();
  expect(() => storage.put()).toThrow();

  expect(storage.get).toBeFunction();
  expect(() => storage.get()).toThrow();

  expect(storage.remove).toBeFunction();
  expect(() => storage.remove()).toThrow();
});