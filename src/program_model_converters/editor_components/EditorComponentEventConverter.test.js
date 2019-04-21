import converter from './EditorComponentEventConverter';
import programEvent from '../../program_model/ProgramEvent';
import ToolNames from "../../edit_screen/tools/ToolNames";

it(`converts event`, () => {
  let event = programEvent({
    name: "MyEvent",
    duration: 10
  });

  let serializedEvent = converter.serialize(event);

  expect(serializedEvent.dataset.element).toEqual(ToolNames.event);
});