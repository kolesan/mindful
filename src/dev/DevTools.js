import './dev_tools.css';
import { createElement } from '../utils/HtmlUtils';
import { programs } from './TestData';
import { toggleLogging, toggleTracing } from '../utils/Logging';

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
  let clearSettingsBtn = createElement("button", ["dtbtn"], "Clear settings");
  clearSettingsBtn.addEventListener("click", clearSettingsFromStorage);
  panel.appendChild(loadStorageBtn);
  panel.appendChild(printStorageBtn);
  panel.appendChild(clearStorageBtn);
  panel.appendChild(toggleLoggingBtn);
  panel.appendChild(toggleTracingBtn);
  panel.appendChild(clearSettingsBtn);
  document.body.appendChild(panel)
}

function clearSettingsFromStorage() {
  localStorage.removeItem("settings");
}

function loadTestProgramsToStorage() {
  localStorage.setItem("programs", JSON.stringify(programs));
}

function printStoredPrograms() {
  console.log(...JSON.parse(window.localStorage.getItem("programs")));
}

function clearTestProgramsFromStorage() {
  window.localStorage.removeItem("programs");
}

export { loadTestProgramsToStorage };