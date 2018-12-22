import { arr } from "./Utils";
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

function reduce(node, fn) {
  let it = postorderTreeVisitor(node);
  let a = it.next();
  let b = it.next();
  if (b.done) {
    return a.value;
  }
  do {
    a.value = fn(a.value, b.value);
    b = it.next();
  } while(!b.done);
  return a.value;
}

function *toNodeStackVisitor(root) {
  let stack = [];
  for(let r of visitor(root)) {
    yield Array.from(r);
  }
  function *visitor(node) {
    stack.push(node);
    yield stack;
    for (let child of node.children) {
      yield *visitor(child);
    }
    stack.pop();
  }
}

function *preorderTreeVisitor(node) {
  yield node;
  for (let child of arr(node.children)) {
    yield *preorderTreeVisitor(child);
  }
}

function *postorderTreeVisitor(node) {
  for (let child of arr(node.children)) {
    yield *postorderTreeVisitor(child);
  }
  yield node;
}

export function *postorderRightToLeftVisitor(node) {
  let children = arr(node.children);
  for (let i = children.length - 1; i >= 0; i--) {
    yield *postorderTreeVisitor(children[i]);
  }
  yield node;
}

export { visit, flatten, reduce, preorderTreeVisitor, postorderTreeVisitor };