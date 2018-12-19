import { log } from "./Logging";

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
export function element({tag, classes, children = [], attributes = {}, listeners = {}, value}) {
  let elem = createElement(tag, classes);

  children.forEach(it => elem.appendChild(it));
  Object.keys(attributes).forEach(k => elem.setAttribute(k, attributes[k]));
  Object.keys(listeners).forEach(k => elem.addEventListener(k, listeners[k]));
  elem.value = value;

  return elem;
}
export function text(v) {
  return document.createTextNode(v);
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

export function iconCmp(classes) {
  return createElement("i", classes);
}

export function setIcon(cmp, iconClasses) {
  let newIcon = iconCmp(iconClasses);
  let oldIcon = cmp.querySelector("i");
  cmp.replaceChild(newIcon, oldIcon);
}

export function replaceWithClone(node) {
  let clone = node.cloneNode(true);
  node.parentNode.replaceChild(clone, node);
  return clone;
}