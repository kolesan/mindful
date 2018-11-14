import * as log from './Logging';
import { createComponent, minmax } from './Utils';
import * as Component from './Component';
import { seekingLocked } from './TimerDisplayControls';
import * as eventBus from './EventBus';

const TOUCH_START_ON_SEEKING_INDICATOR = "TOUCH_START_ON_SEEKING_INDICATOR";
const TOUCH_MOVE_ON_SEEKING_INDICATOR = "TOUCH_MOVE_ON_SEEKING_INDICATOR";
const TOUCH_END_ON_SEEKING_INDICATOR = "TOUCH_END_ON_SEEKING_INDICATOR";
const MOUSE_OUT_ON_SEEKING_INDICATOR = "MOUSE_OUT_ON_SEEKING_INDICATOR";
const MOUSE_MOVE_ON_SEEKING_INDICATOR = "MOUSE_MOVE_ON_SEEKING_INDICATOR";
const MOUSE_DOWN_ON_SEEKING_INDICATOR = "MOUSE_DOWN_ON_SEEKING_INDICATOR";
const MOUSE_UP_ON_SEEKING_INDICATOR = "MOUSE_UP_ON_SEEKING_INDICATOR";

function touchWidthPercentage(event, width, left) {
  return calculateWidthPercentage(width, event.touches[0].clientX - left);
}

function mouseWidthPercentage(event) {
  return calculateWidthPercentage(event.target.clientWidth, event.offsetX);
}

function calculateWidthPercentage(width, x) {
  return minmax(0, 100)((x / width) * 100);
}

function create(level) {
  let cmp = createComponent("div", [`timer__bar__seeking_indicator`]);
  cmp.dataset.level = level;

  cmp.addEventListener("touchstart", event => {
    let rect = event.target.getBoundingClientRect();
    eventBus.globalInstance.fire(TOUCH_START_ON_SEEKING_INDICATOR, level, touchWidthPercentage(event, rect.width, rect.left));
    event.target.classList.add("timer__bar__seeking_indicator_active");
  });
  cmp.addEventListener("touchmove", event => {
    let rect = event.target.getBoundingClientRect();
    eventBus.globalInstance.fire(TOUCH_MOVE_ON_SEEKING_INDICATOR, level, touchWidthPercentage(event, rect.width, rect.left));
  });
  cmp.addEventListener("touchend", () => {
    eventBus.globalInstance.fire(TOUCH_END_ON_SEEKING_INDICATOR);
    event.target.classList.remove("timer__bar__seeking_indicator_active");
  });

  cmp.addEventListener("mousemove", event => {
    let width = mouseWidthPercentage(event);
    eventBus.globalInstance.fire(MOUSE_MOVE_ON_SEEKING_INDICATOR, level, width);
    showSeekingIndicator(event, width);
  });
  cmp.addEventListener("mouseout", event => {
    eventBus.globalInstance.fire(MOUSE_OUT_ON_SEEKING_INDICATOR, level, event.target);
    hideSeekingIndicator(event);
  });
  cmp.addEventListener("mousedown", event => {
    eventBus.globalInstance.fire(MOUSE_DOWN_ON_SEEKING_INDICATOR, level, mouseWidthPercentage(event));
    if (!seekingLocked) {
      event.target.classList.add("timer__bar__seeking_indicator_active");
    }
  });
  cmp.addEventListener("mouseup", event => {
    eventBus.globalInstance.fire(MOUSE_UP_ON_SEEKING_INDICATOR, level, mouseWidthPercentage(event));
    event.target.classList.remove("timer__bar__seeking_indicator_active");
  });

  return Component.create([cmp]);
}

function hideSeekingIndicator(event) {
  if (seekingLocked) {
    return;
  }
  event.target.style.backgroundSize = '0% 100%';
}

function showSeekingIndicator(event, width) {
  if (seekingLocked) {
    return;
  }

  event.target.style.backgroundSize = width + '% 100%';
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