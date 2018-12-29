import programElement from "./ProgramElement";

let programEvent = Object.create(programElement);
programEvent.init = function(name, children, duration) {
  programElement.init.apply(this, [children, duration]);
  this.name = name;
  this.duration = duration;
};

export default programEvent;