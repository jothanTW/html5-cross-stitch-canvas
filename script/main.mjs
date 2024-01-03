import { dot } from './core/shapes.mjs';

import { ToolbarControl } from './controls/toolbar.control.mjs';
import { KeyboardControl } from './controls/keyboard.control.mjs';
import { TouchControl } from './controls/touch.control.mjs';
import { StylebarControl } from './controls/stylebar.control.mjs';

import { CommonService } from './services/common.service.mjs';

// canvas
const container = document.getElementById('container');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// colors
let dotColor = '#000';

// mobile setup
if (!context.reset) {
  context.reset = context.resetTransform;
}

function draw() {
  context.reset()
  context.scale(CommonService.zoom, CommonService.zoom);
  context.clearRect(0, 0, canvas.width / CommonService.zoom, canvas.height / CommonService.zoom);
  // first draw the dots
  let offsetX = CommonService.viewX % CommonService.gridSize;
  let offsetY = CommonService.viewY % CommonService.gridSize;
  let bounds = {
    x: CommonService.viewX,
    y: CommonService.viewY,
    width: container.offsetWidth / CommonService.zoom,
    height: container.offsetHeight / CommonService.zoom
  };
  console.log(bounds);
  for (let i = 0; i < bounds.height; i += CommonService.gridSize) {
    for (let j = CommonService.gridSize; j < bounds.width; j += CommonService.gridSize) {
      dot(j - offsetX, i - offsetY, 1 / CommonService.zoom, context, dotColor);
    }
  }
}
context.translate(-CommonService.viewX, -CommonService.viewY);

// TODO: Draw threads

// reset translate
context.translate(CommonService.viewX, CommonService.viewY);

function resize() {
  let winWidth = container.offsetWidth;
  let winHeight = container.offsetHeight;
  CommonService.canvasOffsetX = canvas.offsetLeft;
  CommonService.canvasOffsetY = canvas.offsetTop;
  canvas.style.width = winWidth + 'px';
  canvas.style.height = winHeight + 'px';
  canvas.width = winWidth;
  canvas.height = winHeight;
  context.scale(CommonService.zoom, CommonService.zoom);
}


ToolbarControl.initCanvasListeners(canvas);
KeyboardControl.initKeyboardEvents();
TouchControl.initTouchEvents(canvas);

CommonService.setDrawFunction(() => draw());

resize();
draw();

// add needed event listeners
canvas.addEventListener('wheel', ev => {
  ev.stopPropagation();
  ev.preventDefault();
  let isTouchpad = false;
  let deltaY = ev.deltaY;
  if (ev.wheelDeltaY === ev.deltaY * -3 || ev.deltaMode === 0) {
    deltaY *= 3 * CommonService.constants.trackpadScale;
  }
  CommonService.modZoom(-deltaY * CommonService.constants.zoomPercent, 
    {x: ev.clientX / CommonService.zoom, y: ev.clientY / CommonService.zoom});
  resize();
  draw();
});

container.addEventListener('resize', ev => {
  console.log('container resized')
  resize();
  draw();
});

canvas.addEventListener('resize', ev => {
  console.log('canvas resized');
  resize();
  draw();
});

// TODO: add touch events