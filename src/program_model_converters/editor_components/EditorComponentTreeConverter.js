import { log } from "../../utils/Logging";
import newElementConverterRegistry from "../ElementConverterRegistry";
import { mapTreeFromLeafs } from "../../utils/TreeUtils";
import eventConverter from "./EditorComponentEventConverter";
import loopConverter from "./EditorComponentLoopConverter";
import { programElemChildren } from '../../edit_screen/tools/ToolComponent';

export default inst(
  eventConverter,
  loopConverter
)

export function inst(...converters) {

  let elementConverters = converters.reduce(
    (registry, converter) => registry.register(converter),
    newElementConverterRegistry()
  );

  return Object.freeze({
    serialize(root) {
      return mapTreeFromLeafs({root, mapFn: (programElement, convertedChildren) => {
        let converter = elementConverters.get(programElement.element);
        let editorComponent = converter.serialize(programElement);
        return convertedChildren.reduce(
          (editorComponent, childComponent) => {
            editorComponent.addChild(childComponent);
            return editorComponent;
          },
          editorComponent
        );
      }});
    },
    //TODO: think about holding references to components and then converting from them and not from html elements
    //same for individual program element converters
    deserialize(root) {
      return mapTreeFromLeafs({
        root,
        childrenProvider: elem => programElemChildren(elem),
        mapFn: (elem, convertedChildren) => {
          let converter = elementConverters.get(elem.dataset.element);
          let modelElement = converter.deserialize(elem);
          return convertedChildren.reduce(
            (modelElement, convertedChild) => {
              modelElement.children.push(convertedChild);
              return modelElement;
            },
            modelElement
          )
        }
      })
    }
  });

}
