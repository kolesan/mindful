import { arr, noop } from "./Utils";
import { log } from "./Logging";

function visit(node, fn) {
  if (node) {
    if (node.children) {
      Array.from(node.children).forEach(child => visit(child, fn));
    }
    fn(node);
  }
}

function flatten(root) {
  let array = [];
  visit(root, node => array.push(node));
  return array;
}

export function *postorderRightToLeftVisitor(node) {
  let children = arr(node.children);
  for (let i = children.length - 1; i >= 0; i--) {
    yield *postorderRightToLeftVisitor(children[i]);
  }
  yield node;
}

export function mapTree(root, fn) {
  let mapped = fn(root);
  if (root.children) {
    mapped.children = root.children.map(child => mapTree(child, fn));
  }
  return mapped;
}

export function mapTreeFromLeafs({root, childrenProvider = elem => elem.children, mapper, childInjector = noop}) {
  let children = childrenProvider(root) || [];
  let mappedChildren = children.map(child =>
    mapTreeFromLeafs({root: child, childrenProvider, mapper, childInjector})
  );
  let mappedRoot = mapper(root, mappedChildren);

  return mappedChildren.reduce(
    (mappedRoot, child) => {
      childInjector(mappedRoot, child);
      return mappedRoot;
    },
    mappedRoot
  );
}

export { visit, flatten, };