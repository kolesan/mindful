import { createElement, focusOnTouch, iconCmp } from "../../utils/HtmlUtils";
import { alphanumericValidation, markInvalid, markValid } from "../../Validation";
import { ToolNames } from "./Tools";
import * as InputValidator from "../../text_input/InputValidator";
import * as ToolComponent from "./ToolComponent";

const EVENT_ICON = "fas fa-bell";

function create({name, duration} = {}) {
  let cmp = ToolComponent.create(EVENT_ICON, ToolNames.event, eventHeadingCmp(name, duration));
  //Shadow dom values are not cloned with cloneNode() call for some reason
  cmp.onDrag = (dragged, elem) => copyDurationInputValue(elem, dragged.dragImage);
  return cmp;
}

function copyDurationInputValue(from, to) {
  durationInputOf(to).value = durationInputOf(from).value;
}
function durationInputOf(cmp) {
  return cmp.querySelector("duration-input");
}

function eventHeadingCmp(name, duration) {
  let heading = createElement("div", "pee__heading");
  heading.appendChild(nameInputCmp(name));
  heading.appendChild(durationInputCmp(duration));
  return heading;
}

function nameInputCmp(name = `TimerEvent`) {
  let input = createElement("dynamic-size-input", "text_input peh__name_input");
  input.setAttribute("type", "text");
  input.setAttribute("spellcheck", "false");
  input.setAttribute("name", "eventNameInput");
  input.value = name;

  InputValidator.inst(input)
    .bindValidation(alphanumericValidation)
    .onFail(markInvalid)
    .onSuccess(markValid)
    .triggerOn("input");

  return input;
}

function durationInputCmp(duration = 0) {
  let input = createElement("duration-input", "text_input peeh__duration_input");
  input.setAttribute("name", "eventDurationInput");
  input.value = duration;

  focusOnTouch(input);

  return input;
}

export { create };