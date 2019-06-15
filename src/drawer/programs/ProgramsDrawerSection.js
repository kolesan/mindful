import { log } from "../../utils/Logging";
import { createElement, removeChildNodes } from "../../utils/HtmlUtils";
import * as Routing from "../../Routing";
import * as Drawer from "../DrawerMenu";

const ITEM_SELECTED_CLASS = "drawer_menu__item_selected";
let drawerProgramsSection = document.querySelector("#drawerProgramsSection");

function init(programs) {
  removeChildNodes(drawerProgramsSection);
  programs.forEach(addButton);
}

function selectItem(item) {
  item.classList.add(ITEM_SELECTED_CLASS);
}
function deselectItem(item) {
  item.classList.remove(ITEM_SELECTED_CLASS);
}
function deselectAllItems() {
  let items = document.querySelectorAll("#drawerProgramsSection > .drawer_menu__item");
  items.forEach(deselectItem);
}
function deselectAllSelectOne(item) {
  deselectAllItems();
  selectItem(item);
}

function addButton(program) {
  log("Adding button for", program);
  let btn = createElement("button", "drawer_menu__item");
  btn.appendChild(createElement("i", ["drawer_menu__item__icon", ...program.icon.split(" ")]));
  btn.appendChild(document.createTextNode(program.title));
  btn.addEventListener("click", onClick(btn, program));
  drawerProgramsSection.appendChild(btn);
}

function onClick(btn, program) {
  return function() {
    Drawer.onItemSelect();
    deselectAllSelectOne(btn);
    Routing.toTimerScreen(program);
  }
}

export { init, addButton, deselectAllItems };