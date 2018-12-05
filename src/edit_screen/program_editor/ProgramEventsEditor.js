import './program_events_editor.css';

import { makeDropZone } from "../dragndrop/DropZone";
import { createComponent, iconCmp, removeAllChildNodes, removeComponent } from "../../utils/HtmlUtils";
import { alphanumericValidation, markInvalid, markValid } from "../../Validation";
import * as InputValidator from "../../text_input/InputValidator";
import { formatTime, parseTime } from "../../utils/TimeUtils";
import { sgong } from "../../EventCallbacks";
import { makeDraggable } from "../dragndrop/Draggable";
import * as ModelViewConverter from "./ProgramModelViewConverter";
import { Tools } from "../tools/Tools";
import { px } from "../../utils/Utils";

function inst(containerCmp) {
  let childEventsEditorCmp = containerCmp.querySelector(".program_events__children__editor");
  let headingSection = containerCmp.querySelector(".program_events__main");
  let mainEventDurationCmp = headingSection.querySelector("[name=mainEventDurationInput");
  let mainEventNameInput = headingSection.querySelector("[name=mainEventNameInput");

  let dragHereCmp = createDragHereTextCmp();
  let programEditorDropZone = makeEditorDropZone();
  let placeholder = createPlaceholder();
  let showingPlaceholder = false;

  InputValidator.inst(mainEventNameInput)
    .bindValidation(alphanumericValidation)
    .onFail(markInvalid)
    .onSuccess(markValid)
    .triggerOn("input");
  showDragHereTxt();

  return Object.freeze({
    get dropZone() { return programEditorDropZone },
    init() {
      this.load(newMainEvent());
    },
    load(mainEvent) {
      mainEventNameInput.value = mainEvent.name;
      mainEventDurationCmp.value = formatTime(mainEvent.duration);

      markValid(mainEventNameInput);

      removeAllChildNodes(childEventsEditorCmp);
      let viewElements = ModelViewConverter.programToView(mainEvent, makeElementDraggable);
      if (viewElements.length > 0) {
        viewElements.forEach(viewElement => childEventsEditorCmp.appendChild(viewElement));
        hideDragHereTxt();
      } else {
        showDragHereTxt();
      }
    },
    save() {
      return {
        name: mainEventNameInput.value,
        duration: parseTime(mainEventDurationCmp.value),
        callback: sgong,
        children: ModelViewConverter.viewToProgram(childEventsEditorCmp.children)
      };
    }
  });

  function makeEditorDropZone() {
    return makeDropZone(childEventsEditorCmp)
      .onDragEnter(draggable => {
        hideDragHereTxt();
        if (!showingPlaceholder) {
          setPlaceholderHeight(draggable.dragImage);
          showPlaceholder(draggable, childEventsEditorCmp);
        }
      })
      .onDragOver(draggable => {
        showPlaceholder(draggable, childEventsEditorCmp);
      })
      .onDragLeave(draggable => {
        removePlaceholder();
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

  function createDragHereTextCmp() {
    let wrapper = createComponent("div", "program__drag_here_txt_wrapper");
    wrapper.appendChild(createComponent("div", "program__drag_here_txt", "Drag items here to construct program"));
    return wrapper;
  }

  function createPlaceholder() {
    return createComponent("div", `program__element program__element__placeholder`);
  }

  function setPlaceholderHeight(elem) {
    placeholder.style.height = px(elem.getBoundingClientRect().height);
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
    childEventsEditorCmp.appendChild(dragHereCmp);
  }

  function handleDrop(movable) {
    let tool = movable.data.get("tool");
    if (tool) {
      addTool(tool);
      return;
    }

    let element = movable.data.get("element");
    if (element) {
      drop(element);
    }
  }

  function addTool(tool) {
    let elem = Tools.get(tool).create();
    makeElementDraggable(elem);
    placeholder.parentNode.insertBefore(elem, placeholder);
  }

  function makeElementDraggable(elem) {
    makeDraggable(elem)
      .onDragStart((dragged, element) => {
        dragged.data.put("element", element);
        showPlaceholderInsteadOf(element);
      })
      .bindDropZone(programEditorDropZone)
      .allowTouch();
  }

  function showPlaceholderInsteadOf(elem) {
    setPlaceholderHeight(elem);
    elem.parentNode.insertBefore(placeholder, elem);
    removeComponent(elem);
    showingPlaceholder = true;
  }

  function drop(element) {
    placeholder.parentNode.insertBefore(element, placeholder);
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

export { inst, newMainEvent }