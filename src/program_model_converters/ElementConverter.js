export default {
  type: "",
  serialize(element) {
    throw Error(`Serialization of ${element} is not implemented`);
  },
  deserialize(element) {
    throw Error(`Deserialization of ${element} is not implemented`);
  }
}
