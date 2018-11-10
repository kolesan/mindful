import * as log from './Logging';
import { createComponent, minmax } from './Utils';
import * as Component from './Component';
import { seekingLocked } from './TimerDisplayControls';
import * as eventBus from './EventBus';

const MOUSE_OUT_ON_SEEKING_INDICATOR = "MOUSE_OUT_ON_SEEKING_INDICATOR";
const MOUSE_MOVE_ON_SEEKING_INDICATOR = "MOUSE_MOVE_ON_SEEKING_INDICATOR";
const MOUSE_DOWN_ON_SEEKING_INDICATOR = "MOUSE_DOWN_ON_SEEKING_INDICATOR";
const MOUSE_UP_ON_SEEKING_INDICATOR = "MOUSE_UP_ON_SEEKING_INDICATOR";

function create(level) {
  let cmp = createComponent("div", [`timer__bar__seeking_indicator`]);

  cmp.dataset.level = level;
  cmp.addEventListener("mousemove", event => {
    eventBus.globalInstance.fire(MOUSE_MOVE_ON_SEEKING_INDICATOR, event);
    showSeekingIndicator(event);
  });
  cmp.addEventListener("mouseout", event => {
    eventBus.globalInstance.fire(MOUSE_OUT_ON_SEEKING_INDICATOR, event);
    hideSeekingIndicator(event);
  });
  cmp.addEventListener("mousedown", event => {
    eventBus.globalInstance.fire(MOUSE_DOWN_ON_SEEKING_INDICATOR, event)
  });
  cmp.addEventListener("mouseup", event =>
    eventBus.globalInstance.fire(MOUSE_UP_ON_SEEKING_INDICATOR, event)
  );

  return Component.create([cmp]);
}

function hideSeekingIndicator(event) {
  if (seekingLocked) {
    return;
  }
  event.target.style.backgroundSize = '0% 100%';
}

function showSeekingIndicator(event) {
  if (seekingLocked) {
    return;
  }

  let seekingIndicator = event.target;
  let barWidth = event.target.getBoundingClientRect().width;
  let x = event.offsetX;
  let indicatorWidth = (x / barWidth) * 100;

  seekingIndicator.style.backgroundSize = minmax(0, 100)(indicatorWidth) + '% 100%';
}

export { create,
  MOUSE_OUT_ON_SEEKING_INDICATOR,
  MOUSE_MOVE_ON_SEEKING_INDICATOR,
  MOUSE_DOWN_ON_SEEKING_INDICATOR,
  MOUSE_UP_ON_SEEKING_INDICATOR
};