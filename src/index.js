import './style.css';
import * as TimerModule from './TimerToDisplayBinder';
import { mainEvent as testData } from './TestDataPreload';

let timerModule = TimerModule.newInstance(testData, document.querySelector(".timer"));

export { timerModule };
