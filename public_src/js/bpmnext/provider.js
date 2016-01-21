// bpmn properties
var inherits = require('inherits');

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
function createDataObjectProperties(group, element, elementRegistry) {
    console.log(element);
    if (is(element, 'bpmn:DataObjectReference')) {
        var stateEntry = entryFactory.textField({
            id: 'DataObjectState',
            description: '',
            label: 'State',
            modelProperty: 'state'
        });
        group.entries.push(stateEntry);
    }
}

function createMessageEventProperties(group, element, elementRegistry) {
    console.log(element);
    var types = [
        'bpmn:StartEvent',
        'bpmn:IntermediateThrowEvent',
        'bpmn:BoundaryEvent'
    ];
    forEach(types, function(type) {
        if (is(element, type)) {
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
