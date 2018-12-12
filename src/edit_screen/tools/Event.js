import { createElement, focusOnTouch, iconCmp } from "../../utils/HtmlUtils";
import { alphanumericValidation, markInvalid, markValid } from "../../Validation";
import { ToolNames } from "./Tools";
import * as InputValidator from "../../text_input/InputValidator";
import * as Component from "../../utils/Component";

const EVENT_ICON = "fas fa-bell";

function create({name, duration} = {}) {
  let elem = createElement("div", `program__element program__element__${ToolNames.event}`);
  elem.appendChild(eventHeadingCmp(name, duration));
  elem.dataset.element = ToolNames.event;

  return Component.create([elem], {
    onDrag(dragged) {
      //Shadow dom values are not cloned with cloneNode() call for some reason
      copyDurationInputValue(elem, dragged.dragImage);
    }
  });
}

function copyDurationInputValue(from, to) {
  durationInputOf(to).value = durationInputOf(from).value;
}
function durationInputOf(cmp) {
  return cmp.querySelector("duration-input");
}

function eventHeadingCmp(name, duration) {
  let heading = createElement("div", "pe__heading pee__heading");
  heading.appendChild(iconCmp(EVENT_ICON));
  heading.appendChild(nameInputCmp(name));
  heading.appendChild(durationInputCmp(duration));
  return heading;
}

function nameInputCmp(name = `TimerEvent`) {
  let input = createElement("input", "text_input peh__name_input");
  input.setAttribute("type", "text");
  input.setAttribute("spellcheck", "false");
  input.setAttribute("name", "eventNameInput");
  input.value = name;
  input.addEventListener("mousedown", event => event.stopPropagation());

  focusOnTouch(input);

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
  input.addEventListener("mousedown", event => event.stopPropagation());

  focusOnTouch(input);

  return input;
}

export { create };