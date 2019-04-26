var inherits = require('inherits');

var BaseRenderer = require('diagram-js/lib/draw/BaseRenderer');
var TextUtil = require('diagram-js/lib/util/Text');

var {
  append: svgAppend,
  attr: svgAttr,
  classes: svgClasses,
  create: svgCreate
} = require('tiny-svg');

const TASK_BORDER_RADIUS = 10;
const PATH_DATA = 'm 21,5 c 0.117285,0.27366 0.536755,0.86008 0.527246,1.05238 -0.01374,0.30747 -0.612832,0.70687 -0.844227,0.89177 0,0 -2.74717,2.17661 -2.74717,2.17661 0,0 -9.826406,7.79773 -9.826406,7.79773 0,0 -2.324529,1.85433 -2.324529,1.85433 -0.362414,0.28106 -0.92241,0.65087 -1.021732,1.12528 -0.134188,0.64559 0.484982,1.27005 1.655695,0.37721 0,0 5.177355,-4.11757 5.177355,-4.11757 0,0 4.543396,-3.61148 4.543396,-3.61148 0,0 6.656593,-5.22173 6.656593,-5.22173 0,0 0.633963,0.95095 0.633963,0.95095 0,0 0.211323,0 0.211323,0 0,0 1.195015,-2.53585 1.195015,-2.53585 0,0 0.706869,-1.69058 0.706869,-1.69058 0,0 -4.543391,0.95095 -4.543391,0.95095 z m 1.162264,23.9849 c 0,0 -2.430193,0 -2.430193,0 0,0 0,-11.62263 0,-11.62263 0,0 0,-2.32453 0,-2.32453 0,0 -0.183844,-0.97842 -0.183844,-0.97842 0,0 -0.767096,-0.18385 -0.767096,-0.18385 0,0 -1.267921,0 -1.267921,0 0,0 -0.978414,0.18385 -0.978414,0.18385 0,0 -0.183853,0.7671 -0.183853,0.7671 0,0 0,2.6415 0,2.6415 0,0 0,11.51698 0,11.51698 0,0 -2.535845,0 -2.535845,0 0,0 0,-9.50942 0,-9.50942 0,-0.25888 0.02534,-0.68891 -0.123617,-0.90553 -0.267321,-0.38777 -1.631404,-0.25781 -2.095249,-0.25675 -0.291621,0 -0.758641,-0.037 -0.978419,0.18385 -0.190184,0.19019 -0.17962,0.51774 -0.183845,0.7671 0,0 0,1.69057 0,1.69057 0,0 0,8.03018 0,8.03018 0,0 -2.430185,0 -2.430185,0 0,0 0,-5.28302 0,-5.28302 0,-0.29163 0.037,-0.75864 -0.183852,-0.97842 -0.281053,-0.28105 -1.703246,-0.18596 -2.140679,-0.18384 -0.271544,0.001 -0.666713,-0.0233 -0.872753,0.18384 -0.220831,0.21978 -0.183844,0.68679 -0.183844,0.97842 0,0 0,4.96603 0,4.96603 0.0012,0.35713 -0.04018,0.84105 0.25675,1.09887 0.231395,0.20182 0.616001,0.168 0.905509,0.16906 0,0 3.486789,0 3.486789,0 0,0 15.320747,0 15.320747,0 0.625509,-0.001 1.046036,0.0444 0.964675,-0.73963 0,0 0,-4.7547 0,-4.7547 0,0 0,-14.05283 0,-14.05283 -0.01374,-0.25887 0.01161,-0.6889 -0.137358,-0.90551 -0.267319,-0.38883 -1.826862,-0.26309 -2.30656,-0.25675 -0.96468,0.0137 -0.949888,0.29795 -0.950943,1.16226 0,0 0,5.17735 0,5.17735 0,0 0,5.49435 0,5.49435 0,0 0,7.92452 0,7.92452 z'
var LABEL_STYLE = {
  fontFamily: 'Arial, sans-serif',
  fontSize: 12
};

inherits(ResourceRenderer, BaseRenderer); 

function ResourceRenderer(eventBus, bpmnRenderer) {
    BaseRenderer.call(this, eventBus, 2000); 

    this.textUtil = new TextUtil({
      style: LABEL_STYLE,
      size: { width: 100 }
    });

    this.bpmnRenderer = bpmnRenderer;
  }

  ResourceRenderer.prototype.canRender = function(element) {
    return /^resource:/.test(element.type);
  }

  ResourceRenderer.prototype.drawShape = function(parentNode, element) {
    const shape = this.drawRect(parentNode, element.width, element.height, TASK_BORDER_RADIUS);
    svgAppend(parentNode, shape);

    var text = this.textUtil.createText(element.businessObject.name || '', {
      box: element,
      align: 'center-middle',
      padding: 5,
      style: {
        fill: 'black'
      }
    });
    svgClasses(text).add('djs-label');
    svgAppend(parentNode, text);

    this.drawResourceIcon(parentNode, element);

    return shape;
  }

  ResourceRenderer.prototype.drawResourceIcon = function(parentNode, element) {
    attrs = {
      fill: 'black',
      strokeWidth: 0.5,
      stroke: 'black'
    };
    var path = svgCreate('path');
    svgAttr(path, { d: PATH_DATA });
    svgAttr(path, attrs);

    svgAppend(parentNode, path);
  }

  ResourceRenderer.prototype.drawRect = function(parentGfx, width, height, r, offset, attrs) {
    offset = offset || 0;

    attrs = {
      stroke: 'black',
      strokeWidth: 2,
      fill: 'white'
    };

    var rect = svgCreate('rect');
    svgAttr(rect, {
      x: offset,
      y: offset,
      width: width - offset * 2,
      height: height - offset * 2,
      rx: r,
      ry: r
    });
    svgAttr(rect, attrs);

    svgAppend(parentGfx, rect);

    return rect;
  }

ResourceRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ];

module.exports = ResourceRenderer;