import { CustomElements } from "../custom_elements/CustomElementsRegistry";
import { log } from "./Logging";

export function copyValuesOfCustomElements(from, to) {
  Object.keys(CustomElements).forEach(it => {
    let customElementOf = childByTag(CustomElements[it]);
    let source = customElementOf(from);
    if (source) {
      let target = customElementOf(to);
      target.value = source.value;
    }
  });
}

function childByTag(tag) {
  return function(cmp) {
    return cmp.querySelector(tag);
  };
}