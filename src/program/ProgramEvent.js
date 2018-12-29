import programElement from "./ProgramElement";

let programEvent = Object.create(programElement);
programEvent.init = function(name, startTime, children, duration) {
  programElement.init.apply(this, [startTime, children, duration]);
  this.name = name;
  this.duration = duration;
};

export default programEvent;