import programElement from "./ProgramElement";

let programEvent = Object.create(programElement);
programEvent.init = function(name, callback, children, duration) {
  programElement.init.call(this, children, duration);
  this.name = name;
  this.callback = callback;
  return this;
};

export default programEvent;