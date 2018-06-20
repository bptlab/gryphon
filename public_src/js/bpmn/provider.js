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

/**
 * The whole generation is encapsulated in an generator that provides a special
 * property-panel that is dependant on the fragment. This is done because the
 * information in the associated domainmodel is needed to evaluate entries.
 */
function generateProvider(fragmentid) {
    var dm = null;
    API.loadAssociatedDomainModel(fragmentid,function(dm2){
        dm = dm2;
    });

    /**
     * This function generates the 3 propertys dataclass and state for dataobjects.
     * It is more complicated then the other ones because every choice causes some things to happen.
     * In case the class or the state gets changed the displayed name gets also changed to ensure
     * that it is always up to date with the propertys. The 3rd entry, mapping is more complex.
     * The mapping property of an dataobject actually contains JSON. This JSON gets parsed and
     * for each entry there will be an different edit-field. In case one of the values gets changed
     * the value is regenerated and stored in the object.
     */
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
                        res[prop] = "";
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
                //The mapping can just be defined if the dataclass provided in the dataclass attribute contains the name of an actually existing class.
                if (dataclass.length == 1) {
                    dataclass = dataclass[0];
                    //For each attribute of the class there is one edit-field.
                    dataclass.attributes.forEach(function(attr){
                        var jsonURLEntry = entryFactory.textField({
                            id: 'JSONPath' + attr.name,
                            description: '',
                            label: 'JSON Path for ' + attr.name,
                            modelProperty: attr.name,
                            //The getter that parses the json-object and reads a certain class out of it.
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
                            //The setter that takes the new value and regenerates the JSON-objet and updates the property.
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

    /**
     * This function creates the custom event-query-editor for message-events and tasks
     */
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


    /**
     * This function creates the properties for the ScriptTask
     */
    function createScriptTaskProperties(group, element, elementRegistry) {
        if (is(element, "bpmn:ScriptTask")) {
            var stateEntry = entryFactory.textField({
                id: 'ScriptTaskJar',
                description: '',
                label: 'Script Jar File',
                modelProperty: 'scripttaskjar'
            });
            group.entries.push(stateEntry);
            stateEntry = entryFactory.textField({
                id: 'ScriptTaskClassPath',
                description: '',
                label: 'Script Task Class Path',
                modelProperty: 'scripttaskclasspath'
            });
            group.entries.push(stateEntry);
        }
    }

    /**
     * This function generates the additional fields WebServiceURL, Method and Body
     * In case the visitied object is an ServiceTask
     */
    function createWebServiceTaskProperties(group, element, elementRegistry) {
        if (is(element, "bpmn:ServiceTask")) {
            var stateEntry = entryFactory.textField({
                id: 'WebServiceURL',
                description: 'The URL of the web service that is called.',
                label: 'web service URL',
                modelProperty: 'webserviceurl'
            });
            group.entries.push(stateEntry);
            stateEntry = entryFactory.textField({
                id: 'WebServiceMethod',
                description: 'The HTTP method that should be used, e.g. GET or POST.',
                label: 'HTTP method',
                modelProperty: 'webservicemethod'
            });
            group.entries.push(stateEntry);
            stateEntry = entryFactory.textField({
                id: 'WebServiceBody',
                description: 'The body that is send to the web service. This should be a JSON object.',
                label: 'body (optional)',
                modelProperty: 'webservicebody'
            });
            group.entries.push(stateEntry);
	    stateEntry = entryFactory.textField({
                id: 'WebServiceHeader',
                description: 'The header that is sent to the web service. This should be a JSON object.',
                label: 'header (optional)',
                modelProperty: 'webserviceheader'
            });
            group.entries.push(stateEntry);

        }
    }

     /**
     * This function generates the additional field TaskRole
     * In case the visitied object is a Task but neither a
     * ServiceTask, SendTask, or ReceiveTask
     */
    function createTaskProperties(group, element, elementRegistry) {
        if (is(element, "bpmn:Task") &&
	    !is(element, "bpmn:ServiceTask") &&
	    !is(element, "bpmn:SendTask")
   	    !is(element, "bpmn:ReceiveTask")) {
            var stateEntry = entryFactory.textField({
                id: 'TaskRole',
                description: 'The role required to execute this task.',
                label: 'required role for task',
                modelProperty: 'taskrole'
            });
            group.entries.push(stateEntry);
	}
    }
   
    /**
     * This function generates the general-tab for the propertys panel.
     * It uses a lot of function created by bpmn-js and the 4 custom generators
     * createWebServiceTaskProperties, createMessageEventProperties,
     * createDataObjectProperties, and createTaskProperties to generate the
     * custom elements for gryphon. It returns all generated groups.
     */
    function createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate) {

        var generalGroup = {
            id: 'general',
            label: 'General',
            entries: []
        };
        idProps(generalGroup, element, translate);
        processProps(generalGroup, element, translate);

        var detailsGroup = {
            id: 'details',
            label: 'Details',
            entries: []
        };
        linkProps(detailsGroup, element, translate);
        eventProps(detailsGroup, element, bpmnFactory, translate);
        createDataObjectProperties(detailsGroup, element, bpmnFactory, translate);
        createMessageEventProperties(detailsGroup, element, bpmnFactory, translate);
        createWebServiceTaskProperties(detailsGroup, element, bpmnFactory, translate);
        createScriptTaskProperties(detailsGroup, element, bpmnFactory, translate);
        createTaskProperties(detailsGroup, element, bpmnFactory, translate);

        var documentationGroup = {
            id: 'documentation',
            label: 'Documentation',
            entries: []
        };

        documentationProps(documentationGroup, element, bpmnFactory, translate);

        return[
            generalGroup,
            detailsGroup,
            documentationGroup
        ];

    }

    function Provider(eventBus, bpmnFactory, elementRegistry, translate) {

        PropertiesActivator.call(this, eventBus);

        this.getTabs = function(element) {

            //This function generates the only tab in the propertys panel.
            var generalTab = {
                id: 'general',
                label: 'General',
                groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate)
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
