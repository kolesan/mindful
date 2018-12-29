import programElement from "./ProgramElement";

let programEvent = Object.create(programElement);
programEvent.init = function(name, children, duration, callback) {
  programElement.init.apply(this, [children, duration, callback]);
  this.name = name;
  this.duration = duration;
};

export default programEvent;