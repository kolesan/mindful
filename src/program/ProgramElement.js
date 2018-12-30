let programElement = {
  init(children, duration, callback) {
    this.children = children;
    this.duration = duration;
    this.callback = callback;
    this.currentChildIndex = -1;
  },
  nextChild() {
    this.currentChildIndex++;
    return currentChild.apply(this);
  },
  previousChild() {
    this.currentChildIndex--;
    return currentChild.apply(this);
  },
  reset() {
    this.currentChildIndex = -1;
  },
  skipToAfterLastChild() {
    this.currentChildIndex = this.children.length;
  }
};


function currentChild() {
  let child = this.children[this.currentChildIndex];
  if (child) {
    child.id = this.currentChildIndex;
  }
  return child;
}


export default programElement;