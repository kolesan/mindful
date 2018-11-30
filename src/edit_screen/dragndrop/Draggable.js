import { noop } from "../../utils/Utils";
import { removeComponent } from "../../utils/HtmlUtils";
import * as Map from '../../utils/Map';

function makeDraggable(cmp) {
  let dragging = false;
  let dragged = null;
  let dragStartCb = noop;
  let stylePlaceholderCb = noop;
  let dropZones = [];
  let originalCmpStyle = null;

  cmp.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onEnd);

  return Object.freeze({
    onDragStart(fn) {
      dragStartCb = fn;
      return this;
    },
    stylePlaceholder(fn) {
      stylePlaceholderCb = fn;
      return this;
    },
    bindDropZone(zone) {
      dropZones.push(zone);
      console.log("binding zone", zone);
      return this;
    },
    allowTouch() {
      cmp.addEventListener("touchstart", onTouchStart);
      cmp.addEventListener("touchmove", onTouchMove);
      cmp.addEventListener("touchend", onEnd);
    }
  });

  function onMouseDown(event) {
    event.stopPropagation();
    onStart(event.currentTarget, event.x, event.y)
  }
  function onMouseMove(event) {
    onMove(event.x, event.y);
  }

  function onTouchStart(event) {
    event.stopPropagation();
    let {x, y} = touchPoint(event);
    onStart(event.currentTarget, x, y);
  }
  function onTouchMove(event) {
    let {x, y} = touchPoint(event);
    onMove(x, y)
  }

  function onStart(target, x, y) {
    console.log("Drag start", {target, x, y});
    dragging = true;
    dragged = draggable(target, x, y);

    dragStartCb(dragged, cmp);

    originalCmpStyle = cmp.style;
    stylePlaceholderCb(cmp.style);
  }
  function onMove(x, y) {
    console.log("Drag move", {x, y});
    if (dragging) {
      dragged.move(x, y);
      dropZones.forEach((zone, i) => {
        // console.log("dragging over", i, zone, zone.zone);
        if (dragged.over(zone.zone)) {
          if (!zone.wasDraggedOver) {
            zone.dragEnter(dragged)
          } else {
            zone.dragOver(dragged);
          }
        } else if (zone.wasDraggedOver) {
          zone.dragLeave(dragged);
        }
      });
    }
  }
  function onEnd() {
    if (dragging) {
      dropZones.forEach(zone => {
        if (dragged.over(zone.zone)) {
          zone.drop(dragged);
        }
      });

      dragged.destroy();
      dragged = null;

      cmp.style = originalCmpStyle;
      dragging = false;
    }
  }

  function touchPoint(event) {
    let touch = event.touches[0];
    let cmpRect = event.currentTarget.getBoundingClientRect();
    console.log(touch.clientX, touch.clientY);
    return {
      x: touch.clientX - cmpRect.left,
      y: touch.clientY - cmpRect.top
    };
  }
}


function draggable(cmp, x, y) {
  let offsetX = x - cmp.getBoundingClientRect().left;
  let offsetY = y - cmp.getBoundingClientRect().top;
  let data = Map.inst();

  let dragImg = null;
  setDragImage(cmp.cloneNode(true));
  dragImg.style.width = cmp.getBoundingClientRect().width + "px";

  move(x, y);

  return Object.freeze({
    get offset() { return {x: offsetX, y: offsetY} },
    get data() { return data; },
    get style() { return dragImg.style },
    set style(style) { dragImg.style = style },
    get dragImage() { return dragImg },
    set dragImage(img) {
      setDragImage(img)
    },
    move,
    offsetBy(x, y) {
      offsetX = x;
      offsetY = y;
    },
    centerOn(x, y) {
      let rect = dragImg.getBoundingClientRect();
      offsetX = rect.width / 2;
      offsetY = rect.height / 2;
      move(x, y);
    },
    destroy() {
      removeComponent(dragImg);
    },
    over(rect) {
      return intersects(dragImg.getBoundingClientRect(), rect);
    },
    centerIsInside(elem, threshold = 0) {
      // console.log({inside: inside(center(dragImg), elem), center: center(dragImg), threshold, elem});
      return inside(center(dragImg), elem, threshold);
    },
    centerIsAbove(elem) {
      return center(dragImg).y < center(elem).y;
    }
  });

  function isCursorInside(event, elem, threshold) {
    return inside({x: event.x, y: event.y}, elem, threshold);
  }

  function inside(point, elem, threshold = 0) {
    let elemRect = elem.getBoundingClientRect();
    return point.x >= (elemRect.left - threshold) && point.x <= (elemRect.right + threshold) &&
      point.y >= (elemRect.top - threshold) && point.y <= (elemRect.bottom + threshold);
  }

  function setDragImage(img) {
    removeComponent(dragImg);
    dragImg = img;
    dragImg.style.position = "absolute";
    dragImg.style.margin = "0";
    document.querySelector("body").appendChild(dragImg);
  }

  function center(elem) {
    let rect = elem.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function move(x, y) {
    dragImg.style.left = x - offsetX + "px";
    dragImg.style.top = y - offsetY + "px";
  }

  function intersects(a, b) {
    return !(a.left > b.right || a.right < b.left || a.top > b.bottom || a.bottom < b.top);
  }
}

export { makeDraggable };