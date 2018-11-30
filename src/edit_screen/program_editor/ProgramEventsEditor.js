import './program_events_editor.css';

import { makeDropZone } from "../dragndrop/DropZone";
import {createComponent, iconCmp, removeAllChildNodes, removeComponent} from "../../utils/HtmlUtils";
import { alphanumericValidation, markInvalid, markValid } from "../../Validation";
import * as InputValidator from "../../text_input/InputValidator";
import {formatTime, parseTime} from "../../utils/TimeUtils";
import {fgong, sgong} from "../../EventCallbacks";
import {Tools} from "../EditScreen";
import {makeDraggable} from "../dragndrop/Draggable";

const LOOP_ICON = "fas fa-undo-alt";
const EVENT_ICON = "fas fa-bell";

function inst(containerCmp) {
  let count = 1;
  let placeholder = null;
  let showingPlaceholder = false;
  let childEventsEditorCmp = containerCmp.querySelector(".program_events__children__editor");
  let headingSection = containerCmp.querySelector(".program_events__main");
  let mainEventDurationCmp = headingSection.querySelector("[name=mainEventDurationInput");
  let mainEventNameInput = headingSection.querySelector("[name=mainEventNameInput");
  InputValidator.inst(mainEventNameInput)
    .bindValidation(alphanumericValidation)
    .onFail(markInvalid)
    .onSuccess(markValid)
    .triggerOn("input");

  let dragHereCmp = dragHereHelpTextCmp();
  showDragHereTxt();

  let programEditorDropZone = makeDropZone(childEventsEditorCmp)
    .onDragEnter(draggable => {
      console.log("DragEnter");
      hideDragHereTxt();
      if (!showingPlaceholder) {
        placeholder = createPlaceholder(draggable.dragImage);
        showPlaceholder(draggable, childEventsEditorCmp);
        showingPlaceholder = true;
      }
    })
    .onDragOver(draggable => {
      console.log("DragOver");
      showPlaceholder(draggable, childEventsEditorCmp);
    })
    .onDragLeave(draggable => {
      console.log("DragLeave");
      removePlaceholder();
      showingPlaceholder = false;
      if (childEventsEditorCmp.childElementCount == 0) {
        showDragHereTxt();
      }
    })
    .onDrop(draggable => {
      console.log("Drop");
      handleDrop(draggable);
      removePlaceholder();
      hideDragHereTxt();
      showingPlaceholder = false;
    })
    .build();

  return Object.freeze({
    get dropZone() { return programEditorDropZone },
    init() {
      mainEventNameInput.value = "MainTimer";
      mainEventDurationCmp.value = formatTime(0);
      removeAllChildNodes(childEventsEditorCmp);

      programEditorDropZone.init();
      showDragHereTxt();
    },
    load(mainEvent) {
      mainEventNameInput.value = mainEvent.name;
      markValid(mainEventNameInput);

      mainEventDurationCmp.value = formatTime(mainEvent.duration);

      removeAllChildNodes(childEventsEditorCmp);
      let viewElements = generateChildViewElements(mainEvent);
      if (viewElements.length > 0) {
        viewElements.forEach(viewElement => childEventsEditorCmp.appendChild(viewElement));
        hideDragHereTxt();
      }
    },
    save() {
      return {
        name: mainEventNameInput.value,
        duration: parseTime(mainEventDurationCmp.value),
        callback: sgong,
        children: generateChildElements(childEventsEditorCmp.children)
      };
    }
  });

  function generateChildElements(viewChildren) {
    let viewElements = Array.from(viewChildren).filter(it => it.classList.contains("program__element"));
    let programElements = [];
    viewElements.forEach(viewElement => {
      console.log(viewElement);
      let tool = viewElement.dataset.element;
      let programElement = {element: tool};
      switch(tool) {
        case Tools.loop:
          let iterations = viewElement.querySelector("[name=iterationsInput").value;
          Object.assign(programElement, {iterations});
          break;
        case Tools.event:
          let name = viewElement.querySelector("[name=eventNameInput").value;
          let duration = parseTime(viewElement.querySelector("[name=eventDurationInput").value);
          Object.assign(programElement, {name, duration, callback: fgong});
          break;
      }
      programElement.children = generateChildElements(viewElement.children);
      console.log(programElement);
      programElements.push(programElement);
    });
    return programElements;
  }

  function generateChildViewElements(parent) {
    let elements = [];
    parent.children.forEach(programElement => {
      let viewElement = null;
      console.log(programElement);
      switch(programElement.element) {
        case Tools.event:
          viewElement = createEvent(programElement.name, formatTime(programElement.duration));
          break;
        case Tools.loop:
          viewElement = createLoop(programElement.iterations);
          break;
      }
      generateChildViewElements(programElement).forEach(it => viewElement.appendChild(it));
      elements.push(viewElement)
    });
    return elements;
  }

  function dragHereHelpTextCmp() {
    let wrapper = createComponent("div", "program__drag_here_txt_wrapper");
    wrapper.appendChild(createComponent("div", "program__drag_here_txt", "Drag items here to construct program"));
    return wrapper;
  }

  function createPlaceholder(draggable) {
    let placeholder = createComponent("div", `program__element program__element__placeholder`);
    placeholder.style.height = draggable.getBoundingClientRect().height + "px";
    return placeholder;
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
        return;
      }
    }
    parent.appendChild(placeholder);
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
      putElement(element);
    }
  }

  function addTool(tool) {
    let newElem;
    switch(tool) {
      case Tools.loop:
        newElem = createLoop();
        break;
      case Tools.event:
        newElem = createEvent();
        break;
    }
    placeholder.parentNode.insertBefore(newElem, placeholder);
  }

  function createLoop(iterations) {
    let loop = createElement(Tools.loop);
    loop.appendChild(loopHeadingCmp(iterations));
    loop.dataset.element = Tools.loop;
    return loop;
  }

  function createEvent(name, duration) {
    let event = createElement(Tools.event);
    event.appendChild(eventHeadingCmp(name, duration));
    event.dataset.element = Tools.event;
    return event;
  }

  function createElement(tool) {
    let elem = createComponent("div", `program__element program__element__${tool}`);

    makeDraggable(elem)
      .onDragStart((dragged, element) => {
        dragged.data.put("element", element);
        showPlaceholderInsteadOf(element);
        showingPlaceholder = true;
      })
      .bindDropZone(programEditorDropZone);

    return elem;
  }

  function loopHeadingCmp(iterations) {
    let heading = createComponent("div", "pel__heading");
    heading.appendChild(iconCmp(LOOP_ICON));
    heading.appendChild(loopIterationsInputCmp(iterations));
    return heading;
  }

  function loopIterationsInputCmp(iterations = 2) {
    let input = createComponent("input", "text_input peh__iterations_input");
    input.setAttribute("type", "number");
    input.setAttribute("name", "iterationsInput");
    input.value = iterations;
    input.addEventListener("mousedown", event => event.stopPropagation());

    let label = createComponent("label", "", "x");
    label.appendChild(input);
    return label;
  }

  function eventHeadingCmp(name, duration) {
    let heading = createComponent("div", "pee__heading");
    heading.appendChild(iconCmp(EVENT_ICON));
    heading.appendChild(nameInputCmp(name));
    heading.appendChild(durationInputCmp(duration));
    return heading;
  }

  function nameInputCmp(name = `Timer${count++}`) {
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

  function showPlaceholderInsteadOf(elem) {
    placeholder = createPlaceholder(elem);
    elem.parentNode.insertBefore(placeholder, elem);
    removeComponent(elem);
  }

  function putElement(element) {
    placeholder.parentNode.insertBefore(element, placeholder);
  }
}

export { inst }