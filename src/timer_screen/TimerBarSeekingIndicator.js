import { log } from '../utils/Logging';
import { createElement } from '../utils/HtmlUtils';
import * as Component from '../utils/Component';
import * as eventBus from '../utils/EventBus';

const TOUCH_START_ON_SEEKING_INDICATOR = "TOUCH_START_ON_SEEKING_INDICATOR";
const TOUCH_MOVE_ON_SEEKING_INDICATOR = "TOUCH_MOVE_ON_SEEKING_INDICATOR";
const TOUCH_END_ON_SEEKING_INDICATOR = "TOUCH_END_ON_SEEKING_INDICATOR";
const MOUSE_OUT_ON_SEEKING_INDICATOR = "MOUSE_OUT_ON_SEEKING_INDICATOR";
const MOUSE_MOVE_ON_SEEKING_INDICATOR = "MOUSE_MOVE_ON_SEEKING_INDICATOR";
const MOUSE_DOWN_ON_SEEKING_INDICATOR = "MOUSE_DOWN_ON_SEEKING_INDICATOR";
const MOUSE_UP_ON_SEEKING_INDICATOR = "MOUSE_UP_ON_SEEKING_INDICATOR";

function create(level) {
  let cmp = createElement("div", [`timer__bar__seeking_indicator`]);

  cmp.addEventListener("touchstart", event => {
    event.preventDefault();
    eventBus.globalInstance.fire(TOUCH_START_ON_SEEKING_INDICATOR, level, event)
  });
  cmp.addEventListener("touchmove", event => {
    event.preventDefault();
    eventBus.globalInstance.fire(TOUCH_MOVE_ON_SEEKING_INDICATOR, level, event)
  });
  cmp.addEventListener("touchend", event => {
    event.preventDefault();
    eventBus.globalInstance.fire(TOUCH_END_ON_SEEKING_INDICATOR, level, event)
  });

  cmp.addEventListener("mousemove", event =>
    eventBus.globalInstance.fire(MOUSE_MOVE_ON_SEEKING_INDICATOR, level, event)
  );
  cmp.addEventListener("mouseout", event =>
    eventBus.globalInstance.fire(MOUSE_OUT_ON_SEEKING_INDICATOR, level, event)
  );
  cmp.addEventListener("mousedown", event => {
    eventBus.globalInstance.fire(MOUSE_DOWN_ON_SEEKING_INDICATOR, level, event);
  });
  cmp.addEventListener("mouseup", event =>
    eventBus.globalInstance.fire(MOUSE_UP_ON_SEEKING_INDICATOR, level, event)
  );

  return Component.create([cmp]);
}

export {
  create,
  TOUCH_START_ON_SEEKING_INDICATOR,
  TOUCH_MOVE_ON_SEEKING_INDICATOR,
  TOUCH_END_ON_SEEKING_INDICATOR,
  MOUSE_OUT_ON_SEEKING_INDICATOR,
  MOUSE_MOVE_ON_SEEKING_INDICATOR,
  MOUSE_DOWN_ON_SEEKING_INDICATOR,
  MOUSE_UP_ON_SEEKING_INDICATOR
};