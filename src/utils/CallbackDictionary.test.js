import newDictionary from './CallbackDictionary';

let a = jest.fn();
let b = jest.fn();
let c = jest.fn();

let dictionary = newDictionary(new Map()
  .set("a", a)
  .set("b", b)
  .set("c", c));

it(`serializes program event element`, () => {
  expect(dictionary.getByValue(a)).toEqual("a");
  expect(dictionary.getByValue(b)).toEqual("b");
  expect(dictionary.getByValue(c)).toEqual("c");
});

it(`deserializes program event element`, () => {
  expect(dictionary.get("a")).toEqual(a);
  expect(dictionary.get("b")).toEqual(b);
  expect(dictionary.get("c")).toEqual(c);
});

it('throws an error if callback dictionary does not contain needed function during serialization', () => {
  expect(() => dictionary.getByValue(function NoSuchFunction() {}))
    .toThrowWithMessage(Error, /Provided callback dictionary does not contain.*NoSuchFunction/);
});

it('throws an error if callback dictionary does not contain needed function during deserialization', () => {
  expect(() => dictionary.get("NoSuchFunction"))
    .toThrowWithMessage(Error, /Provided callback dictionary does not contain.*NoSuchFunction/);
});