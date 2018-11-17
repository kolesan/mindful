import './edit_screen.css';

import { createComponent } from '../utils/HtmlUtils';

let loop = document.querySelector("#loopTool");
let event = document.querySelector("#eventTool");
let programEditor = document.querySelector(".program__editor");


const Tools = {
  loop: "loop",
  event: "event"
};

loop.addEventListener("dragstart", event => {
  event.dataTransfer.setData('tool', Tools.loop);
  event.dataTransfer.effectAllowed = "copy";
  // console.log(event)
});

event.addEventListener("dragstart", event => {
  event.dataTransfer.setData('tool', Tools.event);
  event.dataTransfer.effectAllowed = "copy";
  // console.log(event)
});

programEditor.addEventListener("drop", dropListener);

function dropListener(event) {
  event.preventDefault();
  let tool = event.dataTransfer.getData("tool");
  if (tool) {
    console.log("drop", event);
    console.log(event.dataTransfer);
    console.log(event.target);
    console.log(tool);
    addTool(tool, event.target);
  }
}
function addTool(tool, parent) {
  switch(tool) {
    case Tools.loop:
      addLoop(parent);
      break;
    case Tools.event:
      addEvent(parent);
      break;
  }
}
const LOOP_ICON = "fas fa-undo-alt";
const EVENT_ICON = "fas fa-bell";
function addLoop(parent) {
  let loop = createElement(Tools.loop, LOOP_ICON);
  parent.appendChild(loop);
}
function addEvent(parent) {
  let event = createElement(Tools.event, EVENT_ICON);
  parent.appendChild(event);
}
function createElement(tool, icon) {
  let elem = createComponent("div", `program__element program__element__${tool}`);
  elem.appendChild(iconCmp(icon));
  elem.addEventListener("dragstart", event => {
    event.dataTransfer.setData('tool', Tools.loop);
    event.dataTransfer.effectAllowed = "move";
    console.log("start", event);
  });
  elem.addEventListener("dragenter", event => {event.preventDefault();});
  elem.addEventListener("dragover", event => {event.preventDefault();});
  elem.addEventListener("drop", event => dropListener);
  return elem;
}
function iconCmp(classes) {
  return createComponent("i", classes);
}

programEditor.addEventListener("dragenter", event => {
  event.preventDefault();
  console.log("enter", event);
});
programEditor.addEventListener("dragover", event => {
  event.preventDefault();
  /*console.log(event)*/
});
programEditor.addEventListener("dragend", event => console.log(event));