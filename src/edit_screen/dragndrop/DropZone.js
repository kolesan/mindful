import { noop } from "../../utils/Utils";
function makeDropZone(cmp) {
  let wasDraggedOver = false;
  let zone = cmp.getBoundingClientRect();
  console.log("Creating drop zone for", cmp, zone);
  let onDragEnterCb = noop;
  let onDragOverCb = noop;
  let onDropCb = noop;
  let onDragLeaveCb = noop;
  return Object.freeze({
    onDragEnter(fn) {
      onDragEnterCb = fn;
      return this;
    },
    onDragOver(fn) {
      onDragOverCb = fn;
      return this;
    },
    onDragLeave(fn) {
      onDragLeaveCb = fn;
      return this;
    },
    onDrop(fn) {
      onDropCb = fn;
      return this;
    },
    build() {
      return Object.freeze({
        get wasDraggedOver() { return wasDraggedOver },
        get zone() { return zone; },
        init() {
          zone = cmp.getBoundingClientRect();
          console.log("Inititalizing drop zone for ", cmp, zone);
          wasDraggedOver = false;
        },
        dragEnter(draggable) {
          onDragEnterCb(draggable);
          wasDraggedOver = true;
        },
        dragOver(draggable) {
          onDragOverCb(draggable);
          wasDraggedOver = true;
        },
        dragLeave(draggable) {
          onDragLeaveCb(draggable);
          wasDraggedOver = false;
        },
        drop(draggable) {
          onDropCb(draggable);
          wasDraggedOver = false;
        }
      });
    },
  });
}

export { makeDropZone };