let programElement = {
  init(children, duration, callback) {
    this.children = children;
    this.duration = duration;
    this.callback = callback;
    this.currentChildIndex = 0;
  },
  nextChild() {
    return this.children[this.currentChildIndex++];
  },
  reset() {
    this.currentChildIndex = 0;
  }
};

export default programElement;