import { log } from "../../utils/Logging";
import newConverterRegistry from "../ElementConverterRegistry";
import { mapTreeFromLeafs } from "../../utils/TreeUtils";
import eventConverter from "./EditorComponentEventConverter";
import loopConverter from "./EditorComponentLoopConverter";

export default inst(
  eventConverter,
  loopConverter
)

export function inst(...converters) {

  let elementConverters = converters.reduce(
    (registry, converter) => registry.register(converter),
    newConverterRegistry()
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
    }
  });

}
