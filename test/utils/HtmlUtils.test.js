import { log } from "../TestUtils";
import * as HtmlUtils from '../../src/utils/HtmlUtils'

it('can create dom node from string', () => {
  let td = HtmlUtils.elementFromString("<td>a</td>");
  let img = HtmlUtils.elementFromString("<img alt='wat'/>");
  let text = HtmlUtils.elementFromString("ololo");

  expect(td.innerHTML).toEqual("a");
  expect(img.getAttribute("alt")).toEqual("wat");
  expect(text.wholeText).toEqual("ololo");
});