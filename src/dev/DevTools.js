import './dev_tools.css';
import { createElement } from '../utils/HtmlUtils';
import { programs } from './TestData';
import * as TreeUtils from '../utils/TreeUtils';
import { toggleLogging, toggleTracing } from '../utils/Logging';
import { callbackDictionary } from '../EventCallbacks';

initDevTools();

function initDevTools() {
  let panel = createElement("div", ["dev_tools_panel"]);
  let loadStorageBtn = createElement("button", ["dtbtn"], "Load storage");
  loadStorageBtn.addEventListener("click", loadTestProgramsToStorage);
  let printStorageBtn = createElement("button", ["dtbtn"], "Print storage");
  printStorageBtn.addEventListener("click", printStoredPrograms);
  let clearStorageBtn = createElement("button", ["dtbtn"], "Clear storage");
  clearStorageBtn.addEventListener("click", clearTestProgramsFromStorage);
  let toggleLoggingBtn = createElement("button", ["dtbtn"], "Toggle logging");
  toggleLoggingBtn.addEventListener("click", toggleLogging);
  let toggleTracingBtn = createElement("button", ["dtbtn"], "Toggle tracing");
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