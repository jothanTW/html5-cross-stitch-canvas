import { EventLoudener } from '../core/loudener.mjs';
import { CommonService } from '../services/common.service.mjs';

let stylebarEle = document.getElementById('stylebar');

/**
 * The stylebar control. Maintains the color/line size options
 * @module controls/stylebar
 */
let StylebarControl = {
  inputs: {},

  addInput(name) {
    let ele = document.createElement('input');
    let emit = new EventLoudener();

    ele.addEventListener('input', event => { emit.emit(event.target.value); });
    ele.addEventListener('change', event => { emit.emit(event.target.value); });
    this.inputs[name] = {
      ele, emit
    }

    let parent = document.createElement('div');
    parent.id = 'style-' + name + '-input';
    parent.appendChild(ele);
    stylebarEle.appendChild(parent);
  },

  addSliderInput(name, min, max, step, current, label, labelCallback = null) {
    this.addInput(name);
    let ele = this.inputs[name].ele;
    ele.setAttribute('type', 'range');
    ele.setAttribute('min', min);
    ele.setAttribute('max', max);
    ele.setAttribute('step', step);
    ele.setAttribute('value', current);

    let labelEle = document.createElement('span');
    if (labelCallback) {
      this.inputs[name].emit.addListener(labelCallback);
    } else {
      this.inputs[name].emit.addListener(value => {
        labelEle.innerText = label + ': ' + value;
      });
    }
    ele.parentElement.appendChild(labelEle);
    this.inputs[name].labelEle = labelEle;

    this.inputs[name].emit.emit(current);
  }
}

StylebarControl.addSliderInput('zoom', CommonService.constants.minZoom, CommonService.constants.maxZoom, CommonService.constants.zoomStep, CommonService.zoom, 'Zoom', value => {
  StylebarControl.inputs.zoom.labelEle.innerText = 'Zoom: ' + Math.round((value + Number.EPSILON) * 100) + '%';
});
StylebarControl.inputs.zoom.emit.addListener(value => { CommonService.setZoom(value) });

CommonService.zoomEvent.addListener(zoom => {
  StylebarControl.inputs.zoom.ele.value = zoom;
  StylebarControl.inputs.zoom.labelEle.innerText = 'Zoom: ' + Math.round((zoom + Number.EPSILON) * 100) + '%';
  //StylebarControl.inputs.zoom.labelEle.innerText = 'Zoom: ' + zoom;
  CommonService.triggerDrawFunction();
});

StylebarControl.addSliderInput('spi', 6, 36, 2, 14, 'SPI');
StylebarControl.inputs.spi.emit.addListener(spi => {
  CommonService.gridSize = CommonService.constants.maxGridSize / spi;
  CommonService.triggerDrawFunction();
})

export { StylebarControl }