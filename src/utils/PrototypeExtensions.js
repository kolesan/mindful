import { optional } from "./FunctionalUtils";

//Array
extendProto(Array.prototype, "fnPush", function(...items) {
  this.push(...items);
  return this;
});
extendProto(Array.prototype, "fnEach", function(fn) {
  this.forEach(fn);
  return this;
});
extendProto(Array.prototype, "fnFind", function(fn) {
  return optional(this.find(fn));
});
extendProto(Array.prototype, "fnLog", function() {
  console.log("Logging array:", this);
  return this;
});

//Object
extendProto(Object.prototype, "applyToSelf", function(fn) {
  fn(this);
  return this;
});


function extendProto(prototype, name, fn) {
  if (!prototype[name]) {
    prototype[name] = fn;
  } else {
    throw Error(`Function '${name}' already defined on '${prototype}'`);
  }
}