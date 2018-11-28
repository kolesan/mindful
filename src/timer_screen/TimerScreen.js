import './timer_screen.css';

import './TimerDisplayControls';
import './seeking/TouchSeeking';
import './seeking/MouseSeeking';
import { loadProgramById, loadDefaultProgram } from '../TestDataPreload';

function onShow(id) {
  if (id) {
    loadProgramById(id);
  } else {
    loadDefaultProgram();
  }
}

export { onShow };