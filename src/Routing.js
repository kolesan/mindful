import * as log from "./utils/Logging"

window.addEventListener("load", event => {
  console.log("Load", event, history, history.state);
  // console.log(location);
  let path = location.pathname;
  // log.log({path});
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
function loadProgram() {

}
function editProgram() {

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

function showTimerScreen() {
  hide(editScreen);
  show(timerScreen);
}
function showEditScreen() {
  hide(timerScreen);
  show(editScreen);
}
function hide(elem) {
  elem.classList.add("hidden");
}
function show(elem) {
  elem.classList.remove("hidden");
}

window.addEventListener("popstate", event => {
  console.log("Popstate", event, history, history.state);
  let path = location.path;
  // log.log({path});
  route(path);
});
