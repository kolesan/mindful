import "@babel/polyfill";
import newRegistry from '../ElementConverterRegistry';

it(`can be created`, () => {
  let registry = newRegistry();

  expect(registry.register).toBeFunction();
  expect(registry.get).toBeFunction();

  expect(registry).toContainAllKeys(["register", "get"]);
});

it(`allows registering converters`, () => {
  let registry = newRegistry();
  let converterA = { type: "a" };
  let converterB = { type: "b" };

  registry.register(converterA);
  registry.register(converterB);

  expect(registry.get("a")).toEqual(converterA);
  expect(registry.get("b")).toEqual(converterB);
});

it(`throws an error if no converter for the requested type is found`, () => {
  let registry = newRegistry();
  let converterA = { type: "a" };

  registry.register(converterA);

  expect(() => registry.get("SomeUnknownType"))
    .toThrowWithMessage(Error,
      /No converter registered for type: 'SomeUnknownType'/
    );
});