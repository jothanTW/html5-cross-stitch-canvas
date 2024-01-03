import { CommonService } from '../services/common.service.mjs';
//import { ObjectService } from '../services/object.service.mjs';

import { CursorControl } from '../controls/cursor.control.mjs';
//import { StylebarControl } from '../controls/stylebar.control.mjs';
import { SubMenu, SubMenuIcon } from '../controls/submenu.control.mjs';

let dashpattern = [10, 10];
let dashcolor = '#888';
let dashweight = 2;

let SelectAndPanTool = {
  icon: './img/select-icon.png',
  name: 'Select and Pan Tool',
  preview: null,
  exportSketchCallback: null,
  isMouseDown: false,
  isRightMouseDown: false,
  movingIndex: -1,
  subMenu: null,//new SubMenu(),
  drawPreview: function (context) {
    if (this.movingIndex !== -1) {
      let obj = null;// ObjectService.objects[this.movingIndex];
      if (obj) {
        let rect = obj.boundingRect;
        context.translate(obj.offsetX, obj.offsetY);
        context.setLineDash(dashpattern);
        context.strokeStyle = dashcolor;
        context.lineWidth = dashweight;
        context.beginPath();
        context.rect(rect.x, rect.y, rect.w, rect.h);
        context.stroke();
        context.setLineDash([]);
        context.translate(-obj.offsetX, -obj.offsetY);
      }
    }
  },
  events: {
    escape: function () {
      SelectAndPanTool.isMouseDown = false;
      SelectAndPanTool.isRightMouseDown = false;
      SelectAndPanTool.movingIndex = -1;
      CursorControl.changeCursor();
    },
    delete: function () {
      return false;
    },
    mousedown: function (evt) {
      if (evt.which === 3 || evt.button === 2) {
        SelectAndPanTool.isRightMouseDown = true;
        CursorControl.changeCursor('move');
      } else {
        SelectAndPanTool.isMouseDown = true;
        let coords = CommonService.convertToGridCoords(evt.clientX, evt.clientY);
        // get the target from the canvas clicked on in case more are added in the future
      }
      return true;
    },
    mouseup: function (evt) {
      if (evt.which === 3 || evt.button === 2) {
        SelectAndPanTool.isRightMouseDown = false;
        CursorControl.changeCursor();
      } else {
        SelectAndPanTool.isMouseDown = false;
        if (SelectAndPanTool.movingIndex !== -1) {
        }
      }
      let coords = CommonService.convertToGridCoords(evt.clientX, evt.clientY);
      // get the target from the canvas clicked on in case more are added in the future
      return true;
    },
    mousemove: function (evt) {
      let movementX = evt.movementX / CommonService.zoom;
      let movementY = evt.movementY / CommonService.zoom;
      if (SelectAndPanTool.isRightMouseDown) {
        CommonService.modX(-movementX);
        CommonService.modY(-movementY);
        return true;
      }
      let coords = CommonService.convertToGridCoords(evt.clientX, evt.clientY);
      // get the target from the canvas clicked on in case more are added in the future
      let context = evt.target.getContext('2d');
      CursorControl.changeCursor();
      return false;
    },
    touchdown: function (evt) {
      SelectAndPanTool.isMouseDown = true;
      let coords = CommonService.convertToGridCoords(evt.clientX, evt.clientY);
      // get the target from the canvas clicked on in case more are added in the future
      let context = evt.target.getContext('2d');
    }
  }
}

export { SelectAndPanTool }