import './drawer_menu.css';

import '../settings/Settings';
import * as ProgramsSection from './programs/ProgramsDrawerSection';

import * as Routing from "../Routing";
import { query, queryAll } from '../utils/HtmlUtils';

const HIDDEN_DRAWER_CLASS = "drawer_menu__hidden";

let drawer = document.querySelector(".drawer_menu");
let drawerOverlay = query(".drawer_menu_overlay");

drawerOverlay.addEventListener("click", close);

query("#closeDrawerBtn")
  .addEventListener("click", close);

queryAll("button[name=menuBtn]")
  .forEach(btn => btn.addEventListener("click", toggle));

query("button[name=homeBtn]")
  .addEventListener("click", Routing.toTitleScreen);

function isMobile() {
  return window.innerWidth <= 1000;
}

let shown = isMobile();

function init(programs) {
  toggleDrawerElement();
  ProgramsSection.init(programs);
}

function close() {
  setDrawerShownState(false);
}
function toggle() {
  setDrawerShownState(!shown);
}
function onItemSelect(event) {
  if (isMobile()) {
    toggle();
  }
}

function setDrawerShownState(newState) {
  shown = newState;
  toggleDrawerElement();
}
function toggleDrawerElement() {
  if (shown) {
    drawer.classList.remove(HIDDEN_DRAWER_CLASS);
    drawerOverlay.classList.remove(HIDDEN_DRAWER_CLASS);
  } else {
    drawer.classList.add(HIDDEN_DRAWER_CLASS);
    drawerOverlay.classList.add(HIDDEN_DRAWER_CLASS);
  }
}

query("#newProgramBtn").addEventListener("click", () => {
  ProgramsSection.deselectAllItems();
  onItemSelect();
  Routing.toNewProgramScreen();
});

export { init, onItemSelect };
