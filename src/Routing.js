import * as log from "./utils/Logging"
import { screens } from "./Screens";
import * as Storage from './Storage';

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
  screens.title.show();
}
function newProgram() {
  screens.edit.show();
}
function loadProgram(id) {
  screens.timer.show(Storage.loadProgram(id));
}
function editProgram(id) {
  screens.edit.show(Storage.loadProgram(id));
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


function toTitleScreen() {
  history.pushState({}, screens.title.title(), `/`);
  screens.title.show();
}
function toNewProgramScreen() {
  history.pushState({}, screens.edit.title(), "/new");
  screens.edit.show();
}
function toTimerScreen(program, recreateTimer) {
  history.pushState({}, screens.timer.title(program), `/programs/${program.id}`);
  screens.timer.show(program, recreateTimer);
}
function toEditScreen(program) {
  history.pushState({}, screens.edit.title(program), `/programs/${program.id}/edit`);
  screens.edit.show(program);
}

export { toTimerScreen, toEditScreen, toNewProgramScreen, toTitleScreen };