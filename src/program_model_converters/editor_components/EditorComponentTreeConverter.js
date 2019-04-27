import { log } from "../../utils/Logging";
import { mapTreeFromLeafs } from "../../utils/TreeUtils";
import eventConverter from "./EditorComponentEventConverter";
import loopConverter from "./EditorComponentLoopConverter";
import { programElemChildren } from '../../edit_screen/tools/ToolComponent';
import newByTypeElementConverter  from "../ByTypeElementConverter";

export default inst(
  eventConverter,
  loopConverter
)

export function inst(...converters) {

  let converter = newByTypeElementConverter(...converters);

  return Object.freeze({
    serialize(root) {
      return mapTreeFromLeafs({root,
        mapper: programElement => converter.serialize(programElement),
        childInjector: (elem, child) => elem.addChild(child)
      });
    },
    //TODO: think about holding references to components and then converting from them and not from html elements
    //same for individual program element converters
    deserialize(root) {
      return mapTreeFromLeafs({root,
        childrenProvider: elem => programElemChildren(elem),
        mapper: elem => converter.deserialize(elem, elem => elem.dataset.element),
        childInjector: (elem, child) => elem.children.push(child)
      })
    }
  });

}
