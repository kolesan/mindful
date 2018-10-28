import './style.css';
import * as TimerModule from './TimerToDisplayBinder';
import { mainEvent as testData } from './TestDataPreload';

let program;

function loadProgram() {
  program = testData;
}

loadProgram();

let timerModule = TimerModule.newInstance(program, document.querySelector(".timer"));

export { timerModule };
