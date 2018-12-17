import { DurationInput } from "./duration_input/DurationInput";
import { DynamicSizeInput } from "./duration_input/DynamicSizeInput";

const CustomElements = {
  durationInput: "duration-input",
  dynamicSizeInput: "dynamic-size-input"
};

customElements.define(CustomElements.durationInput, DurationInput);
customElements.define(CustomElements.dynamicSizeInput, DynamicSizeInput);

export { CustomElements }