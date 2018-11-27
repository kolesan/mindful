import './input_validator.css';

import { createComponent } from "../utils/HtmlUtils";
import * as ErrorMessage from "../utils/ErrorMessage";
import { fade, noop, px } from "../utils/Utils";
import * as log from "../utils/Logging";

function inst(input) {
  let validations = [];

  let errorContainer = createComponent("div", "text_input__error_container");
  document.querySelector("body").appendChild(errorContainer);
  let onFail = noop;
  let onSuccess = noop;

  input.addEventListener("focus", showContainer);
  input.addEventListener("blur", hideContainer);

  return Object.freeze({
    validate() {
      let valid = true;
      positionErrorContainer(input);
      validations.forEach(validation => {
        let result = validation.validate(input.value);
        if (!result.valid) {
          validation.msg.showIn(errorContainer, result.msg);
          valid = false;
        } else {
          validation.msg.hide();
        }
      });
      if (valid) {
        onSuccess(input);
      } else {
        onFail(input);
      }
    },
    bindValidation(validation) {
      validations.push({validate: validation.validate, msg: ErrorMessage.inst()});
      return this;
    },
    onFail(fn) {
      onFail = fn;
      return this;
    },
    onSuccess(fn) {
      onSuccess = fn;
      return this;
    },
    triggerOn(eventName) {
      input.addEventListener(eventName, this.validate);
      return this;
    }
  });

  function showContainer() {
    fade(errorContainer, 0, 1, 0, 150, "ease-out");
  }

  function hideContainer() {
    fade(errorContainer, 1, 0, 0, 150, "ease-in");
  }

  function positionErrorContainer() {
    let rect = input.getBoundingClientRect();
    errorContainer.style.left = px(rect.left);
    errorContainer.style.top = px(rect.bottom + 3);
    errorContainer.style.width = px(rect.width);
  }

}

function validationWithStaticErrorMessage(fn, msg) {
  return Object.freeze({
    validate(val) {
      if (fn(val)) {
        return {valid: true}
      } else {
        return {valid: false, msg}
      }
    }
  });
}

export { inst, validationWithStaticErrorMessage }