import { createComponent, removeComponent, formatTime } from './Utils';

function newBarComponent(level, event) {
  let timeComponent = createComponent("div", [`timer__current_time`, `timer__current_time_l${level}`], formatTime(0));
  let bar = createComponent("div", [`timer__bar`, `timer__bar_l${level}`]);
  let barName = createComponent("span", [`timer_bar__name`], event.name);
  let seekingIndicator = createComponent("div", [`timer__bar__seeking_indicator`]);
  let duration = createComponent("div", [`timer__duration`, `timer_duration_l${level}`], formatTime(event.duration));

  bar.style.backgroundSize = "0% 100%";
  bar.appendChild(barName);
  bar.appendChild(seekingIndicator);
  seekingIndicator.dataset.level = level;
  seekingIndicator.addEventListener("mousemove", showSeekingIndicator);
  seekingIndicator.addEventListener("mouseout", hideSeekingIndicator);
  seekingIndicator.addEventListener("click", event =>
    eventBus.instance.fire(TIMER_BAR_CLICKED_EVENT, event)
  );

  let components = [timeComponent, bar, duration];
  return {
    animation: animateBar(bar, event.duration),
    setTime(time) {
      timeComponent.innerHTML = formatTime(time);
    },
    attachTo(container) {
      components.forEach(it => container.appendChild(it));
    },
    detach() {
      components.forEach(it => removeComponent(it));
    }
  };
}

function animateBar(bar, duration) {
  // log.trace({bar, duration});
  bar.style.transform = "translate3d(0,0,0)";
  let animation = bar.animate(
    [
      { backgroundSize: "0" },
      { backgroundSize: "100%" }
    ],
    { duration: duration }
  );
  animation.pause();
  return animation;
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

  seekingIndicator.style.backgroundSize = utils.minmax(0, 100)(indicatorWidth) + '% 100%';
}

export { newBarComponent };