import programElement from "./ProgramElement";
import { div } from "../utils/MathUtils";
import { minmax } from "../utils/Utils";

let programLoop = Object.create(programElement);
programLoop.init = function(iterations, children, duration) {
  programElement.init.call(this, children, duration);
  this.iterations = iterations;

  //Parent property shadowing
  this._childCount = this.iterations * this.children.length;
  this._minmaxIndex = minmax(-1, this._childCount);

  return this;
};
programLoop._currentChild = function() {
  if (this._currentChildIndex >= this._childCount) {
    return;
  }

  let child = this.children[this._currentChildIndex % this.children.length];
  if (child) {
    child.iteration = div(this._currentChildIndex, this.children.length);
    child.id = this._currentChildIndex;
  }

  return child;
};
programLoop.isTransparent = function() {
  return true;
};

export default programLoop;