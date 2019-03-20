var inherits = require('inherits');
var ReplaceMenuProvider = require('bpmn-js/lib/features/popup-menu/ReplaceMenuProvider');

var is = require('bpmn-js/lib/util/ModelUtil').is;
var bind = require('min-dash').bind;

function CustomReplaceMenuProvider(injector, connect, translate) {

  injector.invoke(ReplaceMenuProvider, this);

  var cached = bind(this.getEntries, this);

  this.getEntries = function (element) {

    var entries = cached(element);

    var businessObject = element.businessObject;

    if (is(businessObject, 'bpmn:Task')) {
      entries.push(this._createMenuEntry(  {
        label: 'Resource Task',
        actionName: 'replace-with-resource-task',
        className: 'bpmn-icon-send',
        target: {
          type: 'bpmn:ResourceTask'
        }
      }, element));
    }
      
    return entries;
  };
};

inherits(CustomReplaceMenuProvider, ReplaceMenuProvider);

CustomReplaceMenuProvider.$inject = [
  'injector',
  'connect',
  'translate'
];

module.exports = CustomReplaceMenuProvider;
