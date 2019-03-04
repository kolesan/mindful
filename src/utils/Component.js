import { removeComponent } from './HtmlUtils';

function create(elements, customPropertiesObj = {}, children = []) {
  return Object.assign(Object.create(Component), {elements, children, ...customPropertiesObj});
}
let Component = {
  children: [],
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
