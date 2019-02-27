import { optional } from "../utils/FunctionalUtils";

export default function inst() {

  let converters = new Map();

  return Object.freeze({
    register(converter) {
      converters.set(converter.type, converter);
      return this;
    },
    get(type) {
      return optional(converters.get(type))
        .ifPresentReturn()
        .orElse(() => {
          throw Error(`No converter registered for type: '${type}'`);
        });
    }
  });

}