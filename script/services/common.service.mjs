import { EventLoudener } from "../core/loudener.mjs";

let drawFunction = null;

/**
 * A module of common constraints and view values
 * @module services/common
 */
let CommonService = {
  /** 
   * Event emitters 
   */
  zoomEvent: new EventLoudener(),

  /**
   * Constants and constraints for the view
   */
  constants: {
    // viewport constraints
    minZoom: 0.1,
    maxZoom: 3,
    maxDim: 10000,
    zoomPercent: 0.0001,
    pinchPercent: 0.01,
    trackpadScale: 2,

    zoomStep: 0.01,

    // grid constraints
    maxGridSize: 1000,
  },

  // viewport vars
  zoom: 1,
  viewX: 0,
  viewY: 0,
  canvasOffsetX: 0,
  canvasOffsetY: 0,

  gridSize: 50,

  setZoom: function (val) {
    let oldZoom = this.zoom;
    this.zoom = val;
    this.zoom =
      Math.ceil(((this.zoom - this.constants.minZoom) / this.constants.zoomStep))
      * this.constants.zoomStep
      + this.constants.minZoom;
    // make sure at least one step takes place
    if (oldZoom === this.zoom && val !== oldZoom) {
      if (val < oldZoom) {
        this.zoom -= this.constants.zoomStep;
      } else {
        this.zoom += this.constants.zoomStep;
      }
    }
    if (this.zoom < this.constants.minZoom) {
      this.zoom = this.constants.minZoom;
    }
    if (this.zoom > this.constants.maxZoom) {
      this.zoom = this.constants.maxZoom;
    }
    this.zoomEvent.emit(this.zoom);
  },

  modZoom: function (val, zoomCoords = null) {
    let oldScale = this.zoom;
    this.setZoom(this.zoom + val);
    if (zoomCoords) {
      let scale = this.zoom - oldScale;
      this.modX(zoomCoords.x * scale / this.zoom);
      this.modY(zoomCoords.y * scale / this.zoom);
    }
  },

  setX: function (val) {
    this.viewX = val;
    if (this.viewX < 0) {
      this.viewX = 0;
    }
    if (this.viewX > this.constants.maxDim) {
      this.viewX = this.constants.maxDim;
    }
  },

  modX: function (val) {
    this.setX(this.viewX + val);
  },

  setY: function (val) {
    this.viewY = val;
    if (this.viewY < 0) {
      this.viewY = 0;
    }
    if (this.viewY > this.constants.maxDim) {
      this.viewY = this.constants.maxDim;
    }
  },

  modY: function (val) {
    this.setY(this.viewY + val);
  },

  /**
   * Converts the given mouse coordinates into canvas coordinates
   * @param {number} x 
   * @param {number} y 
   * @returns the canvas coordinates as {x, y}
   */
  convertToGridCoords: function (x, y) {
    return {
      x: (x - this.canvasOffsetX) / this.zoom + this.viewX,
      y: (y - this.canvasOffsetY) / this.zoom + this.viewY
    }
  },

  /**
   * Gets the closes 'dot' coordinate on the grid, for snapping. Inputs are canvas coordinates
   * @param {number} x 
   * @param {number} y 
   * @returns the canvas coordinates as {x, y}
   */
  getClosestDot: function (x, y) {
    return {
      x: x - (x % this.gridSize),
      y: y - (y % this.gridSize)
    }
  },
  /**
   * Sets the redraw trigger
   * @param {function(): void} callback 
   */
  setDrawFunction: function (callback) {
    if (typeof callback !== 'function') {
      console.error('Attempted to add an invalid draw function!');
      return;
    }
    drawFunction = callback;
  },
  /**
   * Calls the redraw trigger
   */
  triggerDrawFunction: function () {
    if (drawFunction) {
      drawFunction();
    }
  }
}

CommonService.viewX = CommonService.constants.maxDim / 2;
CommonService.viewY = CommonService.constants.maxDim / 2;

CommonService.gridSize = CommonService.constants.maxGridSize / 16;

export {
  CommonService
}