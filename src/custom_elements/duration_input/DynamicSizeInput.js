import { createElement } from "../../utils/HtmlUtils";
import { log } from "../../utils/Logging";

const MAX_SIZE_ATTR = "maxsize";
const TYPE_ATTR = "type";
const DEFAULT_SIZE = 20;
const DEFAULT_TYPE = "text";

export class DynamicSizeInput extends HTMLElement {
  constructor() {
    super();

    this.input = this.inputCmp();

    let shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(this.input);
    shadow.appendChild(style());
  }


  static get observedAttributes() {
    return [TYPE_ATTR];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name == TYPE_ATTR) {
      this.input.setAttribute(TYPE_ATTR, newValue);
    }
  }


  set value(v) {
    this.input.value = v;
    this.setSize(this.input);
  }

  get value() {
    return this.input.value;
  }


  inputCmp() {
    let input = createElement("input");
    input.addEventListener("input", event => this.setSize(input));
    return input;
  }

  setSize(input) {
    let v = input.value;
    if (this.type == "text") {
      input.setAttribute("size", Math.min(v.length, this.maxSize));
    } else {
      input.style.width = Math.min(v.length, this.maxSize) + 1 + "rem";
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