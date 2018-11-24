import './drawer_menu.css';
import '../settings/Settings';

const HIDDEN_DRAWER_CLASS = "drawer_menu__hidden";

let drawer = document.querySelector(".drawer_menu");
let drawerBtn = document.getElementById("menuBtn");
drawerBtn.addEventListener("click", toggleDrawerState);
let drawerOverlay = document.querySelector(".drawer_menu_overlay");
drawerOverlay.addEventListener("click", toggleDrawerState);
let closeDrawerBtn = document.querySelector("#closeDrawerBtn");
closeDrawerBtn.addEventListener("click", toggleDrawerState);
let shown = window.innerWidth > 1000;
// let shown = false;
toggleDrawer();

function toggleDrawerState(event) {
  shown = !shown;
  toggleDrawer();
}
function toggleDrawer() {
  if (shown) {
    showDrawer();
  } else {
    hideDrawer();
  }
}
function showDrawer() {
  drawer.classList.remove(HIDDEN_DRAWER_CLASS);
  drawerOverlay.classList.remove(HIDDEN_DRAWER_CLASS);
}
function hideDrawer() {
  drawer.classList.add(HIDDEN_DRAWER_CLASS);
  drawerOverlay.classList.add(HIDDEN_DRAWER_CLASS);
}

let newProgramBtn = document.querySelector("#newProgramBtn");
newProgramBtn.addEventListener("click", event => {
  showEditScreen();
});
let timerScreen = document.querySelector("#timerScreen");
let editScreen = document.querySelector("#editScreen");
showTimerScreen();
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
export { toggleDrawerState };
