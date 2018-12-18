import { DurationInput } from "./duration_input/DurationInput";
import { DynamicSizeInput } from "./duration_input/DynamicSizeInput";

const CustomElements = {
  dynamicSizeInput: "dynamic-size-input",
  durationInput: "duration-input"
};

customElements.define(CustomElements.dynamicSizeInput, DynamicSizeInput);
customElements.define(CustomElements.durationInput, DurationInput);

export { CustomElements }