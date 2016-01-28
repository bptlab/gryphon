// bpmn properties
var inherits = require('inherits');

var API = require('./../api');

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var processProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps'),
    eventProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps'),
    linkProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps'),
    documentationProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps'),
    idProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps');

var is = require('bpmn-js/lib/util/ModelUtil').is;

var forEach = require('lodash/collection/forEach');
function createDataObjectProperties(group, element,
                                    elementRegistry) {
    if (is(element, 'bpmn:DataObjectReference')) {
        var stateEntry = entryFactory.textField({
            id: 'DataObjectState',
            description: '',
            label: 'State',
            modelProperty: 'state'
        });
        group.entries.push(stateEntry);
        var doEntry = entryFactory.textField({
            id: 'DataObjectDataClass',
            description: '',
            label: 'Dataclass',
            modelProperty: 'dataclass',
            /** set: function(element, values) {
                var res = {};
                var prop = 'dataclass';
                if (values[prop] !== '') {
                    res[prop] = values[prop];
                } else {
                    res[prop] = undefined;
                }

                return res;
            } */
        });
        group.entries.push(doEntry)
    }
}

function createMessageEventProperties(group, element, elementRegistry) {
    var types = [
        'bpmn:StartEvent',
        'bpmn:IntermediateCatchEvent',
        'bpmn:BoundaryEvent'
    ];
    var bo = getBusinessObject(element);
    forEach(types, function(type) {
        if (is(element, type) && 'eventDefinitions' in bo && is(bo.eventDefinitions[0],'bpmn:MessageEventDefinition')) {
            var stateEntry = entryFactory.textField({
                id: 'EventQuery',
                description: '',
                label: 'Event-Query for UNICORN',
                modelProperty: 'eventquery'
            });
            group.entries.push(stateEntry);
        }
    })
}

function createGeneralTabGroups(element, bpmnFactory, elementRegistry) {

    var generalGroup = {
        id: 'general',
        label: 'General',
        entries: []
    };
    idProps(generalGroup, element, elementRegistry);
    processProps(generalGroup, element);

    var detailsGroup = {
        id: 'details',
        label: 'Details',
        entries: []
    };
    linkProps(detailsGroup, element);
    eventProps(detailsGroup, element, bpmnFactory);
    createDataObjectProperties(detailsGroup, element, bpmnFactory);
    createMessageEventProperties(detailsGroup, element, bpmnFactory);
    var documentationGroup = {
        id: 'documentation',
        label: 'Documentation',
        entries: []
    };

    documentationProps(documentationGroup, element, bpmnFactory);

    return[
        generalGroup,
        detailsGroup,
        documentationGroup
    ];

}

function Provider(eventBus, bpmnFactory, elementRegistry) {

    PropertiesActivator.call(this, eventBus);

    this.getTabs = function(element) {

        var generalTab = {
            id: 'general',
            label: 'General',
            groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry)
        };

        return [
            generalTab
        ];
    };
}

inherits(Provider, PropertiesActivator);

module.exports = Provider;
