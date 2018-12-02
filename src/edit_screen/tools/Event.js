import { createComponent, iconCmp } from "../../utils/HtmlUtils";
import { alphanumericValidation, markInvalid, markValid } from "../../Validation";
import { ToolNames } from "./Tools";
import * as InputValidator from "../../text_input/InputValidator";

const EVENT_ICON = "fas fa-bell";

function create(name, duration) {
  let event = createComponent("div", `program__element program__element__${ToolNames.event}`);
  event.appendChild(eventHeadingCmp(name, duration));
  event.dataset.element = ToolNames.event;
  return event;
}

function eventHeadingCmp(name, duration) {
  let heading = createComponent("div", "pee__heading");
  heading.appendChild(iconCmp(EVENT_ICON));
  heading.appendChild(nameInputCmp(name));
  heading.appendChild(durationInputCmp(duration));
  return heading;
}

function nameInputCmp(name = `TimerEvent`) {
  let input = createComponent("input", "text_input peh__name_input");
  input.setAttribute("type", "text");
  input.setAttribute("spellcheck", "false");
  input.setAttribute("name", "eventNameInput");
  input.value = name;
  input.addEventListener("mousedown", event => event.stopPropagation());

  InputValidator.inst(input)
    .bindValidation(alphanumericValidation)
    .onFail(markInvalid)
    .onSuccess(markValid)
    .triggerOn("input");

  return input;
}

function durationInputCmp(duration = `00:00:00`) {
  let input = createComponent("input", "text_input peeh__duration_input");
  input.setAttribute("type", "time");
  input.setAttribute("step", "1000");
  input.setAttribute("name", "eventDurationInput");
  input.value = duration;
  input.addEventListener("mousedown", event => event.stopPropagation());
  return input;
}

export { create };