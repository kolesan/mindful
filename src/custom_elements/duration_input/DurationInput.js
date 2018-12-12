import { createElement } from "../../utils/HtmlUtils";
import { timeObject, timestampToTimeObject } from "../../utils/TimeUtils";

export class DurationInput extends HTMLElement {
  constructor() {
    super();

    this.hInput = numberInput(24);
    this.mInput = numberInput(60);
    this.sInput = numberInput(60);

    let shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(this.hInput);
    shadow.appendChild(semicolon());
    shadow.appendChild(this.mInput);
    shadow.appendChild(semicolon());
    shadow.appendChild(this.sInput);
    shadow.appendChild(style());
  }

  set value(v) {
    console.log("SETTING DURATION VALUE", v);
    let { h, m, s } = timestampToTimeObject(v);
    this.hInput.value = h;
    this.mInput.value = m;
    this.sInput.value = s;
  }

  get value() {
    let h = this.hInput.value;
    let m = this.mInput.value;
    let s = this.sInput.value;

    return timeObject(h, m, s).timestamp;
  }
}

function semicolon() {
  return document.createTextNode(":");
}
function numberInput(max) {
  let input = createElement("input");
  input.setAttribute("type", "number");
  input.setAttribute("min", 0);
  input.setAttribute("max", max);
  input.value = 0;

  input.addEventListener("input", event => {
    let v = Number(event.target.value);
    if (!v) {
      input.value = 0;
    } else if (v < 0) {
      input.value = 0;
    } else if (v > max) {
      input.value = max;
    } else {
      //To remove leading zeroes
      input.value = v;
    }
  });

  return input;
}
function style() {
  return createElement("style", "", `
    input {
        font-family: var(--font-family);
        font-size: var(--font-size);
        color: var(--font-color);
        background: transparent;
        border: none;
        /*border-bottom: 2px solid gray;*/
    
        outline: none;
    
        height: 100%;
    }`
  )
}