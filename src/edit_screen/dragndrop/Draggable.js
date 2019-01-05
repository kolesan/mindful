import { log } from "../../utils/Logging";
import { noop, px } from "../../utils/Utils";
import { removeComponent } from "../../utils/HtmlUtils";
import * as Map from '../../utils/Map';
import { center, inside, point, rect } from "../../utils/GeometryUtils";

function makeDraggable(cmp, dragAnchorCmp) {
  let dragging = false;
  let draggable = null;
  let dragStartCb = noop;
  let dragEndCb = noop;
  let stylePlaceholderCb = noop;
  let dropZones = [];
  let originalCmpStyle = null;

  initDragStartEvent("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onEnd);

  return Object.freeze({
    onDragStart(fn) {
      dragStartCb = fn;
      return this;
    },
    onDragEnd(fn) {
      dragEndCb = fn;
      return this;
    },
    stylePlaceholder(fn) {
      stylePlaceholderCb = fn;
      return this;
    },
    bindDropZone(zone) {
      dropZones.push(zone);
      return this;
    },
    allowTouch() {
      initDragStartEvent("touchstart", onTouchStart);
      cmp.addEventListener("touchmove", onTouchMove);
      cmp.addEventListener("touchend", onEnd);
      return this;
    }
  });

  function initDragStartEvent(eventName, listener) {
    if (dragAnchorCmp) {
      if (!cmp.contains(dragAnchorCmp)) {
        throw new Error("Drag anchor component has to be a descendant of component to be dragged");
      }
      dragAnchorCmp.addEventListener(eventName, listener);
    } else {
      cmp.addEventListener(eventName, listener);
    }
  }

  function onMouseDown(event) {
    // console.log("Mouse down");
    onStart(cmp, event.x, event.y);
  }
  function onMouseMove(event) {
    // console.log("Mouse move");
    onMove(event.x, event.y);
  }

  function onTouchStart(event) {
    // console.log("Touch start");
    if (event.touches.length > 1) {
      //User is probably doing some other gesture
      return;
    }
    //To stop user from starting a gesture while already dragging
    event.preventDefault();

    let {x, y} = touchPoint(event);
    onStart(cmp, x, y);
  }
  function onTouchMove(event) {
    // console.log("Touch move");

    let {x, y} = touchPoint(event);
    onMove(x, y);
  }

  function onStart(target, x, y) {
    // console.log("Drag start", {target, x, y});
    refreshDropZones();
    dragging = true;

    let targetRect = target.getBoundingClientRect();
    let targetImage = target.cloneNode(true);
    draggable = newDraggable(newDragImage(targetImage, targetRect));
    draggable.image.offsetBy(targetRect.left - x, targetRect.top - y);
    draggable.image.move(x, y);

    dragStartCb(draggable, cmp);

    originalCmpStyle = cmp.style;
    stylePlaceholderCb(cmp.style);
  }
  function onMove(x, y) {
    if (dragging) {
      // console.log("Drag move", {x, y});
      draggable.move(x, y);
      dropZones.forEach((zone, i) => {
        // console.log("dragging over", i, zone, zone.zone);
        if (draggable.over(zone.zone)) {
          if (!zone.wasDraggedOver) {
            zone.dragEnter(draggable)
          } else {
            zone.dragOver(draggable);
          }
        } else if (zone.wasDraggedOver) {
          zone.dragLeave(draggable);
        }
      });
    }
  }
  function onEnd(event) {
    if (dragging) {
      // console.log("Drag end");
      dropZones.forEach(zone => {
        if (draggable.over(zone.zone)) {
          zone.drop(draggable);
        }
      });
      dragEndCb(draggable);

      draggable.destroy();

      cmp.style = originalCmpStyle;
      dragging = false;
    }
  }

  function touchPoint(event) {
    let touch = event.touches[0];
    return {
      x: touch.clientX,
      y: touch.clientY
    };
  }

  function refreshDropZones() {
    dropZones.forEach(zone => zone.init());
  }
}


function newDraggable(image = null) {
  let data = Map.inst();
  return {
    get data() { return data },
    get image() { return image },
    over(zone) { return image.over(zone) },
    move(x, y) { image.move(x, y) },
    destroy() {
      image.destroy();
      image = null;
      data = null;
    }
  };
}


function newDragImage(imageNode, imageNodeRect) {
  let imageRect = rect(imageNodeRect.left, imageNodeRect.top, imageNodeRect.width, imageNodeRect.height);
  let imageOffset = point(0, 0);

  imageNode.style.width = px(imageNodeRect.width);
  imageNode.style.position = "absolute";
  imageNode.style.margin = "0";
  imageNode.style.left = px(imageRect.x);
  imageNode.style.top = px(imageRect.y);
  document.body.appendChild(imageNode);

  return Object.freeze({
    get style() { return imageNode.style },
    set style(style) { imageNode.style = style },
    get node() { return imageNode },
    offsetBy(x, y) {
      imageOffset = point(x, y);
    },
    move(x, y) {
      imageRect.x = x + imageOffset.x;
      imageRect.y = y + imageOffset.y;
      imageNode.style.transform = `translate(${px(imageRect.x - imageNodeRect.left)}, ${px(imageRect.y - imageNodeRect.top)})`;
    },
    destroy() {
      removeComponent(imageNode);
    },
    over(zone) {
      return !(imageRect.left   > zone.right  ||
               imageRect.right  < zone.left   ||
               imageRect.top    > zone.bottom ||
               imageRect.bottom < zone.top);
    },
    centerIsInside(elem, threshold = 0) {
      let center = point(imageRect.centerX, imageRect.centerY);
      return inside(center, elem, threshold);
    },
    centerIsAbove(elem) {
      return imageRect.centerY < center(elem).y;
    }
  });
}

export { makeDraggable };