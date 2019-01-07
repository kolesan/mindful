import { optional } from "./FunctionalUtils";

export const fnPush = Symbol("Push that returns the array");
export const fnEach = Symbol("forEach that returns the array");
export const fnFind = Symbol("Find that returns an Optional object");

//Array
extendProto(Array.prototype, fnPush, function(...items) {
  this.push(...items);
  return this;
});
extendProto(Array.prototype, fnEach, function(fn) {
  this.forEach(fn);
  return this;
});
extendProto(Array.prototype, fnFind, function(fn) {
  return optional(this.find(fn));
});


function extendProto(prototype, symbol, fn) {
  if (!prototype[symbol]) {
    prototype[symbol] = fn;
  } else {
    throw Error(`Function '${symbol}' already defined on '${prototype}'`);
  }
}