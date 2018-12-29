let programElement = {
  init(startTime, children, duration) {
    this.startTime = startTime;
    this.duration = duration;
    this.children = children;
    this.currentChildIndex = 0;
  },
  nextChild() {
    let child = this.children[this.currentChildIndex++];
    if (!child) {
      this.currentChildIndex = 0;
    }
    return child;
  }
};

export default programElement;