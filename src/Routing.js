import * as log from "./utils/Logging"
import * as EditScreen from "./edit_screen/EditScreen";
import * as TimerScreen from "./timer_screen/TimerScreen";
import { screens } from "./Screens";

window.addEventListener("load", event => {
  console.log("Load", event, history, history.state);
  let path = location.pathname;
  route(path);
});

let Routes = {
  "/": titleScreen,
  "/new": newProgram,
  "/programs/:id": loadProgram,
  "/programs/:id/edit": editProgram
};

function titleScreen() {
  // screens.title.show();
}
function newProgram() {
  screens.edit.show();
}
function loadProgram(id) {
  screens.timer.show(id);
}
function editProgram(id) {
  screens.edit.show(id);
}

function route(path) {
  let matchingRoute = findRoute(path);

  if (!matchingRoute) {
    titleScreen();
    throw new Error(`No route for '${path}' exists`);
  }

  let pathParams = extractParams(path, matchingRoute);

  log.log({route: matchingRoute}, pathParams);

  Routes[matchingRoute](...pathParams);
}

function findRoute(path) {
  let pathSegments = path.split("/");
  return Object.keys(Routes).find(route => {
      let routeSegments = route.split("/");
      if (pathSegments.length != routeSegments.length) {
        return false;
      }
      for(let i = 0; i < pathSegments.length; i++) {
        let pathSegment = pathSegments[i];
        let routeSegment = routeSegments[i];
        if (routeSegment[0] != ":" && routeSegment != pathSegment) {
          return false;
        }
      }
      return true;
    });
}

function extractParams(path, route) {
  let pathSegments = path.split("/");
  let routeSegments = route.split("/");

  let pathParams = [];
  routeSegments.forEach((routeSegment, i) => {
    let pathSegment = pathSegments[i];
    if (routeSegment[0] == ":") {
      pathParams.push(pathSegment);
    }
  });
  return pathParams;
}

window.addEventListener("popstate", event => {
  console.log("Popstate", event, history, history.state);
  let path = location.pathname;
  log.log({path});
  route(path);
});

function toTimerScreen(programTitle, programId) {
  document.title = `Program ${programTitle}`;
  history.pushState({}, document.title, `/programs/${programId}`);
  screens.timer.show(programId);
}

function toNewProgramScreen() {
  document.title = `New program`;
  history.pushState({}, document.title, "/new");
  screens.edit.show();
}

function toEditScreen(programTitle, programId) {
  document.title = `Edit program ${programTitle}`;
  history.pushState({}, document.title, `/programs/${programId}/edit`);
  screens.edit.show(programId);
}

export { toTimerScreen, toEditScreen, toNewProgramScreen };