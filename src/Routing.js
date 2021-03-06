import * as log from "./utils/Logging"
import { screens } from "./Screens";
import programsStorage from "./storage/programs_storage/ProgramsStorage";
import jsonReadyConverter from './program_model_converters/json_ready/JSONReadyProgramConverter';

window.addEventListener("load", event => {
  console.log("Load", event, history, history.state);
  let path = location.pathname;
  route(path);
});

let Routes = {
  "/": titleScreen,
  "/new": newProgram,
  "/load/:encodedProgram": saveExternalProgram,
  "/programs/:id": loadProgram,
  "/programs/:id/edit": editProgram
};

function titleScreen() {
  screens.title.show();
}
function newProgram() {
  screens.edit.show();
}
function saveExternalProgram(encodedProgram) {
  let program = jsonReadyConverter.deserialize(JSON.parse(atob(encodedProgram)));
  screens.edit.show(program, true);
}
function loadProgram(id) {
  ifProgramExistsGoTo(id, screens.timer);
}
function editProgram(id) {
  ifProgramExistsGoTo(id, screens.edit);
}
function notFound(msg) {
  screens.notFound.show(msg);
}

function ifProgramExistsGoTo(id, screen) {
  programsStorage.load(id)
    .ifPresent(program => screen.show(program))
    .ifEmpty(() => screens.notFound.show(`Sorry but program ${inRed(id)} was not found`));
}

function inRed(s) {
  return `<span style="background-color: rgb(219, 86, 96); border-radius: 3px;">'${s}'</span>`
}

function route(path) {
  let matchingRoute = findRoute(path);

  if (!matchingRoute) {
    notFound(`Sorry but I do not know where ${inRed(path)} lies`);
    return;
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