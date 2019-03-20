var inherits = require('inherits'); 
 
var BaseRenderer = require('diagram-js/lib/draw/BaseRenderer'); 
 
var { 
  append: svgAppend, 
  attr: svgAttr, 
  classes: svgClasses, 
  create: svgCreate 
} = require('tiny-svg'); 
 
var RenderUtil = require('diagram-js/lib/util/RenderUtil'); 
 
var componentsToPath = RenderUtil.componentsToPath; 
 
var {getBusinessObject, is} = require('bpmn-js/lib/util/ModelUtil'); 
 
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
 
  svgClasses(text).add('djs-label'); 
 
  svgAppend(text, document.createTextNode(resource)); 
 
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
    fill: '#FFC83D' 
  }); 
 
  svgAppend(parentNode, rect); 
 
  return rect; 
} 
 
function getRoundRectPath(shape, borderRadius) { 
 
  var x = shape.x, 
      y = shape.y, 
      width = shape.width, 
      height = shape.height; 
 
  var roundRectPath = [ 
    ['M', x + borderRadius, y], 
    ['l', width - borderRadius * 2, 0], 
    ['a', borderRadius, borderRadius, 0, 0, 1, borderRadius, borderRadius], 
    ['l', 0, height - borderRadius * 2], 
    ['a', borderRadius, borderRadius, 0, 0, 1, -borderRadius, borderRadius], 
    ['l', borderRadius * 2 - width, 0], 
    ['a', borderRadius, borderRadius, 0, 0, 1, -borderRadius, -borderRadius], 
    ['l', 0, borderRadius * 2 - height], 
    ['a', borderRadius, borderRadius, 0, 0, 1, borderRadius, -borderRadius], 
    ['z'] 
  ]; 
 
  return componentsToPath(roundRectPath); 
} 
 
module.exports = ResourceRenderer;