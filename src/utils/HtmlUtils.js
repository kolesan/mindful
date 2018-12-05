function isArray(o) {
  return Array.prototype.isPrototypeOf(o);
}
export function createComponent(tag, classes, content) {
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
    elem.innerHTML = content;
  }

  return elem;
}

export function removeComponent(node) {
  if (node && node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

export function appendAsFirstChild(child, parent) {
  parent.insertBefore(child, parent.firstChild);
}

export function removeAllChildNodes(parent, predicate = ()=>true) {
  while (parent.firstChild) {
    if (predicate(parent.firstChild)) {
      parent.removeChild(parent.firstChild);
    }
  }
}

export function iconCmp(classes) {
  return createComponent("i", classes);
}

export function setIcon(cmp, iconClasses) {
  let newIcon = iconCmp(iconClasses);
  let oldIcon = cmp.querySelector("i");
  cmp.replaceChild(newIcon, oldIcon);
}