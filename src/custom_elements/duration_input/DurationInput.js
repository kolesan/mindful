import { createElement, element, text } from "../../utils/HtmlUtils";
import { timeObject, timestampToTimeObject } from "../../utils/TimeUtils";
import * as Utils from "../../utils/Utils";
import { log } from "../../utils/Logging";
import { DISABLED_ATTR } from "../../utils/AttributeConstants";

export class DurationInput extends HTMLElement {
  constructor() {
    super();

    this.h = numberInput(24, "h");
    this.m = numberInput(60, "m");
    this.s = numberInput(60, "s");

    let shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(this.h.input);
    shadow.appendChild(this.m.input);
    shadow.appendChild(this.s.input);
    shadow.appendChild(style());

    this.addEventListener("blur", this.hideAllEmptyFieldsLeaveSecondsIfZero.bind(this));
    this.addEventListener("focus", this.showAllFields.bind(this));
    log("FINISHED CONSTRUCTION OF DURATION INPUT");
  }

  connectedCallback() {
    if (!(this.getAttribute(DISABLED_ATTR) == "true")) {
      this.title = "Event duration";
    }
  }


  static get observedAttributes() {
    return [DISABLED_ATTR];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue == "true") {
      log("DISABLED THE DURATION INPUT DUE TO ATTRIBUTE CHANGE");
      this.applyToAll(this.disable);
      this.title = "Can not set duration of event that has children";
    } else {
      this.applyToAll(this.enable);
      this.title = "Event duration";
    }
  }

  applyToAll(fn) {
    fn(this.h.input);
    fn(this.m.input);
    fn(this.s.input);
  }
  disable(elem) {
    elem.setAttribute("disabled", "true");
  }
  enable(elem) {
    elem.removeAttribute("disabled");
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
    this.applyToAll(this.show);
  }

  hideAllEmptyFieldsLeaveSecondsIfZero() {
    let hoursHidden = this.hideEmpty(this.h);
    let minutesHidden = this.hideEmpty(this.m);
    let secondsHidden = false;
    if (!hoursHidden || !minutesHidden) {
      secondsHidden = this.hideEmpty(this.s);
    }

    if (hoursHidden && secondsHidden) {
      this.removeMargin(this.m.input);
    } else if (minutesHidden && secondsHidden) {
      this.removeMargin(this.h.input);
    }
  }

  removeMargin(input) {
    input.style.marginRight = 0;
  }

  hideEmpty({input, value}) {
    //Implicit coercion needed here because value will sometimes be string and sometimes number
    let empty = value == 0;
    if (empty) {
      this.hide(input);
    } else {
      this.show(input);
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
  let minmax = Utils.minmax(0, max);

  return Object.freeze({
    get input() { return input },
    get value() { return input.value },
    set value(v) { setInputValue(v) }
  });

  function createInput(max) {

    let label = element({
      tag: "span",
      attributes: {
        slot: "right"
      },
      children: [text(labelTxt)]
    });

    return element({
      tag: "dynamic-size-input",
      classes: "text_input input_section",
      value: 0,
      attributes: {
        type: "number",
        maxsize: 4,
        min: 0,
        max: max
      },
      children: [
        label
      ],
      listeners: {
        input: event => setInputValue(event.target.value)
      }
    });
  }

  function setInputValue(value) {
    let v = Number(value) || 0;
    input.value = String(minmax(v));
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
    }`
  )
}