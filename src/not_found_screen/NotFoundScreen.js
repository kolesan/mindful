import { createElement } from "../utils/HtmlUtils";

let notFoundScreen = createElement("section", "not_found_screen hidden", `
    <section class="title section">
      <button name="menuBtn" class="icon-button" title="Menu"><i class="fas fa-bars"></i></button>
      <span class="">¯\\_(ツ)_/¯</span>
      <div></div>
    </section>
    <section class="not_found_screen__msg">
        Application for custom timer creation
    </section>
`);

let screen = {
  title: function() {
    return `Not Found`;
  },
  cmp: notFoundScreen,
  onShow: function(msg) {
    notFoundScreen.querySelector(".not_found_screen__msg").innerHTML = msg;
  }
};

document.body.querySelector(".main_screen").appendChild(notFoundScreen);
export { screen };