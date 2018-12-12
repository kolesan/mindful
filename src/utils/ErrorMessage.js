import { createElement, removeComponent, appendAsFirstChild } from "./HtmlUtils";
import { px } from "./Utils";

function inst(msg = "Error") {
  let errorMsg = createElement("div", "error_msg", msg);
  errorMsg.addEventListener("click", event => {
    // fade(0, 150, () => removeComponent(errorMsg));
  });
  return Object.freeze({
    showIn(parent, msg) {
      errorMsg.innerHTML = msg;
      appendAsFirstChild(errorMsg, parent);
      // fade(3000, 220, () => removeComponent(errorMsg));
    },
    showAt(x, y, w) {
      document.body.appendChild(errorMsg);
      errorMsg.style.position = "absolute";
      errorMsg.style.left = px(x);
      errorMsg.style.top = px(y);
      errorMsg.style.width = px(w);
      // fade(3000, 220, () => removeComponent(errorMsg));
    },
    hide() {
      removeComponent(errorMsg);
        // fade(0, 150, () => removeComponent(errorMsg));
    }
  });
}

export { inst };