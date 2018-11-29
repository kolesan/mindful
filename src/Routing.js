import * as log from "./utils/Logging"
import * as EditScreen from "./edit_screen/EditScreen";
import * as TimerScreen from "./timer_screen/TimerScreen";

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
  showTimerScreen();
}
function newProgram() {
  showEditScreen();
}
function loadProgram(id) {
  showTimerScreen(id);
}
function editProgram(id) {
  showEditScreen(id);
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

let timerScreen = document.querySelector("#timerScreen");
let editScreen = document.querySelector("#editScreen");

function showTimerScreen(programId) {
  hide(editScreen);
  show(timerScreen);
  TimerScreen.onShow(programId);
}
function showEditScreen(programId) {
  hide(timerScreen);
  show(editScreen);
  EditScreen.onShow(programId);
}
function hide(elem) {
  elem.classList.add("hidden");
}
function show(elem) {
  elem.classList.remove("hidden");
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
  showTimerScreen(programId);
}

function toNewProgramScreen() {
  document.title = `New program`;
  history.pushState({}, document.title, "/new");
  showEditScreen();
}

function toEditScreen(programTitle, programId) {
  document.title = `Edit program ${programTitle}`;
  history.pushState({}, document.title, `/programs/${programId}/edit`);
  showEditScreen(programId);
}

export { toTimerScreen, toEditScreen, toNewProgramScreen };