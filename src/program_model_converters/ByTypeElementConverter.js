import { log } from "../utils/Logging";
import newConverterRegistry from "./ElementConverterRegistry";

export default function inst(...converters) {

  let converterRegistry = converters.reduce(
    (registry, converter) => registry.register(converter),
    newConverterRegistry()
  );

  return Object.freeze({
    serialize: conversionFn("serialize"),
    deserialize: conversionFn("deserialize")
  });

  function conversionFn(fnName) {
    return function (element, typeProvider = element => element.element) {
      return converterRegistry.get(typeProvider(element))[fnName](element);
    }
  }

}