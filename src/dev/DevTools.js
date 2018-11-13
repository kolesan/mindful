import './devTools.css';
import * as utils from '../Utils';
import { programs } from './TestData';
import * as TreeUtils from '../TreeUtils';

initDevTools();

function initDevTools() {
  let panel = utils.createComponent("div", ["dev_tools_panel"]);
  let loadStorageBtn = utils.createComponent("button", ["dtbtn"], "LoadStorage");
  loadStorageBtn.addEventListener("click", loadTestProgramsToStorage);
  let clearStorageBtn = utils.createComponent("button", ["dtbtn"], "ClearStorage");
  clearStorageBtn.addEventListener("click", clearTestProgramsFromStorage);
  panel.appendChild(loadStorageBtn);
  panel.appendChild(clearStorageBtn);
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
  TreeUtils.walkATree(clone.mainEvent, event => event.callback = event.callback.name);
  return clone;
}

function clearTestProgramsFromStorage() {
  window.localStorage.removeItem("programs");
}