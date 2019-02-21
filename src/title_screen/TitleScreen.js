import './title_screen.css';

import initFavorites from './title_screen_favorites_component';

let titleScreen = document.getElementById("titleScreen");

initFavorites(document.querySelector(".title_screen__favorites"));

let screen = {
  title: function() {
    return `Timepp`;
  },
  cmp: titleScreen,
  onShow: function() {}
};
export { screen };