function walkATree(node, fn) {
  node.children.forEach(child => walkATree(child, fn));
  fn(node);
}

function reduceTree(node, fn) {
  let it = preorderTreeVisitor(node);
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

function *preorderTreeVisitor(node) {
  yield node;
  for (let child of node.children) {
    yield *preorderTreeVisitor(child);
  }
}

function *postorderTreeVisitor(node) {
  for (let child of node.children) {
    yield *postorderTreeVisitor(child);
  }
  yield node;
}

export { reduceTree, preorderTreeVisitor, postorderTreeVisitor, walkATree };