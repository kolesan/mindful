import { createElement, element } from "../../utils/HtmlUtils";
import { log } from "../../utils/Logging";

const MAX_SIZE_ATTR = "maxsize";
const TYPE_ATTR = "type";
const MIN_ATTR = "min";
const MAX_ATTR = "max";

const DEFAULT_SIZE = 20;
const DEFAULT_TYPE = "text";

export class DynamicSizeInput extends HTMLElement {
  constructor() {
    super();

    this.input = this.inputCmp();

    let shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(
      element({
        tag: "label",
        children: [
          this.slot("left"),
          this.input,
          this.slot("right")
        ]
      })
    );
    shadow.appendChild(style());
  }

  slot(name) {
    return element({
      tag: "slot",
      attributes: { name }
    })
  }

  static get observedAttributes() {
    return [TYPE_ATTR, MIN_ATTR, MAX_ATTR];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this.input.setAttribute(name, newValue);
  }


  set value(v) {
    this.input.value = v;
    this.setSize(this.input);
  }

  get value() {
    return this.input.value;
  }


  inputCmp() {
    return element({
      tag: "input",
      listeners: {
        input: event => this.setSize(event.target)
      }
    });
  }

  setSize(input) {
    let v = input.value;
    if (this.type == "text") {
      input.setAttribute("size", Math.min(v.length, this.maxSize));
    } else {
      input.style.width = Math.min(v.length, this.maxSize) + 0.2 + "rem";
    }
  }

  get maxSize() {
    return this.getAttribute(MAX_SIZE_ATTR) || DEFAULT_SIZE;
  }

  get type() {
    return this.getAttribute(TYPE_ATTR) || DEFAULT_TYPE;
  }
}

function style() {
  return createElement("style", "", `
    input {
        font-family: var(--font-family);
        font-size: var(--font-size);
        color: var(--font-color);
        background: transparent;
        border: none;
        
        text-align: center;
    
        outline: none;
    
        height: 100%;
    }
    
    input::-webkit-inner-spin-button {
        display: none;
    }
  `);
}