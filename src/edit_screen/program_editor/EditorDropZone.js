import { makeDropZone } from "../dragndrop/DropZone";
import { createElement, removeChildNodes, removeComponent } from "../../utils/HtmlUtils";
import { Tools } from "../tools/Tools";
import { makeDraggable } from "../dragndrop/Draggable";
import ToolNames from "../tools/ToolNames";
import { fade } from "../../utils/Utils";
import { editorComponentsConverter } from "../../program_model_converters/Converters"
import * as TreeUtils from '../../utils/TreeUtils';

export default function inst({container, dropCb}) {
  let showingPlaceholder = false;
  let placeholder = createPlaceholder();
  let dragHereCmp = createDragHereTextCmp();
  let copyMode = false;
  showDragHereTxt();
  initScrollBarStyleSheet();

  let zone = makeDropZone(container)
    .onDragEnter(draggable => {
      if (!showingPlaceholder) {
        showPlaceholder(draggable, container);
      }
      hideRemovalMark(draggable);
      hideDragHereTxt();
      setScrollbarWidth();
    })
    .onDragOver(draggable => {
      showPlaceholder(draggable, container);
    })
    .onDragLeave(draggable => {
      removePlaceholder();
      showRemovalMark(draggable);
      if (container.childElementCount == 0) {
        showDragHereTxt();
      }
      setScrollbarWidth();
    })
    .onDrop(draggable => {
      let element = droppedElement(draggable);

      let parent = placeholder.parentNode;
      parent.insertBefore(element, placeholder);
      removePlaceholder();

      dropCb(element);
      setScrollbarWidth();
    })
    .build();

  return Object.freeze({
    zone,
    getCopyMode() {
      return copyMode;
    },
    setCopyMode(v) {
      copyMode = v;
    },
    load(programElements) {
      removeChildNodes(container, it => it.dataset.element);
      if (programElements.length > 0) {
        hideDragHereTxt();
      } else {
        showDragHereTxt();
      }
      setScrollbarWidth();

      programElements.reduce(
        (container, programElement) => {
          const editorComponent = editorComponentsConverter.serialize(programElement);
          TreeUtils.visit(editorComponent, cmp => makeCmpDraggable(cmp));
          container.appendChild(editorComponent.element);
          return container;
        },
        container
      );
    }
  });

  function showPlaceholderInsteadOf(elem) {
    elem.parentNode.insertBefore(placeholder, elem);
    removeComponent(elem);
    showingPlaceholder = true;
  }

  function showPlaceholder(draggable, parent) {
    for(let child of parent.children) {
      if (!child.classList.contains("program__element") || child.classList.contains("program__element__placeholder")) {
        continue;
      }
      if (draggable.image.centerIsInside(child, -5)) {
        showPlaceholder(draggable, child);
        return;
      }
      if (draggable.image.centerIsAbove(child)) {
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

  function droppedElement(draggable) {
    let toolName = draggable.data.get("tool");
    let element = null;

    if (toolName) {
      element = newProgramElement(toolName);
    } else if (copyMode) {
      let componentCopy = Tools.fromElement(draggable.data.get("programElementComponent").element, makeCmpDraggable);
      element = componentCopy.element;
    } else {
      element = draggable.data.get("programElementComponent").element;
    }

    if (!element) {
      throw new Error(`Can not drop unknown element '${element}'`);
    }

    return element;
  }
  function newProgramElement(toolName) {
    let toolComponent = Tools.create(toolName);
    makeCmpDraggable(toolComponent);
    return toolComponent.element;
  }
  function makeCmpDraggable(cmp) {
    let { element, onDrag } = cmp;
    makeDraggable(element, element.querySelector("[name=dragAnchor]"))
      .onDragStart((draggable, element) => {
        leaveOnlyHeadingVisible(draggable.image.node);
        draggable.image.recalculateBoundingRectangle();
        onDrag && onDrag(draggable);
        draggable.data.set("programElementComponent", cmp);
        if (copyMode) {
          showPlaceholder(draggable, element.parentNode);
        } else {
          showPlaceholderInsteadOf(element);
        }
      })
      .bindDropZone(zone)
      .allowTouch();
  }

  function hideDragHereTxt() {
    removeComponent(dragHereCmp);
  }

  function showDragHereTxt() {
    if (!dragHereCmp.parentNode) {
      container.appendChild(dragHereCmp);
    }
  }

  function setScrollbarWidth() {
    if (container.scrollHeight > container.clientHeight) {
      setScrollbarStyles(10);
    } else {
      removeScrollbarStyles();
    }
  }
}

function createDragHereTextCmp() {
  let wrapper = createElement("div", "program__drag_here_txt_wrapper");
  wrapper.appendChild(createElement("div", "program__drag_here_txt", "Drag items here to construct a program"));
  return wrapper;
}

function leaveOnlyHeadingVisible(elem) {
  Array.from(elem.children).forEach(child => {
    if (!child.classList.contains("pe__heading")) {
      child.style.display = "none";
    }
  })
}

function createPlaceholder() {
  let placeholderElement = Tools.create(ToolNames.event).element;
  placeholderElement.classList.add("program__element__placeholder");
  /*
   TODO this should not be needed when implementation of duration recalculation is finished properly
   this is done so that placeholder is not detected as a program element (e.g. not to mess with duration calculation)
   */
  placeholderElement.dataset.element = "";
  return placeholderElement;
}

function hideRemovalMark(draggable) {
  let overlay = draggable.image.node.querySelector(".program__element__removal_overlay");
  if (overlay) {
    fade({cmp: overlay, from: 1, to: 0, duration: 150, onFinish: cmp => removeComponent(cmp)});
  }
  draggable.image.node.classList.remove("program__element__removal_mark");
}
function showRemovalMark(draggable) {
  let notATool = !draggable.data.get("tool");
  if (notATool) {
    let overlay = createElement("div", "program__element__removal_overlay", "Remove");
    fade({cmp: overlay, from: 0, to: 1, duration: 150});
    draggable.image.node.appendChild(overlay);
    draggable.image.node.classList.add("program__element__removal_mark");
  }
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