import { removeComponent } from './Utils';

function create(components, customPropertiesObj) {
  return Object.assign(Object.create(Component), {components, ...customPropertiesObj});
}
let Component = {
  attach(container) {
    this.components.forEach(it => container.appendChild(it));
  },
  detach() {
    this.components.forEach(it => removeComponent(it));
  }
};

export { create };
