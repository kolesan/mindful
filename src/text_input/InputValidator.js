import './input_validator.css';

import {createElement, removeComponent} from "../utils/HtmlUtils";
import * as ErrorMessage from "../utils/ErrorMessage";
import { fade, noop, px } from "../utils/Utils";
import * as log from "../utils/Logging";

function inst(input) {
  let validations = [];

  let errorContainer = createElement("div", "text_input__error_container");
  let showingContainer = false;

  let onFailCb = noop;
  let onSuccessCb = noop;

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
        hideContainer();
        onSuccessCb(input);
      } else {
        showContainer();
        onFailCb(input);
      }
      return valid;
    },
    bindValidation(validation) {
      validations.push({validate: validation.validate, msg: ErrorMessage.inst()});
      return this;
    },
    onFail(fn) {
      onFailCb = fn;
      return this;
    },
    onSuccess(fn) {
      onSuccessCb = fn;
      return this;
    },
    triggerOn(eventName) {
      input.addEventListener(eventName, this.validate);
      return this;
    },
    hideErrors() {
      hideContainer();
    }
  });

  function showContainer() {
    if (!showingContainer && errorContainer.childElementCount > 0) {
      appendContainer();
      fade({cmp: errorContainer, from: 0, to: 1, duration: 150, easing: "ease-out"});
      showingContainer = true;
    }
  }

  function hideContainer() {
    if (showingContainer) {
      fade({
        cmp: errorContainer,
        from: 1, to: 0,
        duration: 150, easing: "ease-in",
        onFinish: cmp => removeComponent(cmp)
      });
      showingContainer = false;
    }
  }

  function appendContainer() {
    document.body.appendChild(errorContainer);
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