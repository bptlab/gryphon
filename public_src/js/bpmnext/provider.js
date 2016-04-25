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
var cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

var forEach = require('lodash/collection/forEach');
function generateProvider(fragmentid) {
    var dm = null;
    API.loadAssociatedDomainModel(fragmentid,function(dm2){
        dm = dm2;
    });

    function createDataObjectProperties(group, element,
                                        elementRegistry) {
        if (is(element, 'bpmn:DataObjectReference')) {
            var doEntry = entryFactory.textField({
                id: 'DataObjectDataClass',
                description: '',
                label: 'Dataclass',
                modelProperty: 'dataclass',
                set: function(element, values) {
                    var bo = getBusinessObject(element);
                    var res = {};
                    var prop = 'dataclass';
                    if (values[prop] !== '') {
                        //validator.validateDataClassName(values[prop]);
                        res[prop] = values[prop];
                        res['name'] = values[prop] + "[" + bo['state'] + "]"
                    } else {
                        res[prop] = undefined;
                    }
                    return cmdHelper.updateProperties(element, res);
                }
            });
            group.entries.push(doEntry);
            var stateEntry = entryFactory.textField({
                id: 'DataObjectState',
                description: '',
                label: 'State',
                modelProperty: 'state',
                set: function(element, values) {
                    var res = {};
                    var prop = 'state';
                    var bo = getBusinessObject(element);
                    if (values[prop] !== '') {
                        res[prop]   = values[prop];
                        res['name'] = bo['dataclass'] + "[" + values['state'] + "]"
                    } else {
                        res[prop] = undefined;
                    }
                    return cmdHelper.updateProperties(element, res);
                }
            });
            group.entries.push(stateEntry);
            var el = getBusinessObject(element);
            var dclass = el.get('dataclass');
            if (dclass != null && dm != null) {
                var dataclass = dm.dataclasses.filter(function(dataclass){
                    return dataclass.name == dclass
                });
                if (dataclass.length == 1) {
                    dataclass = dataclass[0];
                    dataclass.attributes.forEach(function(attr){
                        var jsonURLEntry = entryFactory.textField({
                            id: 'JSONPath' + attr.name,
                            description: '',
                            label: 'JSON Path for ' + attr.name,
                            modelProperty: attr.name,
                            get: function(element) {
                                var bo = getBusinessObject(element);
                                var js = bo.get('jsonpath');
                                if (js == undefined) {
                                    js = "{}";
                                }
                                var parsed = JSON.parse(js);
                                var res = {};
                                if (!(attr.name in parsed)) {
                                    parsed[attr.name] = "";
                                }
                                res[attr.name] = parsed[attr.name];
                                return res;
                            },
                            set: function(element, values) {
                                if (values[this.modelProperty] !== '') {
                                    var bo = getBusinessObject(element);
                                    var js = bo.get('jsonpath');
                                    if (js == undefined) {
                                        js = "{}";
                                    }
                                    var parsed = JSON.parse(js);
                                    parsed[attr.name] = values[attr.name];
                                    var res = {};
                                    res['jsonpath'] = JSON.stringify(parsed);
                                    return cmdHelper.updateProperties(element, res);
                                }
                                return cmdHelper.updateProperties(element, {});
                            }
                        });
                        group.entries.push(jsonURLEntry);
                    })
                }
            }
        }
    }

    function createMessageEventProperties(group, element, elementRegistry) {
        var types = [
            'bpmn:StartEvent',
            'bpmn:IntermediateCatchEvent',
            'bpmn:BoundaryEvent',
            'bpmn:ReceiveTask'
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
        });
        if (is(element, 'bpmn:ReceiveTask')) {
            var stateEntry = entryFactory.textField({
                id: 'EventQuery',
                description: '',
                label: 'Event-Query for UNICORN',
                modelProperty: 'eventquery'
            });
            group.entries.push(stateEntry);
        }
    }

    function createWebServiceTaskProperties(group, element, elementRegistry) {
        if (is(element, "bpmn:ServiceTask")) {
            var stateEntry = entryFactory.textField({
                id: 'WebServiceURL',
                description: '',
                label: 'Webservice to call (URL)',
                modelProperty: 'webserviceurl'
            });
            group.entries.push(stateEntry);
            stateEntry = entryFactory.textField({
                id: 'WebServiceMethod',
                description: '',
                label: 'Webservice to call (HTTP-Method)',
                modelProperty: 'webservicemethod'
            });
            group.entries.push(stateEntry);
            stateEntry = entryFactory.textField({
                id: 'WebServiceBody',
                description: '',
                label: 'Webservice to call (Body)',
                modelProperty: 'webservicebody'
            });
            group.entries.push(stateEntry);
        }
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
        createWebServiceTaskProperties(detailsGroup, element, bpmnFactory);
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

    return {
        __init__: [ 'propertiesProvider' ],
        propertiesProvider: [ 'type', Provider ]
    }
}
module.exports = generateProvider;
