import { removeComponent } from './HtmlUtils';

function create(elements, customPropertiesObj = {}) {
  return Object.assign(Object.create(Component), {elements, ...customPropertiesObj});
}
let Component = {
  attach(container) {
    this.elements.forEach(it => container.appendChild(it));
  },
  detach() {
    this.elements.forEach(it => removeComponent(it));
  },
  get element() {
    return this.elements[0];
  }
};

export { create };
