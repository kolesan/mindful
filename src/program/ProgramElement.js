let programElement = {
  init(children, duration) {
    this.duration = duration;
    this.children = children;
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