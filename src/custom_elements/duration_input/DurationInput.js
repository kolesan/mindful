import { createElement } from "../../utils/HtmlUtils";
import { timeObject, timestampToTimeObject } from "../../utils/TimeUtils";
import * as Utils from "../../utils/Utils";
import { log } from "../../utils/Logging";

export class DurationInput extends HTMLElement {
  constructor() {
    super();

    this.h = numberInput(24, "h")
      .onBlur(this.hideAllEmptyFieldsLeaveSecondsIfZero.bind(this))
      .onFocus(this.showAllOtherFields.bind(this));

    this.m = numberInput(60, "m")
      .onBlur(this.hideAllEmptyFieldsLeaveSecondsIfZero.bind(this))
      .onFocus(this.showAllOtherFields.bind(this));

    this.s = numberInput(60, "s")
      .onBlur(this.hideAllEmptyFieldsLeaveSecondsIfZero.bind(this))
      .onFocus(this.showAllOtherFields.bind(this));

    let shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(this.h.elem);
    shadow.appendChild(this.m.elem);
    shadow.appendChild(this.s.elem);
    shadow.appendChild(style());
  }

  set value(v) {
    console.log("SETTING DURATION VALUE", v);
    let { h, m, s } = timestampToTimeObject(v);
    this.h.value = h;
    this.m.value = m;
    this.s.value = s;
    this.hideAllEmptyFieldsLeaveSecondsIfZero();
  }

  get value() {
    let h = this.h.value;
    let m = this.m.value;
    let s = this.s.value;
    return timeObject(h, m, s).timestamp;
  }

  showAllOtherFields() {
    this.show(this.h.elem);
    this.show(this.m.elem);
    this.show(this.s.elem);
  }

  hideAllEmptyFieldsLeaveSecondsIfZero() {
    let hoursHidden = this.hideEmpty(this.h);
    let minutesHidden = this.hideEmpty(this.m);
    if (!hoursHidden || !minutesHidden) {
      this.hideEmpty(this.s);
    }
  }

  hideEmpty({elem, value}) {
    let empty = value == 0;
    //Implicit coercion needed here
    if (empty) {
      this.hide(elem);
    } else {
      this.show(elem);
    }
    return empty;
  }

  show(elem) {
    elem.classList.remove("hidden");
  }

  hide(elem) {
    setTimeout(() => !this.focusWithin() && elem.classList.add("hidden"), 10);
  }

  focusWithin() {
    return document.activeElement.isSameNode(this);
  }
}

function numberInput(max, labelTxt) {
  let input = createInput(max);
  let section = createElement("label", "input_section", [input, createText(labelTxt)]);
  let minmax = Utils.minmax(0, max);
  let onInputCb = Utils.noop;
  let onBlurCb = Utils.noop;
  let onFocusCb = Utils.noop;

  return Object.freeze({
    onInput(cb) { onInputCb = cb; return this; },
    onBlur(cb) { onBlurCb = cb; return this; },
    onFocus(cb) { onFocusCb = cb; return this; },
    get elem() { return section },
    get input() { return input },
    get value() { return input.value },
    set value(v) { setInputValue(v) }
  });

  function createInput(max) {
    let input = createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("min", 0);
    input.setAttribute("max", max);
    input.value = 0;

    input.addEventListener("input", event => setInputValue(event.target.value));
    input.addEventListener("blur", event => onBlurCb(section, event.target.value));
    input.addEventListener("focus", event => onFocusCb(section, event.target.value));

    return input;
  }

  function createText(t) {
    return document.createTextNode(t);
  }

  function setInputValue(value) {
    let v = Number(value) || 0;
    input.value = String(minmax(v)).padStart(2, "0");
    onInputCb(section, value);
  }
}

function style() {
  return createElement("style", "", `
    .hidden {
        display: none;
    }
    
    .input_section {
        margin-right: 0.7rem;
    }
    .input_section:last-of-type {
        margin-right: 0rem;
    }
    
    input {
        font-family: var(--font-family);
        font-size: var(--font-size);
        color: var(--font-color);
        background: transparent;
        border: none;
        /*border-bottom: 2px solid gray;*/
    
        outline: none;
    
        height: 100%;
        // text-align: end;
        
         -webkit-appearance: none;
        /*margin-right: -16px;*/
        width: calc(2rem);
    }
    
    input::-webkit-inner-spin-button {
        display: none;
    }`
  )
}