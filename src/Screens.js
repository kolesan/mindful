import { screen as timerScreen } from './timer_screen/TimerScreen';
import { screen as editScreen } from './edit_screen/EditScreen';
import { screen as titleScreen } from './title_screen/TitleScreen';
import { screen as notFoundScreen } from './not_found_screen/NotFoundScreen';

let currentScreen = null;

let screens = Object.freeze({
  title: wrap(titleScreen),
  timer: wrap(timerScreen),
  edit: wrap(editScreen),
  notFound: wrap(notFoundScreen)
});

function wrap(screen) {
  return Object.freeze({
    init(...args) {
      screen.onShow(...args);
    },
    show(...args) {
      hide(currentScreen);
      currentScreen = screen;
      show(currentScreen, ...args);
      document.title = screen.title(...args);
    },
    title: screen.title
  });
}

function hide(screen) {
  if (screen) {
    screen.cmp.classList.add("hidden");
    screen.onHide && screen.onHide();
  }
}
function show(screen, ...args) {
  screen.onShow(...args);
  screen.cmp.classList.remove("hidden");
}

export { screens };
