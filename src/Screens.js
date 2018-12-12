import { screen as timerScreen } from './timer_screen/TimerScreen';
import { screen as editScreen } from './edit_screen/EditScreen';
import { screen as titleScreen } from './title_screen/TitleScreen';
import { screen as notFoundScreen } from './not_found_screen/NotFoundScreen';

let allScreenComponents = [];
let currentScreen = null;

let screens = Object.freeze({
  title: wrap(titleScreen),
  timer: wrap(timerScreen),
  edit: wrap(editScreen),
  notFound: wrap(notFoundScreen),
  get current() { return currentScreen }
});

function wrap(screen) {
  allScreenComponents.push(screen.cmp);
  return Object.freeze({
    init(...args) {
      screen.onShow(...args);
    },
    show(...args) {
      currentScreen = this;
      showOneHideOthers(screen);
      screen.onShow(...args);
      document.title = screen.title(...args);
    },
    title: screen.title
  });
}

function showOneHideOthers(screen) {
  allScreenComponents.forEach(cmp =>
    cmp.isSameNode(screen.cmp) ? show(cmp) : hide(cmp)
  );
}

function hide(elem) {
  elem.classList.add("hidden");
}
function show(elem) {
  elem.classList.remove("hidden");
}

export { screens };
