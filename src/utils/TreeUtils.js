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

function *pathReturningTreeIterator(root) {
  let stack = [];
  for(let r of iterator(root)) {
    yield Array.from(r);
  }
  function *iterator(node) {
    let { children, ...withoutChildren } = node;
    stack.push(withoutChildren);
    for (let child of children) {
      yield *iterator(child);
    }
    yield stack;
    stack.pop();
  }
}

function pathReturningTreeIterable(root) {
  return Object.freeze({
    [Symbol.iterator]() { return pathReturningTreeIterator(root) }
  });
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
    yield *postorderRightToLeftVisitor(children[i]);
  }
  yield node;
}

export { visit, flatten, reduce, preorderTreeVisitor, postorderTreeVisitor, pathReturningTreeIterator, pathReturningTreeIterable };