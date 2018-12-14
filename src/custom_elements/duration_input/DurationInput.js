import { createElement } from "../../utils/HtmlUtils";
import { timeObject, timestampToTimeObject } from "../../utils/TimeUtils";
import * as Utils from "../../utils/Utils";
import { log } from "../../utils/Logging";

export class DurationInput extends HTMLElement {
  constructor() {
    super();

    this.h = numberInput(24, "h");
    this.m = numberInput(60, "m");
    this.s = numberInput(60, "s");

    let shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(this.h.elem);
    shadow.appendChild(this.m.elem);
    shadow.appendChild(this.s.elem);
    shadow.appendChild(style());

    this.addEventListener("blur", this.hideAllEmptyFieldsLeaveSecondsIfZero.bind(this));
    this.addEventListener("focus", this.showAllFields.bind(this));
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

  showAllFields() {
    this.show(this.h.elem);
    this.show(this.m.elem);
    this.show(this.s.elem);
  }

  hideAllEmptyFieldsLeaveSecondsIfZero() {
    let hoursHidden = this.hideEmpty(this.h);
    let minutesHidden = this.hideEmpty(this.m);
    let secondsHidden = false;
    if (!hoursHidden || !minutesHidden) {
      secondsHidden = this.hideEmpty(this.s);
    }

    if (hoursHidden && secondsHidden) {
      this.removeMargin(this.m);
    } else if (minutesHidden && secondsHidden) {
      this.removeMargin(this.h);
    }
  }

  removeMargin(input) {
    input.elem.style.marginRight = 0;
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
    elem.style.marginRight = "";
  }

  hide(elem) {
    elem.classList.add("hidden");
  }
}

function numberInput(max, labelTxt) {
  let input = createInput(max);
  let section = createElement("label", "input_section", [input, createText(labelTxt)]);
  let minmax = Utils.minmax(0, max);

  return Object.freeze({
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
    input.value = "00";

    input.addEventListener("input", event => setInputValue(event.target.value));

    return input;
  }

  function createText(t) {
    return document.createTextNode(t);
  }

  function setInputValue(value) {
    let v = Number(value) || 0;
    input.value = String(minmax(v)).padStart(2, "0");
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
    
        outline: none;
    
        height: 100%;
        width: 2rem;
    }
    
    input::-webkit-inner-spin-button {
        display: none;
    }`
  )
}