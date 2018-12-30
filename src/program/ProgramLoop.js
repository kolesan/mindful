import programElement from "./ProgramElement";
import { div } from "../utils/MathUtils";

let programLoop = Object.create(programElement);
programLoop.init = function(iterations, children, duration, callback) {
  programElement.init.apply(this, [children, duration, callback]);
  this.iterations = iterations;
  this.virtualChildCount = this.iterations * this.children.length;
};
programLoop.nextChild = function() {
  this.currentChildIndex++;
  return currentChild.apply(this);
};
programLoop.previousChild = function() {
  this.currentChildIndex--;
  return currentChild.apply(this);
};
programLoop.skipToAfterLastChild = function () {
  this.currentChildIndex = this.virtualChildCount;
};


function currentChild() {
  if (this.currentChildIndex >= this.virtualChildCount) {
    return;
  }

  let child = this.children[this.currentChildIndex % this.children.length];
  if (child) {
    child.iteration = div(this.currentChildIndex, this.children.length);
    child.id = this.currentChildIndex;
  }

  return child;
}


export default programLoop;