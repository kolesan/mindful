import './program_events_editor.css';

import { makeDropZone } from "../dragndrop/DropZone";
import {
  createElement, disable, enable, iconElem, path, removeChildNodes, removeComponent
} from "../../utils/HtmlUtils";
import { alphanumericValidation, markInvalid, markValid } from "../../Validation";
import * as InputValidator from "../../text_input/InputValidator";
import { noop, sgong } from "../../EventCallbacks";
import { makeDraggable } from "../dragndrop/Draggable";
import * as ModelViewConverter from "./ProgramModelViewConverter";
import { ToolNames, Tools } from "../tools/Tools";
import * as TreeUtils from "../../utils/TreeUtils";
import { fade } from "../../utils/Utils";
import { log } from "../../utils/Logging";
import * as EventBus from "../../utils/EventBus";
import { DURATION_CHANGED_EVENT } from "../../utils/Events";
import {
  durationInputOf, elemDurationSum, eventDuration, isEvent, isLoop, loopDuration,
  programElemChildren
} from "../tools/ToolComponent";

function inst(containerCmp) {
  let childEventsEditorCmp = containerCmp.querySelector(".program_events__children__editor");
  let mainEventIcon = containerCmp.querySelector(".program_events__main > i");
  let mainEventHeadingSection = containerCmp.querySelector(".program_events__main__heading");
  let mainEventDurationInput = mainEventHeadingSection.querySelector("[name=mainEventDurationInput");
  let mainEventNameInput = mainEventHeadingSection.querySelector("[name=mainEventNameInput");

  let dragHereCmp = createDragHereTextCmp();
  let programEditorDropZone = makeEditorDropZone();
  let placeholder = createPlaceholder();
  let showingPlaceholder = false;

  EventBus.globalInstance.bindListener(DURATION_CHANGED_EVENT, recalculateParentDuration);

  let mainEventNameValidator = InputValidator.inst(mainEventNameInput)
    .bindValidation(alphanumericValidation)
    .onFail(markInvalid)
    .onSuccess(markValid)
    .triggerOn("input");
  showDragHereTxt();

  initScrollBarStyleSheet();

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
    init() {
      programEditorDropZone.init();
    },
    load(mainEvent) {
      mainEventNameInput.value = mainEvent.name;
      mainEventDurationInput.value = mainEvent.duration;

      markValid(mainEventNameInput);

      removeChildNodes(childEventsEditorCmp, it => it.dataset.element);
      let viewElements = ModelViewConverter.programToView(mainEvent, cmp => {
        makeCmpDraggable(cmp);
      });
      if (viewElements.length > 0) {
        viewElements.forEach(viewElement => childEventsEditorCmp.appendChild(viewElement));
        hideDragHereTxt();
      } else {
        showDragHereTxt();
      }
      setScrollbarWidth();
    },
    save() {
      let programElements = ModelViewConverter.viewToProgram(childEventsEditorCmp.children);
      let mainEvent = {
        name: mainEventNameInput.value,
        duration: mainEventDurationInput.value,
        callback: programElements.length > 0 ? noop : sgong,
        children: programElements
      };
      //TODO temporary fix until user can select callback from the UI
      let visitor = TreeUtils.postorderRightToLeftVisitor(mainEvent);
      let lastNode = visitor.next();
      lastNode.value.callback = sgong;
      visitor.return();
      return mainEvent;
    },
    validate() {
      let invalidElem = TreeUtils.flatten(childEventsEditorCmp).find(elem => elem.dataset.valid === "false");
      return mainEventNameValidator.validate() && !invalidElem;
    }
  });

  function setScrollbarWidth() {
    if (childEventsEditorCmp.scrollHeight > childEventsEditorCmp.clientHeight) {
      setScrollbarStyles(10);
    } else {
      removeScrollbarStyles();
    }
  }

  function makeEditorDropZone() {
    return makeDropZone(childEventsEditorCmp)
      .onDragEnter(draggable => {
        hideDragHereTxt();
        if (!showingPlaceholder) {
          showPlaceholder(draggable, childEventsEditorCmp);
        }
        hideRemovalMark(draggable);
        setScrollbarWidth();
      })
      .onDragOver(draggable => {
        showPlaceholder(draggable, childEventsEditorCmp);
      })
      .onDragLeave(draggable => {
        removePlaceholder();
        setScrollbarWidth();
        showRemovalMark(draggable);
        if (childEventsEditorCmp.childElementCount == 0) {
          showDragHereTxt();
        }
      })
      .onDrop(draggable => {
        handleDrop(draggable);
        removePlaceholder();
      })
      .build();
  }
  function hideRemovalMark(draggable) {
    let overlay = draggable.dragImage.querySelector(".program__element__removal_overlay");
    if (overlay) {
      fade({cmp: overlay, from: 1, to: 0, duration: 150, onFinish: cmp => removeComponent(cmp)});
    }
    draggable.dragImage.classList.remove("program__element__removal_mark");
  }
  function showRemovalMark(draggable) {
    let notATool = !draggable.data.get("tool");
    if (notATool) {
      let overlay = createElement("div", "program__element__removal_overlay", "Remove");
      fade({cmp: overlay, from: 0, to: 1, duration: 150});
      draggable.dragImage.appendChild(overlay);
      draggable.dragImage.classList.add("program__element__removal_mark");
    }
  }
  function createDragHereTextCmp() {
    let wrapper = createElement("div", "program__drag_here_txt_wrapper");
    wrapper.appendChild(createElement("div", "program__drag_here_txt", "Drag items here to construct a program"));
    return wrapper;
  }

  function createPlaceholder() {
    let clone = Tools.create(ToolNames.event).element;
    clone.classList.add("program__element__placeholder");
    /*
      TODO this should not be needed when implementation of duration recalculation is finished properly
      this is done so that placeholder is not detected as a program element (e.g. not to mess with duration calculation)
    */
    clone.dataset.element = "";
    return clone;
  }

  function showPlaceholder(draggable, parent) {
    for(let child of parent.children) {
      if (!child.classList.contains("program__element") || child.classList.contains("program__element__placeholder")) {
        continue;
      }
      if (draggable.centerIsInside(child, -5)) {
        showPlaceholder(draggable, child);
        return;
      }
      if (draggable.centerIsAbove(child)) {
        parent.insertBefore(placeholder, child);
        showingPlaceholder = true;
        return;
      }
    }
    parent.appendChild(placeholder);
    showingPlaceholder = true;
  }

  function removePlaceholder() {
    if (showingPlaceholder) {
      removeComponent(placeholder);
      showingPlaceholder = false;
    }
  }

  function hideDragHereTxt() {
    removeComponent(dragHereCmp);
  }

  function showDragHereTxt() {
    if (!dragHereCmp.parentNode) {
      childEventsEditorCmp.appendChild(dragHereCmp);
    }
  }

  function handleDrop(movable) {
    let toolName = movable.data.get("tool");
    let element = null;

    if (toolName) {
      element = newProgramElement(toolName);
    } else {
      element = movable.data.get("element");
    }

    if (!element) {
      throw new Error(`Can not drop unknown element '${element}'`);
    }

    let parent = placeholder.parentNode;
    parent.insertBefore(element, placeholder);

    if (element.dataset.element == ToolNames.event) {
      recalculateParentDuration(element);
    }
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

  function newProgramElement(toolName) {
    let cmp = Tools.create(toolName);
    makeCmpDraggable(cmp);
    return cmp.element;
  }
  function makeCmpDraggable({element: elem, onDrag}) {
    makeDraggable(elem, elem.querySelector("[name=dragAnchor]"))
      .onDragStart((dragged, element) => {
        leaveOnlyHeadingVisible(dragged.dragImage);
        onDrag && onDrag(dragged, element);
        dragged.data.put("element", element);
        showPlaceholderInsteadOf(element);
      })
      .bindDropZone(programEditorDropZone)
      .allowTouch();
  }

  function leaveOnlyHeadingVisible(elem) {
    Array.from(elem.children).forEach(child => {
      if (!child.classList.contains("pe__heading")) {
        child.style.display = "none";
      }
    })
  }

  function showPlaceholderInsteadOf(elem) {
    elem.parentNode.insertBefore(placeholder, elem);
    removeComponent(elem);
    showingPlaceholder = true;
  }
}

function newMainEvent() {
  return {
    name: "MainTimer",
    duration: 0,
    callback: sgong,
    children: []
  };
}


const SCROLLBAR_STYLESHEET_ID = "scrollbarStyleSheet";

function initScrollBarStyleSheet() {
  let style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.setAttribute("id", SCROLLBAR_STYLESHEET_ID);
  document.head.appendChild(style);
}

function setScrollbarStyles(scrollBarWidth) {
  let styleSheet = document.getElementById(SCROLLBAR_STYLESHEET_ID);
  styleSheet.innerHTML = `
    .program_events__children__editor::-webkit-scrollbar {
      width: ${scrollBarWidth}px;
    }
  `;
}

function removeScrollbarStyles() {
  let styleSheet = document.getElementById(SCROLLBAR_STYLESHEET_ID);
  styleSheet.innerHTML = ``;
}


export { inst, newMainEvent }