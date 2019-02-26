import '@babel/polyfill';
import { log } from "../../test/TestUtils";
import registry, { Converters } from './ConverterRegistry';

it(`provides Symbols for the available converters`, () => {
  expect(Converters.localStorage).toBeDefined();
  expect(typeof Converters.localStorage).toEqual("symbol");

  // expect(Converters.editorScreenDOM).toBeDefined();
  // expect(typeof Converters.editorScreenDOM).toEqual("symbol");
  //
  // expect(Converters.iterableForTimer).toBeDefined();
  // expect(typeof Converters.iterableForTimer).toEqual("symbol");
});

it(`allows to get a converter using a Symbol`, () => {
  let converterSymbols = Object.values(Converters);

  converterSymbols.forEach(converterSymbol => {
    const converter = registry.get(converterSymbol);
    expect(converter).toBeDefined();
    expect(converter.serialize).toBeFunction();
    expect(converter.deserialize).toBeFunction();
  });

  expect(registry.size).toEqual(converterSymbols.length);
});