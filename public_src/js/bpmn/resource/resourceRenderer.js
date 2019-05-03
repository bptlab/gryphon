var inherits = require('inherits');

var BaseRenderer = require('diagram-js/lib/draw/BaseRenderer');
var TextUtil = require('diagram-js/lib/util/Text');
const PATH_DATA = require('./resourcePath');

var {
  append: svgAppend,
  attr: svgAttr,
  classes: svgClasses,
  create: svgCreate
} = require('tiny-svg');

const TASK_BORDER_RADIUS = 10;
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