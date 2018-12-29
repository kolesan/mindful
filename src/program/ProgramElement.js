let programElement = {
  init(children, duration, callback) {
    this.duration = duration;
    this.children = children;
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