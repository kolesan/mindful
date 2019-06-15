import { log } from "./Logging";
import { arr } from "./Utils";

function isArray(o) {
  return Array.prototype.isPrototypeOf(o);
}
export function createElement(tag, classes, content) {
  let elem = document.createElement(tag);

  if (classes) {
    if (isArray(classes)) {
      classes.forEach(it => {
        it.split(" ").forEach(c => elem.classList.add(c))
      });
    } else {
      classes.split(" ").forEach(c => elem.classList.add(c))
    }
  }

  if (content) {
    if (isArray(content)) {
      content.forEach(it => {
        elem.appendChild(it);
      });
    } else {
      elem.innerHTML = content;
    }
  }

  return elem;
}

export function element({tag, classes, children = [], attributes = {}, listeners = {}, value, text}) {
  let elem = createElement(tag, classes);

  children.forEach(it => elem.appendChild(it));
  Object.keys(attributes).forEach(k => elem.setAttribute(k, attributes[k]));
  Object.keys(listeners).forEach(k => elem.addEventListener(k, listeners[k]));
  elem.value = value;

  if (typeof text == "string" && text.length > 0) {
    elem.appendChild(textNode(text));
  }

  return elem;
}

export function textNode(v) {
  return document.createTextNode(v);
}

export function elementFromString(s) {
  let template = document.createElement('template');
  template.innerHTML = s.trim();
  return template.content.firstChild;
}

export function removeComponent(node) {
  if (node && node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

export function appendAsFirstChild(child, parent) {
  parent.insertBefore(child, parent.firstChild);
}

export function removeChildNodes(parent, predicate = ()=>true) {
  Array.from(parent.children).forEach(child => {
    if (predicate(child)) {
      parent.removeChild(child);
    }
  });
}

export function iconElem(classes) {
  return createElement("i", classes);
}

export function setChildIcon(elem, iconClasses) {
  let newIcon = iconElem(iconClasses);
  let oldIcon = elem.querySelector("i");
  elem.replaceChild(newIcon, oldIcon);
}

export function replaceWithClone(node) {
  let clone = node.cloneNode(true);
  node.parentNode.replaceChild(clone, node);
  return clone;
}
export function path(node) {
  let path = [];
  let parent = node.parentNode;
  while(parent) {
    path.push(parent);
    parent = parent.parentNode;
  }
  return path;
}
export function children(node) {
  return arr(node.children);
}
export function disable(elem) {
  elem && elem.setAttribute("disabled", "true");
}
export function enable(elem) {
  elem && elem.removeAttribute("disabled");
}

export function query(selector, elem = document) {
  return elem.querySelector(selector);
}
export function queryAll(selector, elem = document) {
  return elem.querySelectorAll(selector);
}