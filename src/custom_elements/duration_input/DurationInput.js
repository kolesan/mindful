import { log } from "../../utils/Logging";
import { createElement, element, text, disable, enable } from "../../utils/HtmlUtils";
import { h, m, s, timeObject, timestampToTimeObject } from "../../utils/TimeUtils";
import { DISABLED_ATTR } from "../../utils/AttributeConstants";
import { minmax, noop } from "../../utils/Utils";

const MAX_H = 23;
const MAX_M = 59;
const MAX_S = 59;
const MAX_T = h(MAX_H) + m(MAX_M) + s(MAX_S);

export class DurationInput extends HTMLElement {
  constructor() {
    super();

    this.minmax = minmax(0, MAX_T);
    this.h = this.createInnerInput(MAX_H, "h");
    this.m = this.createInnerInput(MAX_M, "m");
    this.s = this.createInnerInput(MAX_S, "s");
    this.onDurationChangeCb = noop;

    let shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(this.h);
    shadow.appendChild(this.m);
    shadow.appendChild(this.s);
    shadow.appendChild(style());

    this.addEventListener("blur", this.setInnerInputVisibility.bind(this));
    this.addEventListener("focus", this.showAllFields.bind(this));
  }

  onDurationChange(cb) {
    this.onDurationChangeCb = cb;
  }

  connectedCallback() {
    //This allows the parent element to receive focus
    this.setAttribute("tabindex", 0);
  }

  static get observedAttributes() {
    return [DISABLED_ATTR];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue == "true") {
      this.applyToInnerInputs(disable);
      this.title = "Can not set duration of an event that has children";
    } else {
      this.applyToInnerInputs(enable);
      this.title = "";
    }
  }

  applyToInnerInputs(fn) {
    fn(this.h);
    fn(this.m);
    fn(this.s);
  }

  set value(v) {
    let { h, m, s } = timestampToTimeObject(this.minmax(v));
    this.h.value = h;
    this.m.value = m;
    this.s.value = s;
    this.onDurationChangeCb();
    this.setInnerInputVisibility();
  }
  get value() {
    let h = this.h.value;
    let m = this.m.value;
    let s = this.s.value;
    return timeObject(h, m, s).timestamp;
  }

  showAllFields() {
    if (!this.disabled) {
      this.applyToInnerInputs(show);
    }
  }

  setInnerInputVisibility() {
    [this.s, this.m, this.h]
      .fnEach(input => input.value > 0 ? show(input) : hide(input))
      .fnFind(isVisible)
      .ifPresent(input => removeRightMargin(input))
      .ifEmpty(() => show(this.s));
  }

  createInnerInput(max, labelTxt) {
    let input = numberInput(max, labelTxt);
    input.onInput(() => this.onDurationChangeCb());
    return input;
  }

  get disabled() {
    let attr = this.getAttribute(DISABLED_ATTR);
    return attr == "true" || attr == "";
  }
}

function show(elem) {
  elem.classList.remove("hidden");
  elem.style.marginRight = "";
}
function hide(elem) {
  elem.classList.add("hidden");
}
function isVisible(elem) {
  return !elem.classList.contains("hidden");
}
function removeRightMargin(elem) {
  elem.style.marginRight = 0;
}

function numberInput(max, labelTxt) {
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
    ]
  });
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