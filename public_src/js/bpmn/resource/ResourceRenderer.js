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

var TASK_BORDER_RADIUS = 10; 


function ResourceRenderer(eventBus) { 
  BaseRenderer.call(this, eventBus, 2000); 
} 

inherits(ResourceRenderer, BaseRenderer); 

ResourceRenderer.$inject = [ 'eventBus', 'styles' ]; 

ResourceRenderer.prototype.canRender = function(element) { 
  return /^resource:/.test(element.type);
}; 

ResourceRenderer.prototype.drawShape = function(parentNode, element) {
  var businessObject = element.businessObject,
      resource = businessObject.resource;

  var width = element.width,
      height = element.height;

  var rect = drawRect(parentNode, width, height, TASK_BORDER_RADIUS);

  svgAppend(parentNode, rect);

  var text = svgCreate('text');

  svgAttr(text, {
    x: 10,
    y: 25
  });


  svgAppend(text, document.createTextNode("Resource"));

  svgAppend(parentNode, text);

  return rect;
};

ResourceRenderer.prototype.getShapePath = function(shape) {
  return getRoundRectPath(shape, TASK_BORDER_RADIUS);
};

function drawRect(parentNode, width, height, borderRadius) {
  var rect = svgCreate('rect');

  svgAttr(rect, {
    x: 0,
    y: 0,
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: 'black',
    strokeWidth: 2,
    fill: '#FFFFFF'
  });

  svgAppend(parentNode, rect);

  return rect;
}

module.exports = ResourceRenderer;