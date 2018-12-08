import './dev_tools.css';
import { createComponent } from '../utils/HtmlUtils';
import { programs } from './TestData';
import * as TreeUtils from '../utils/TreeUtils';
import { toggleLogging, toggleTracing } from '../utils/Logging';
import { callbackDictionary } from '../EventCallbacks';

initDevTools();

function initDevTools() {
  let panel = createComponent("div", ["dev_tools_panel"]);
  let loadStorageBtn = createComponent("button", ["dtbtn"], "Load storage");
  loadStorageBtn.addEventListener("click", loadTestProgramsToStorage);
  let printStorageBtn = createComponent("button", ["dtbtn"], "Print storage");
  printStorageBtn.addEventListener("click", printStoredPrograms);
  let clearStorageBtn = createComponent("button", ["dtbtn"], "Clear storage");
  clearStorageBtn.addEventListener("click", clearTestProgramsFromStorage);
  let toggleLoggingBtn = createComponent("button", ["dtbtn"], "Toggle logging");
  toggleLoggingBtn.addEventListener("click", toggleLogging);
  let toggleTracingBtn = createComponent("button", ["dtbtn"], "Toggle tracing");
  toggleTracingBtn.addEventListener("click", toggleTracing);
  panel.appendChild(loadStorageBtn);
  panel.appendChild(printStorageBtn);
  panel.appendChild(clearStorageBtn);
  panel.appendChild(toggleLoggingBtn);
  panel.appendChild(toggleTracingBtn);
  document.body.appendChild(panel)
}

function loadTestProgramsToStorage() {
  window.localStorage.setItem("programs", JSON.stringify(programs));
}

function printStoredPrograms() {
  console.log(...JSON.parse(window.localStorage.getItem("programs")));
}

function clearTestProgramsFromStorage() {
  window.localStorage.removeItem("programs");
}