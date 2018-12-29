import programElement from "./ProgramElement";

let programLoop = Object.create(programElement);
programLoop.init = function(iterations, startTime, children, duration) {
  programElement.init.apply(this, [startTime, children, duration]);
  this.iterations = iterations;
  this.currentIteration = 0;
};
//TODO smth about this unreadable duplicate peace of shit
programLoop.nextChild = function() {
  if (this.iterations === 0) {
    return;
  }

  let child = programElement.nextChild.apply(this);
  if (child) {
    child.iteration = this.currentIteration;
    child.startTime *= this.currentIteration + 1;
    return child;
  }

  this.currentIteration++;
  if (this.currentIteration >= this.iterations) {
    this.currentIteration = 0;
    return;
  }

  child = programElement.nextChild.apply(this);
  child.iteration = this.currentIteration;
  child.startTime *= this.currentIteration + 1;
  return child;
};

export default programLoop;