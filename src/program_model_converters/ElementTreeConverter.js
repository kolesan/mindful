import { mapTree } from "../utils/TreeUtils";
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
    return function (root) {
      return mapTree(root, element => {
        return converterRegistry.get(element.element)[fnName](element);
      });
    }
  }

}
