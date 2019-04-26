var inherits = require('inherits');

var BaseRenderer = require('diagram-js/lib/draw/BaseRenderer');
var TextUtil = require('diagram-js/lib/util/Text');

var {
  append: svgAppend,
  attr: svgAttr,
  classes: svgClasses,
  create: svgCreate
} = require('tiny-svg');

var {
  getRoundRectPath
} = require('bpmn-js/lib/draw/BpmnRenderer');

var {
  is,
  getBusinessObject
} = require('bpmn-js/lib/util/ModelUtil');

var { isNil } = require('min-dash');

const TASK_BORDER_RADIUS = 2;

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
    element["type"] = "bpmn:Task";
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
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

    text = svgCreate('text');
    svgAttr(text, {
      x: 10,
      y: 25
    });
    svgAppend(text, document.createTextNode("Resource"));
    svgAppend(parentNode, text);

    return shape;
  }

  ResourceRenderer.prototype.getShapePath = function(shape) {
    if (is(shape, 'bpmn:Task')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return this.bpmnRenderer.getShapePath(shape);
  }

ResourceRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ];

module.exports = ResourceRenderer;