import { log } from '../utils/Logging';
import { last } from "../utils/Utils";
import { noop } from "../EventCallbacks";
import ToolNames from "../edit_screen/tools/ToolNames";

export default function programBuilder(name) {
  let program = newEvent(name);
  let elemStack = [program];
  return Object.freeze({
    loop(iterations) {
      addElem(newLoop(iterations));
      return this;
    },
    event(name, duration = 0, callback = noop) {
      addElem(newEvent(name, duration, callback));
      return this;
    },
    end() {
      let pop = elemStack.pop();
      pop.recalculateDuration();
      return this;
    },
    build() {
      program.recalculateDuration();
      return program;
    }
  });

  function addElem(elem) {
    let parent = last(elemStack);
    if (!parent) {
      throw new Error("DSL error, trying to add child to non existent parent. Check your 'end`s'.");
    }

    parent.children.push(elem);
    elemStack.push(elem);
  }
  function newLoop(iterations) {
    return {
      element: ToolNames.loop,
      iterations,
      children: [],
      duration: 0,
      recalculateDuration() {
        this.duration = this.children.reduce((a, i) => a + i.duration, 0) * this.iterations;
      }
    };
  }
  function newEvent(name, duration = 0, callback = noop) {
    return {
      element: ToolNames.event,
      name,
      callback,
      children: [],
      duration,
      recalculateDuration() {
        if (this.children.length > 0) {
          this.duration = this.children.reduce((a, i) => a + i.duration, 0);
        }
      }
    };
  }
}