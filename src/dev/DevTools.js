import './devTools.css';
import * as utils from '../Utils';
import { programs } from './TestData';
import * as TreeUtils from '../TreeUtils';
import { toggleLogging, toggleTracing } from '../Logging';

initDevTools();

function initDevTools() {
  let panel = utils.createComponent("div", ["dev_tools_panel"]);
  let loadStorageBtn = utils.createComponent("button", ["dtbtn"], "Load storage");
  loadStorageBtn.addEventListener("click", loadTestProgramsToStorage);
  let clearStorageBtn = utils.createComponent("button", ["dtbtn"], "Clear storage");
  clearStorageBtn.addEventListener("click", clearTestProgramsFromStorage);
  let toggleLoggingBtn = utils.createComponent("button", ["dtbtn"], "Toggle logging");
  toggleLoggingBtn.addEventListener("click", toggleLogging);
  let toggleTracingBtn = utils.createComponent("button", ["dtbtn"], "Toggle tracing");
  toggleTracingBtn.addEventListener("click", toggleTracing);
  panel.appendChild(loadStorageBtn);
  panel.appendChild(clearStorageBtn);
  panel.appendChild(toggleLoggingBtn);
  panel.appendChild(toggleTracingBtn);
  document.querySelector("body").appendChild(panel)
}

function loadTestProgramsToStorage() {
  let programsPreparedForSerialization = programs.map(it => replaceCallbackFunctionsWithTheirNames(it));
  console.log(programsPreparedForSerialization);
  console.log(JSON.stringify(programsPreparedForSerialization));
  window.localStorage.setItem("programs", JSON.stringify(programsPreparedForSerialization));
}

function replaceCallbackFunctionsWithTheirNames(program) {
  let clone = Object.assign({}, program);
  console.log(clone);
  TreeUtils.visit(clone.mainEvent, event => event.callback = event.callback.name);
  return clone;
}

function clearTestProgramsFromStorage() {
  window.localStorage.removeItem("programs");
}