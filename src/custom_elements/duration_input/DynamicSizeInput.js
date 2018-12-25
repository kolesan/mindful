import { createElement, element } from "../../utils/HtmlUtils";
import { DISABLED_ATTR, MAX_ATTR, MIN_ATTR, PLACEHOLDER_ATTR, TYPE_ATTR } from "../../utils/AttributeConstants";
import { log } from "../../utils/Logging";
import { minmax, noop } from "../../utils/Utils";

const MAX_SIZE_ATTR = "maxsize";
const MIN_SIZE_ATTR = "minsize";

const DEFAULT_MAX_SIZE = 20;
const DEFAULT_MIN_SIZE = 5;
const DEFAULT_TYPE = "text";

export class DynamicSizeInput extends HTMLElement {
  constructor() {
    super();

    this.input = this.inputCmp();
    this.onInputCb = noop;

    let shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(
      element({
        tag: "label",
        children: [
          slot("left"),
          this.input,
          slot("right")
        ]
      })
    );
    shadow.appendChild(style());
  }

  onInput(cb) {
    this.onInputCb = cb;
  }

  static get observedAttributes() {
    return [TYPE_ATTR, MIN_ATTR, MAX_ATTR, DISABLED_ATTR, PLACEHOLDER_ATTR];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue == null) {
      this.input.removeAttribute(name);
    } else {
      this.input.setAttribute(name, newValue);
    }
  }


  set value(v) {
    this.input.value = v;
    // log("Setting value to dynamic size input", this.input);
    if (this.type == "number") {
      this.minmaxValue(this.input);
    }
    this.setSize(this.input);
  }

  get value() {
    return this.input.value;
  }


  inputCmp() {
    return element({
      tag: "input",
      listeners: {
        input: event => {
          // log("Dynamic size input listener triggered");
          if (this.type == "number") {
            this.minmaxValue(event.target);
          }
          this.setSize(event.target);
          this.onInputCb();
        }
      }
    });
  }

  minmaxValue(input) {
    input.value = String(minmax(this.minValue, this.maxValue)(Number(input.value) || 0));
  }

  setSize(input) {
    let v = input.value;
    if (this.type == "text") {
      input.setAttribute("size", this.minMaxSize(v));
    } else {
      input.style.width = this.minMaxSize(v) + 0.3 + "rem";
    }
  }

  minMaxSize(v) {
    return minmax(this.minSize, this.maxSize)(v.length)
  }

  get maxSize() {
    return this.getAttribute(MAX_SIZE_ATTR) || DEFAULT_MAX_SIZE;
  }
  get minSize() {
    return this.getAttribute(MIN_SIZE_ATTR) || DEFAULT_MIN_SIZE;
  }

  get maxValue() {
    return this.getAttribute(MAX_ATTR);
  }
  get minValue() {
    return this.getAttribute(MIN_ATTR);
  }

  get type() {
    return this.getAttribute(TYPE_ATTR) || DEFAULT_TYPE;
  }
}

function slot(name) {
  return element({
    tag: "slot",
    attributes: { name }
  })
}

function style() {
  return createElement("style", "", `
    input {
        font-family: var(--font-family);
        font-size: var(--font-size);
        color: var(--font-color);
        background: transparent;
        border: none;
    
        outline: none;
    
        height: 100%;
        
        text-align: var(--text-align);
    }
    
    input::-webkit-inner-spin-button {
        display: none;
    }
  `);
}