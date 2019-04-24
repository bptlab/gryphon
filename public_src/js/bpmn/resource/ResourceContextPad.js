function ResourceContextPad (bpmnFactory, config, contextPad, create, elementFactory, injector, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    contextPad.registerProvider(this);
  }

  ResourceContextPad.prototype.getContextPadEntries = function(element) {
    const {
      autoPlace,
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

    function appendResourceTask() {
      return function(event, element) {
        if (autoPlace) {
          const businessObject = bpmnFactory.create('resource:ResourceTask');
    
          const shape = elementFactory.createShape({
            type: 'resource:ResourceTask',
            businessObject: businessObject
          });
    
          autoPlace.append(element, shape);
        } else {
          appendResourceTaskStart(event, element);
        }
      }
    }

    function appendResourceTaskStart() {
      return function(event) {
        const businessObject = bpmnFactory.create('resource:ResourceTask');

        const shape = elementFactory.createShape({
          type: 'resource:ResourceTask',
          businessObject: businessObject
        });

        create.start(event, shape, element);
      }
    }

    return {
      'append.resource-task': {
        group: 'model',
        className: 'bpmn-icon-task red',
        title: translate('Append Resource Task'),
        action: {
          click: appendResourceTask(),
          dragstart: appendResourceTaskStart()
        }
      },
    };
  }


ResourceContextPad.$inject = [
  'bpmnFactory',
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate'
];

module.exports = ResourceContextPad;