let EventStackElement = {
  idCounter: 0,
  init: function initStackElement(event) {
    this.id = Object.getPrototypeOf(this).idCounter++;
    this.event = event;
    this.currentChildIndex = 0;
    this.happened = false;

    return this;
  },
  nextChild: function nextChild() {
    return this.event.children[this.currentChildIndex++];
  }
};
function newEventStackElement(event) {
  return Object.create(EventStackElement).init(event);
}

let EventStack = {
  init: function initEventStack(entryPointElem) {
    this.entryPointElem = entryPointElem;
    this.stack = [entryPointElem];
    this.next();

    return this;
  },
  head: function peekStack() {
    return this.stack[this.stack.length - 1];
  },
  pop: function popStack() {
    return this.stack.pop();
  },
  push: function pushStack(elem) {
    return this.stack.push(elem);
  },
  empty: function isStackEmpty() {
    return this.stack.length == 0;
  },
  length: function stackLength() {
    return this.stack.length;
  },
  get: function getStackElem(i) {
    return this.stack[i];
  },
  next: function findNextNode() {
    if (this.empty()) {
      return;
    }

    let head = this.head();
    let nextChild = head.nextChild();

    if (nextChild) {
      this.push(newEventStackElement(nextChild));
      return this.next();
    } else {
      if (head.happened) {
        this.pop();
        return this.next();
      } else {
        head.happened = true;
        return head;
      }
    }
  },
  seek: function seekANode(predicate) {
    while(this.head() && !predicate(this.head())) {
      this.next();
    }

    return this.head();
  },
  reset: function resetStack() {
    this.init(newEventStackElement(this.entryPointElem.event));
  },
  snapshot: function stackSnapshot() {
    return this.stack.slice(0);
  }
};
function newEventStack(entryPointEvent) {
  return Object.create(EventStack).init(newEventStackElement(entryPointEvent));
}


export { newEventStack }