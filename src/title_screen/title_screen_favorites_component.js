import './title_screen_favorites_component.css';

import favorites from '../favorites/favorites';
import programsStorage from "../storage/programs_storage/ProgramsStorage";
import { element, iconElem } from "../utils/HtmlUtils";
import * as Routing from "../Routing";

export default function initFavorites(container) {
  let title = element({
    tag: "div",
    classes: "title_screen__favorites__title",
    text: "Your most used programs are"
  });
  let buttonContainer = element({
    tag: "div",
    classes: "title_screen__favorites__programs"
  });

  container.appendChild(title);
  container.appendChild(buttonContainer);

  favorites(programsStorage.loadAll(), 5)
    .forEach(program =>
      buttonContainer.appendChild(favoriteProgramButton(program))
    );
}

function favoriteProgramButton(program) {
  return element({
    tag: "button",
    classes: "title_screen__favorites__programs__button",
    children: [
      iconElem(program.icon),
      element({
        tag: "span",
        text: program.title
      })
    ],
    listeners: {
      click: () => Routing.toTimerScreen(program)
    }
  });
}
