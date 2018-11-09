import { createComponent, minmax } from './Utils';
import * as Component from './Component';
import { seekingLocked } from './TimerDisplayControls';

function create(level) {
  let cmp = createComponent("div", [`timer__bar__seeking_indicator`]);

  cmp.dataset.level = level;
  cmp.addEventListener("mousemove", showSeekingIndicator);
  cmp.addEventListener("mouseout", hideSeekingIndicator);
  cmp.addEventListener("click", event =>
    eventBus.instance.fire(TIMER_BAR_CLICKED_EVENT, event)
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

export { create };