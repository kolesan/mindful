import { createComponent, removeAllChildNodes } from "../../utils/HtmlUtils";
import * as eventBus from "../../utils/EventBus";
import { NEW_PROGRAM_SAVED_EVENT } from "../../edit_screen/EditScreen";
import * as Routing from "../../Routing";

const ITEM_SELECTED_CLASS = "drawer_menu__item_selected";
let drawerProgramsSection = document.querySelector("#drawerProgramsSection");

function init(programs) {
  removeAllChildNodes(drawerProgramsSection);
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
  let btn = createComponent("button", "drawer_menu__item");
  btn.appendChild(createComponent("i", ["drawer_menu__item__icon", ...program.icon.split(" ")]));
  btn.appendChild(document.createTextNode(program.title));
  btn.addEventListener("click", () => {
    deselectAllSelectOne(btn);
    Routing.toTimerScreen(program);
  });
  drawerProgramsSection.appendChild(btn);
}

eventBus.globalInstance.bindListener(NEW_PROGRAM_SAVED_EVENT, addButton);

export { init, addButton };