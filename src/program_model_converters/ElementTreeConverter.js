import { mapTree } from "../utils/TreeUtils";
import newByTypeElementConverter  from "./ByTypeElementConverter";

export default function inst(...converters) {

  let byTypeElementConverter = newByTypeElementConverter(...converters);

  return Object.freeze({
    serialize: conversionFn("serialize"),
    deserialize: conversionFn("deserialize")
  });

  function conversionFn(fnName) {
    return function (root) {
      return mapTree(root, element => {
        return byTypeElementConverter[fnName](element);
      });
    }
  }

}
