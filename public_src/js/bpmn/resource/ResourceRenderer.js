var inherits = require('inherits');

var BaseRenderer = require('diagram-js/lib/draw/BaseRenderer');

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


inherits(ResourceRenderer, BaseRenderer); 

function ResourceRenderer(eventBus, bpmnRenderer) {
    BaseRenderer.call(this, eventBus, 2000); 

    this.bpmnRenderer = bpmnRenderer;
  }

  ResourceRenderer.prototype.canRender = function(element) {
    return /^resource:/.test(element.type);
  }

  ResourceRenderer.prototype.drawShape = function(parentNode, element) {
    element["type"] = "bpmn:Task";
    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    svgAppend(parentNode, shape);
    var text = svgCreate('text');

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