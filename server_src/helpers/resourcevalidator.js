'use strict';
var Scenario = require('./../models/scenario').model;
var parseToBPMNObject = require('./json').parseToBPMNObject;
var parseToOLC = require('./json').parseToOLC;

/**
 * An validator that checks a fragment with resource activities whether all required data objects are connected.
 *
 * @class ResourceValidator
 * @type {{new(*=): {parseSequenceFlowReverse: (function(Array): {}), validateEverything: (function(): boolean), validateStartEvents: (function(*): boolean), parseIntoGraph: (function(*): {startEvents: Array, endEvents: Array, adjacencyList: {}, reverseList: {}}), parseNodes: (function(Array): Function), validateEndEvents: (function(*): boolean), validateSoundness: (function(*): boolean), parseSequenceFlow: (function(Array): {})}}}
 */
var ResourceValidator = class {
    /**
     * Initiates the resource validator with the given fragment.
     * @method constructor
     * @param bpmnObject
     */
    constructor(bpmnObject) {
        this.bpmnObject = bpmnObject;
        this.messages = [];
        this.graph = this.parseIntoGraph(bpmnObject);
        this.needsValidation = true;
    }

    /**
     * Creates an graph out of the given fragment, including all start end end-nodes and adjecency lists in both directions.
     * @methode parseIntoGraph
     * @param bpmnObject
     * @returns {{startEvents: Array, endEvents: Array, adjacencyList: {}, reverseList: {}}}
     */
    parseIntoGraph(bpmnObject) {
        let resourceTasks = {};
        let dataObjects = {};

        if (bpmnObject['resource:resourceTask'] == undefined) {
            this.needsValidation = false;
            return {};
        }

        resourceTasks = this.parseResourceTasks(bpmnObject['resource:resourceTask']);

        if (Array.isArray(bpmnObject.dataObjectReference)) {
            dataObjects = this.parseDataObjects(bpmnObject.dataObjectReference);
        }

        return {
            resourceTasks: resourceTasks,
            dataObjects: dataObjects
        }
    }

    /**
     * Returns an object containing resource tasks, resource task ids are the keys, value includes resource task configuration and incoming and outgoing data object associations.
     * Example:
     * {
     *   ResourceTask_0d8zznp: {
     *     host: undefined,
     *     method: '1',
     *     problem: '1',
     *     dataInput:
     *       [ 'DataObjectReference_144bl6d', 'DataObjectReference_0cs52v3' ],
     *     dataOutput: 
     *       [ 'DataObjectReference_1o6uebw' ]
     *   }
     * }
     * 
     * @method parseResourceTasks
     * @param node_list {Array}
     * @returns {}
     */
    parseResourceTasks(node_list) {
        const resourceTasks = {};

        node_list.forEach((resourceTask) => {
            const newResourceTask = {};
            newResourceTask.host = resourceTask.host;            
            newResourceTask.method = resourceTask.method;            
            newResourceTask.problem = resourceTask.problem;
            if (Array.isArray(resourceTask.dataInputAssociation)) {
                newResourceTask.dataInput = resourceTask.dataInputAssociation.map((inputAssociation) => {
                    return inputAssociation.sourceRef[0];
                });
            }
            if (Array.isArray(resourceTask.dataOutputAssociation)) {
                newResourceTask.dataOutput = resourceTask.dataOutputAssociation.map((outputAssociation) => {
                    return outputAssociation.targetRef[0];
                });
            }

            resourceTasks[resourceTask.id] = newResourceTask;
        });

        return resourceTasks;
    }

    /**
     * Returns an object containing the data objects of the fragment, DO ids are the keys, value includes state and dataclass, as well as the name.
     * Example:
     * {
     *   DataObjectReference_144bl6d: {
     *     name: 'Parcel[undefined]',
     *     dataObjectRef: 'DataObject_0te5ax1',
     *     'griffin:state': 'undefined',
     *     'griffin:dataclass': 'Parcel'
     *   }
     * }
     * 
     * @methode parseDataObjects
     * @param dataObjects {Array}
     * @returns {}
     */
    parseDataObjects(dataObjectsList) {
        const dataObjects = {};
        dataObjectsList.forEach((dataObject) => {
            const newDataObject = dataObject;
            dataObjects[dataObject.id] = newDataObject;
            delete newDataObject.id;
        });
        return dataObjects;
    }

    /**
     * Validates all given features. This function does not check for soundness if the start and end-event requirements
     * are not fulfilled.
     * @method validateEverything
     * @returns {boolean}
     */
    validateEverything() {
        if (!this.needsValidation) {
            return true;
        }
        return this.validateResourceTaskDataAssiciations(this.graph);
    }

    /**
     * Validates the given graph for structural soundness.
     * @method validateSoundness
     * @param graph
     * @returns {boolean}
     */
    validateResourceTaskDataAssiciations(graph) {
        console.log(graph);
        let errorsFound = false;

        

        if (errorsFound) {
            this.messages.push({
                'text': 'You have a misconfiguration in your Resource Tasks incoming/outgoing data objects',
                'type': 'danger'
            });
            return true;
        } else {
            this.messages.push({
                'text': 'Resource Tasks configured correctly',
                'type': 'success'
            });
            return false;
        }
    }
};

module.exports = ResourceValidator;
