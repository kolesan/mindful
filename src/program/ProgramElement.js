import { minmax } from "../utils/Utils";

let programElement = {
  init(children, duration) {
    this.children = children;
    this.duration = duration;
    this._childCount = this.children.length;
    this._minmaxIndex = minmax(-1, this._childCount);
    this._setCurrentChildIndex(-1);
  },
  nextChild() {
    this._setCurrentChildIndex(this._currentChildIndex + 1);
    return this._currentChild();
  },
  previousChild() {
    this._setCurrentChildIndex(this._currentChildIndex - 1);
    return this._currentChild();
  },
  reset() {
    this._setCurrentChildIndex(-1);
  },
  skipToAfterLastChild() {
    this._setCurrentChildIndex(this._childCount);
  },

  _setCurrentChildIndex(v) {
    this._currentChildIndex = this._minmaxIndex(v);
  },
  _currentChild() {
    let child = this.children[this._currentChildIndex];
    if (child) {
      child.id = this._currentChildIndex;
    }
    return child;
  }
};

export default programElement;