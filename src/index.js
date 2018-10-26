import './style.css';
import * as TimerModule from './TimerToDisplayBinder';
import { mainEvent as testData } from './TestDataPreload';

let timerModule = TimerModule.newInstance(testData, document.querySelector(".timer"));

function parseTime(timeString) {
  let timeArray = timeString.split(":");
  let h = Number(timeArray[0]) || 0;
  let m = Number(timeArray[1]) || 0;
  let s = Number(timeArray[2]) || 0;
  return h*1000*60*60 + m*1000*60 + s*1000;
}

export { timerModule };
