import { createElement } from '../utils/HtmlUtils';
import { formatTime } from '../utils/TimeUtils';
import * as SeekingIndicator from './TimerBarSeekingIndicator';
import * as Component from '../utils/Component';

function create(level, event) {
  let time = createElement("div", [`timer__current_time`, `timer__current_time_l${level}`], formatTime(0));
  let bar = createElement("div", [`timer__bar`, `timer__bar_l${level}`]);
  let barName = createElement("span", [`timer_bar__name`], event.name);
  let duration = createElement("div", [`timer__duration`, `timer_duration_l${level}`], formatTime(event.duration));

  bar.style.backgroundSize = "0% 100%";
  bar.appendChild(barName);

  let seekingIndicator = SeekingIndicator.create(level);
  seekingIndicator.attach(bar);

  return Component.create([time, bar, duration], {
      animation: animateBar(bar, event.duration),
      setTime(t) {
        time.innerHTML = formatTime(t);
      }
  });
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

export { create };