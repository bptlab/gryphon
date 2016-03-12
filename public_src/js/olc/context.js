'use strict';

var assign = require('lodash/object/assign'),
    forEach = require('lodash/collection/forEach'),
    isArray = require('lodash/lang/isArray'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny,
    getChildLanes = require('bpmn-js/lib/features/modeling/util/LaneUtil').getChildLanes,
    isEventSubProcess = require('bpmn-js/lib/util/DiUtil').isEventSubProcess;

/**
 * A provider for BPMN 2.0 elements context pad
 */
function ContextPadProvider(contextPad, modeling, elementFactory,
                            connect, create, bpmnReplace,
                            canvas) {

    contextPad.registerProvider(this);

    this._contextPad = contextPad;

    this._modeling = modeling;

    this._elementFactory = elementFactory;
    this._connect = connect;
    this._create = create;
    this._bpmnReplace = bpmnReplace;
    this._canvas  = canvas;
}

ContextPadProvider.$inject = [
    'contextPad',
    'modeling',
    'elementFactory',
    'connect',
    'create',
    'bpmnReplace',
    'canvas'
];

module.exports = ContextPadProvider;


ContextPadProvider.prototype.getContextPadEntries = function(element) {

    var contextPad = this._contextPad,
        modeling = this._modeling,

        elementFactory = this._elementFactory,
        connect = this._connect,
        create = this._create,
        bpmnReplace = this._bpmnReplace,
        canvas = this._canvas;

    var actions = {};

    if (element.type === 'label') {
        return actions;
    }

    var businessObject = element.businessObject;

    function startConnect(event, element, autoActivate) {
        connect.start(event, element, autoActivate);
    }

    function removeElement(e) {
        modeling.removeElements([ element ]);
    }

    function appendAction(type, className, options) {

        function appendListener(event, element) {

            var shape = elementFactory.createShape(assign({ type: type }, options));
            create.start(event, shape, element);
        }

        var shortType = type.replace(/^bpmn\:/, '');

        return {
            group: 'model',
            className: className,
            title: 'Append ' + shortType,
            action: {
                dragstart: appendListener,
                click: appendListener
            }
        };
    }

    function splitLaneHandler(count) {

        return function(event, element) {
            // actual split
            modeling.splitLane(element, count);

            // refresh context pad after split to
            // get rid of split icons
            contextPad.open(element, true);
        };
    }

    if (is(businessObject, 'bpmn:FlowNode')) {

        if (!is(businessObject, 'bpmn:EndEvent') &&
            !is(businessObject, 'bpmn:EventBasedGateway') &&
            !isEventType(businessObject, 'bpmn:IntermediateThrowEvent', 'bpmn:LinkEventDefinition') &&
            !isEventSubProcess(businessObject)) {

            assign(actions, {
                'append.append-task': appendAction('bpmn:Task', 'bpmn-icon-task')
            });
        }


    }

    if (isAny(businessObject, [ 'bpmn:FlowNode', 'bpmn:InteractionNode' ])) {

        assign(actions, {
            'append.text-annotation': appendAction('bpmn:TextAnnotation', 'bpmn-icon-text-annotation'),

            'connect': {
                group: 'connect',
                className: 'bpmn-icon-connection-multi',
                title: 'Connect using Sequence/MessageFlow',
                action: {
                    click: startConnect,
                    dragstart: startConnect
                }
            }
        });
    }

    // Delete Element Entry
    assign(actions, {
        'delete': {
            group: 'edit',
            className: 'bpmn-icon-trash',
            title: 'Remove',
            action: {
                click: removeElement,
                dragstart: removeElement
            }
        }
    });

    return actions;
};

function isEventType(eventBo, type, definition) {

    var isType = eventBo.$instanceOf(type);
    var isDefinition = false;

    var definitions = eventBo.eventDefinitions || [];
    forEach(definitions, function(def) {
        if (def.$type === definition) {
            isDefinition = true;
        }
    });

    return isType && isDefinition;
}

module.exports = {
    contextPadProvider: [ 'type', ContextPadProvider ]
};
