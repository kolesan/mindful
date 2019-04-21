import './program_events_editor.css';

import { log } from "../../utils/Logging";
import {
  children,
  disable, enable, iconElem,
} from "../../utils/HtmlUtils";
import { alphanumericValidation, markInvalid, markValid } from "../../Validation";
import * as InputValidator from "../../text_input/InputValidator";
import * as TreeUtils from "../../utils/TreeUtils";
import * as EventBus from "../../utils/EventBus";
import { noop, sgong, callbackDictionary } from "../../EventCallbacks";
import { DURATION_CHANGED_EVENT } from "../../utils/Events";
import {
  durationInputOf, elemDurationSum, eventDuration, isEvent, isLoop, loopDuration,
  programElemChildren
} from "../tools/ToolComponent";
import ToolNames from "../tools/ToolNames";
import editorDropZone from "./EditorDropZone";
import ConverterRegistry, { Converters } from "../../program_model_converters/ConverterRegistry"

const modelToEditorComponentsConverter = ConverterRegistry.get(Converters.editorDOM);

function inst(containerCmp) {
  let childEventsEditorCmp = containerCmp.querySelector(".program_events__children__editor");
  let mainEventIcon = containerCmp.querySelector(".program_events__main > i");
  let mainEventHeadingSection = containerCmp.querySelector(".program_events__main__heading");
  let mainEventDurationInput = mainEventHeadingSection.querySelector("[name=mainEventDurationInput");
  let mainEventNameInput = mainEventHeadingSection.querySelector("[name=mainEventNameInput");

  let programEditorDropZone = editorDropZone({
    container: childEventsEditorCmp,
    dropCb: (element) => {
      if (element.dataset.element == ToolNames.event) {
        recalculateParentDuration(element);
      }
    }
  });

  EventBus.globalInstance.bindListener(DURATION_CHANGED_EVENT, recalculateParentDuration);

  let mainEventNameValidator = InputValidator.inst(mainEventNameInput)
    .bindValidation(alphanumericValidation)
    .onFail(markInvalid)
    .onSuccess(markValid)
    .triggerOn("input");

  //TODO make main event also a program element event so this logic would not be duplicated
  (function initChildMutationCallbacks() {
    let childElementsObserver = new MutationObserver(() => {
      let children = programElemChildren(childEventsEditorCmp);
      if (children.length > 0) {
        mainEventDurationInput.value = elemDurationSum(programElemChildren(childEventsEditorCmp));
        disable(mainEventDurationInput);
        let iconElement = iconElem("fas fa-bell-slash");
        mainEventIcon.parentNode.replaceChild(iconElement, mainEventIcon);
        mainEventIcon = iconElement;
        mainEventIcon.style.opacity = 0.6;
        mainEventIcon.title = "Events with children are muted";
      } else {
        enable(mainEventDurationInput);
        let iconElement = iconElem("fas fa-bell");
        mainEventIcon.parentNode.replaceChild(iconElement, mainEventIcon);
        mainEventIcon = iconElement;
        mainEventIcon.style.opacity = "";
        mainEventIcon.title = "Event completion sound";
      }
    });
    childElementsObserver.observe(childEventsEditorCmp, {childList: true});
  })();

  return Object.freeze({
    get dropZone() { return programEditorDropZone },
    load(mainEvent) {
      mainEventNameInput.value = mainEvent.name;
      mainEventDurationInput.value = mainEvent.duration;

      markValid(mainEventNameInput);

      programEditorDropZone.load(mainEvent.children);
    },
    save() {
      let editorProgramElements = children(childEventsEditorCmp);
      let programElements = editorProgramElements.map(child => modelToEditorComponentsConverter.deserialize(child));
      let mainEvent = {
        element: ToolNames.event,
        name: mainEventNameInput.value,
        duration: mainEventDurationInput.value,
        callback: programElements.length > 0 ? callbackDictionary.get(noop) : callbackDictionary.get(sgong),
        children: programElements
      };
      setLastCallbackToSgong(mainEvent); //TODO: fix (temporary until user can select callback from the UI)
      return mainEvent;
    },
    validate() {
      let invalidElem = TreeUtils.flatten(childEventsEditorCmp).find(elem => elem.dataset.valid === "false");
      return mainEventNameValidator.validate() && !invalidElem;
    }
  });

  function setLastCallbackToSgong(mainEvent) {
    let visitor = TreeUtils.postorderRightToLeftVisitor(mainEvent);
    let lastNode = visitor.next();
    lastNode.value.callback = callbackDictionary.get(sgong);
    visitor.return();
  }

  function recalculateParentDuration(element) {
    // log("After event Recalculating duration for", element);
    let parent = element.parentNode;
    if (isEvent(parent)) {
      durationInputOf(parent).value = eventDuration(parent);
    } else if (isLoop(parent)) {
      durationInputOf(parent).value = loopDuration(parent);
    } else if (parent.isSameNode(childEventsEditorCmp)) {
      mainEventDurationInput.value = elemDurationSum(programElemChildren(childEventsEditorCmp));
    } else {
      log(parent);
      throw Error("Program element not supported");
    }
  }
}

function newMainEvent() {
  return {
    name: "",
    duration: 0,
    callback: sgong,
    children: []
  };
}

export { inst, newMainEvent }