import './program_events_editor.css';

import { makeDropZone } from "../dragndrop/DropZone";
import { createElement, iconCmp, removeAllChildNodes, removeComponent } from "../../utils/HtmlUtils";
import { alphanumericValidation, markInvalid, markValid } from "../../Validation";
import * as InputValidator from "../../text_input/InputValidator";
import { sgong } from "../../EventCallbacks";
import { makeDraggable } from "../dragndrop/Draggable";
import * as ModelViewConverter from "./ProgramModelViewConverter";
import { Tools } from "../tools/Tools";
import { px } from "../../utils/Utils";
import * as TreeUtils from "../../utils/TreeUtils";
import { log } from "../../utils/Logging";

function inst(containerCmp) {
  let childEventsEditorCmp = containerCmp.querySelector(".program_events__children__editor");
  let headingSection = containerCmp.querySelector(".program_events__main");
  let mainEventDurationCmp = headingSection.querySelector("[name=mainEventDurationInput");
  let mainEventNameInput = headingSection.querySelector("[name=mainEventNameInput");

  let dragHereCmp = createDragHereTextCmp();
  let programEditorDropZone = makeEditorDropZone();
  let placeholder = createPlaceholder();
  let showingPlaceholder = false;

  let mainEventNameValidator = InputValidator.inst(mainEventNameInput)
    .bindValidation(alphanumericValidation)
    .onFail(markInvalid)
    .onSuccess(markValid)
    .triggerOn("input");
  showDragHereTxt();

  initScrollBarStyleSheet();

  return Object.freeze({
    get dropZone() { return programEditorDropZone },
    init() {
      programEditorDropZone.init();
    },
    load(mainEvent) {
      mainEventNameInput.value = mainEvent.name;
      mainEventDurationCmp.value = mainEvent.duration;

      markValid(mainEventNameInput);

      removeAllChildNodes(childEventsEditorCmp);
      let viewElements = ModelViewConverter.programToView(mainEvent, makeCmpDraggable);
      if (viewElements.length > 0) {
        viewElements.forEach(viewElement => childEventsEditorCmp.appendChild(viewElement));
        hideDragHereTxt();
      } else {
        showDragHereTxt();
      }
      setScrollbarWidth();
    },
    save() {
      console.log(mainEventDurationCmp);
      console.log(mainEventDurationCmp.value);
      return {
        name: mainEventNameInput.value,
        duration: mainEventDurationCmp.value,
        callback: sgong,
        children: ModelViewConverter.viewToProgram(childEventsEditorCmp.children)
      };
    },
    validate() {
      let invalidElem = TreeUtils.flatten(childEventsEditorCmp).find(elem => elem.dataset.valid === "false");
      return mainEventNameValidator.validate() && !invalidElem;
    }
  });

  function setScrollbarWidth() {
    if (childEventsEditorCmp.scrollHeight > childEventsEditorCmp.clientHeight) {
      setScrollbarStyles(10, 8);
    } else {
      removeScrollbarStyles();
    }
  }

  function makeEditorDropZone() {
    return makeDropZone(childEventsEditorCmp)
      .onDragEnter(draggable => {
        hideDragHereTxt();
        if (!showingPlaceholder) {
          setPlaceholderHeight(draggable.dragImage);
          showPlaceholder(draggable, childEventsEditorCmp);
        }
        setScrollbarWidth();
      })
      .onDragOver(draggable => {
        showPlaceholder(draggable, childEventsEditorCmp);
      })
      .onDragLeave(draggable => {
        removePlaceholder();
        if (childEventsEditorCmp.childElementCount == 0) {
          showDragHereTxt();
        }
        setScrollbarWidth();
      })
      .onDrop(draggable => {
        handleDrop(draggable);
        removePlaceholder();
      })
      .build();
  }

  function createDragHereTextCmp() {
    let wrapper = createElement("div", "program__drag_here_txt_wrapper");
    wrapper.appendChild(createElement("div", "program__drag_here_txt", "Drag items here to construct program"));
    return wrapper;
  }

  function createPlaceholder() {
    return createElement("div", `program__element program__element__placeholder`);
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

  function addTool(toolName) {
    let cmp = Tools.create(toolName);
    log({cmp});
    makeCmpDraggable(cmp);
    placeholder.parentNode.insertBefore(cmp.element, placeholder);
  }

  function makeCmpDraggable({element: elem, onDrag}) {
    makeDraggable(elem)
      .onDragStart((dragged, element) => {
        onDrag && onDrag(dragged);
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


const SCROLLBAR_STYLESHEET_ID = "scrollbarStyleSheet";

function initScrollBarStyleSheet() {
  let style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.setAttribute("id", SCROLLBAR_STYLESHEET_ID);
  document.head.appendChild(style);
}

function setScrollbarStyles(scrollBarWidth, mobileScrollBarMarginWidth) {
  let styleSheet = document.getElementById(SCROLLBAR_STYLESHEET_ID);
  styleSheet.innerHTML = `
    .program_events__children__editor::-webkit-scrollbar {
      width: ${scrollBarWidth}px;
    }

    @media(min-resolution: 200dpi) {
        .program__element {
            width: calc(100% - ${mobileScrollBarMarginWidth+1}rem);
            margin-right: ${mobileScrollBarMarginWidth}rem;
        }
    }
  `;
}

function removeScrollbarStyles() {
  let styleSheet = document.getElementById(SCROLLBAR_STYLESHEET_ID);
  styleSheet.innerHTML = ``;
}


export { inst, newMainEvent }