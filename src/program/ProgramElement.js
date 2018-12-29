let programElement = {
  init(children, duration, callback) {
    this.children = children;
    this.duration = duration;
    this.callback = callback;
    this.currentChildIndex = 0;
  },
  nextChild() {
    let child = this.children[this.currentChildIndex];
    if (child) {
      child.id = this.currentChildIndex;
    }
    this.currentChildIndex++;
    return child;
  },
  reset() {
    this.currentChildIndex = 0;
  }
};

export default programElement;