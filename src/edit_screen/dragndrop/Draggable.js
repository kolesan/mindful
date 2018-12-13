import { noop, px } from "../../utils/Utils";
import { removeComponent } from "../../utils/HtmlUtils";
import * as Map from '../../utils/Map';

function makeDraggable(cmp) {
  let dragging = false;
  let dragImage = null;
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
      return this;
    },
    allowTouch() {
      cmp.addEventListener("touchstart", onTouchStart);
      cmp.addEventListener("touchmove", onTouchMove);
      cmp.addEventListener("touchend", onEnd);
    }
  });

  function onMouseDown(event) {
    // console.log("Mouse down");

    onStart(event.currentTarget, event.x, event.y)
  }
  function onMouseMove(event) {
    // console.log("Mouse move");

    onMove(event.x, event.y);
  }

  function onTouchStart(event) {
    // console.log("Touch start");
    event.stopPropagation();
    event.preventDefault();

    let {x, y} = touchPoint(event);
    onStart(event.currentTarget, x, y);
  }
  function onTouchMove(event) {
    event.preventDefault();
    // console.log("Touch move");

    let {x, y} = touchPoint(event);
    onMove(x, y)
  }

  function onStart(target, x, y) {
    // console.log("Drag start", {target, x, y});
    dragging = true;
    dragImage = makeDragImage(target, x, y);

    dragStartCb(dragImage, cmp);

    originalCmpStyle = cmp.style;
    stylePlaceholderCb(cmp.style);
  }
  function onMove(x, y) {
    if (dragging) {
      // console.log("Drag move", {x, y});
      dragImage.move(x, y);
      dropZones.forEach((zone, i) => {
        // console.log("dragging over", i, zone, zone.zone);
        if (dragImage.over(zone.zone)) {
          if (!zone.wasDraggedOver) {
            zone.dragEnter(dragImage)
          } else {
            zone.dragOver(dragImage);
          }
        } else if (zone.wasDraggedOver) {
          zone.dragLeave(dragImage);
        }
      });
    }
  }
  function onEnd(event) {
    event.preventDefault();
    if (dragging) {
      // console.log("Drag end");
      dropZones.forEach(zone => {
        if (dragImage.over(zone.zone)) {
          zone.drop(dragImage);
        }
      });

      dragImage.destroy();
      dragImage = null;

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
}


function makeDragImage(cmp, x, y) {
  let offsetX = x - cmp.getBoundingClientRect().left;
  let offsetY = y - cmp.getBoundingClientRect().top;
  let data = Map.inst();

  let img = null;
  setDragImage(cmp.cloneNode(true));
  img.style.width = cmp.getBoundingClientRect().width + "px";

  move(x, y);

  return Object.freeze({
    get offset() { return {x: offsetX, y: offsetY} },
    get data() { return data; },
    get style() { return img.style },
    set style(style) { img.style = style },
    get dragImage() { return img },
    set dragImage(img) {
      setDragImage(img)
    },
    move,
    offsetBy(x, y) {
      offsetX = x;
      offsetY = y;
    },
    centerOn(x, y) {
      let rect = img.getBoundingClientRect();
      offsetX = rect.width / 2;
      offsetY = rect.height / 2;
      move(x, y);
    },
    destroy() {
      removeComponent(img);
    },
    over(rect) {
      return intersects(img.getBoundingClientRect(), rect);
    },
    centerIsInside(elem, threshold = 0) {
      // console.log({inside: inside(center(dragImg), elem), center: center(dragImg), threshold, elem});
      return inside(center(img), elem, threshold);
    },
    centerIsAbove(elem) {
      return center(img).y < center(elem).y;
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

  function setDragImage(newImg) {
    removeComponent(img);
    img = newImg;
    img.style.position = "absolute";
    img.style.margin = "0";
    document.body.appendChild(img);
  }

  function center(elem) {
    let rect = elem.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function move(x, y) {
    // console.log({offsetX, offsetY});
    img.style.left = px(x - offsetX);
    img.style.top = px(y - offsetY);
  }

  function intersects(a, b) {
    return !(a.left > b.right || a.right < b.left || a.top > b.bottom || a.bottom < b.top);
  }
}

export { makeDraggable };