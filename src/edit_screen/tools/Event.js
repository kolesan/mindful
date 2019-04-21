import { log } from "../../utils/Logging";
import { createElement, disable, enable, iconElem } from "../../utils/HtmlUtils";
import { alphanumericValidation, markInvalid, markValid } from "../../Validation";
import ToolNames from "./ToolNames";
import * as InputValidator from "../../text_input/InputValidator";
import * as EventBus from "../../utils/EventBus";
import { DURATION_CHANGED_EVENT } from "../../utils/Events";
import * as ToolComponent from "./ToolComponent";
import { programElemChildren } from "./ToolComponent";
import { eventDuration } from "./ToolComponent";

const EVENT_ICON = "fas fa-bell";
const EVENT_ICON_MUTED = "fas fa-bell-slash";

function fromElement(element) {
  return create({
    name: getNameInput(element).value,
    duration: getDurationInput(element).value
  });
}

function create({name, duration} = {}) {
  let durationInput = durationInputCmp(duration);
  let nameInput = nameInputCmp(name);

  let cmp = ToolComponent.create(EVENT_ICON, ToolNames.event, eventHeadingCmp(nameInput, durationInput));
  //Shadow dom values are not cloned with cloneNode() call for some reason
  cmp.onDrag = draggable => writeValuesTo(draggable.image.node);
  cmp.addChild = child => {
    cmp.children.push(child);
    cmp.element.appendChild(child.element);
  };
  durationInput.onDurationChange(() => EventBus.globalInstance.fire(DURATION_CHANGED_EVENT, cmp.element));

  initChildMutationCallbacks();

  return cmp;

  function writeValuesTo(targetElement) {
    let targetDurationInput = getDurationInput(targetElement);
    let targetNameInput = getNameInput(targetElement);

    if (targetDurationInput && targetNameInput) {
      targetDurationInput.value = durationInput.value;
      targetNameInput.value = nameInput.value;
      return;
    }

    throw Error(`Can not copy event field values to ${targetElement}`);
  }

  function initChildMutationCallbacks() {
    let childElementsObserver = new MutationObserver(() => {
      let children = programElemChildren(cmp.element);
      if (children.length > 0) {
        disable(durationInput);
        durationInput.value = eventDuration(cmp.element);
        //TODO should create custom component for icon and extract disable/enable || mute/unmute logic into it
        cmp.setIcon(iconElem(EVENT_ICON_MUTED));
        cmp.getIcon().style.opacity = 0.6;
        cmp.getIcon().title = "Events with children are muted";
        cmp.element.dataset.muted = "true";
      } else {
        enable(durationInput);
        cmp.setIcon(iconElem(EVENT_ICON));
        cmp.getIcon().style.opacity = "";
        cmp.getIcon().title = "Event completion sound";
        cmp.element.dataset.muted = "false";
      }
    });
    childElementsObserver.observe(cmp.element, {childList: true});
  }
}

function getNameInput(target) {
  return target.querySelector("[name=eventNameInput]");
}
function getDurationInput(target) {
  return target.querySelector("[name=eventDurationInput]")
}

function eventHeadingCmp(nameInput, durationInput) {
  let heading = createElement("div", "pee__heading");
  heading.appendChild(nameInput);
  heading.appendChild(durationInput);
  return heading;
}

function nameInputCmp(name = ``) {
  let input = createElement("dynamic-size-input", "text_input peh__name_input");
  input.setAttribute("type", "text");
  input.setAttribute("spellcheck", "false");
  input.setAttribute("name", "eventNameInput");
  input.setAttribute("placeholder", "Event");
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
  return input;
}

export { create, fromElement };