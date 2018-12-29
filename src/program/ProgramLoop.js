import programElement from "./ProgramElement";
import { div } from "../utils/MathUtils";

let programLoop = Object.create(programElement);
programLoop.init = function(iterations, children, duration) {
  programElement.init.apply(this, [children, duration]);
  this.iterations = iterations;
  this.virtualChildCount = this.iterations * this.children.length;
};
programLoop.nextChild = function() {
  if (this.children.length == 0 || this.currentChildIndex >= this.virtualChildCount) {
    return;
  }

  let child = this.children[this.currentChildIndex % this.children.length];
  child.iteration = div(this.currentChildIndex, this.children.length);

  this.currentChildIndex++;

  return child;
};

export default programLoop;