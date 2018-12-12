import * as InputValidator from "./text_input/InputValidator";

export let alphanumericValidation = InputValidator.validationWithStaticErrorMessage(
  validString, "Only alphanumeric characters, spaces, dashes, underscores, slashes and curly brackets allowed"
);
export let emptyStringValidation = InputValidator.validationWithStaticErrorMessage(
  notEmpty, "Program title is required"
);

function validString(s) {
  return /^[a-zA-Z0-9-_{}\ /]*$/.test(s);
}

export function notEmpty(s) {
  return !/^\s*$/.test(s);
}

export function markInvalid(input) {
  input.dataset.valid = false;
  input.style.borderBottomColor = "red";
}
export function markValid(input) {
  input.dataset.valid = true;
  input.style.borderBottomColor = "";
}

