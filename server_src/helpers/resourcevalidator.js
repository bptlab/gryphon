'use strict';
const fetch = require('node-fetch');

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
     * @returns {{resourceTasks: {}, dataObjects: {}}
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
    async validateEverything() {
        if (!this.needsValidation) {
            return true;
        }
        await this.validateResourceTaskDataAssociations();
        return this.messages;
    }

    /**
     * Validates the given graph for structural soundness.
     * @method validateSoundness
     * @returns {boolean}
     */
    async validateResourceTaskDataAssociations() {
        let errorsFound = false;

        for (const resourceTask in this.graph.resourceTasks) {
            const resourceConfiguration = this.graph.resourceTasks[resourceTask];
            const resp = await fetch("http://localhost:3500/methods/" + resourceConfiguration.method);
            const optimizationDefinition = await resp.json();
            optimizationDefinition.inputs.forEach(function (input) {
                if (!this.checkResourceTaskHasInputDOWithName(resourceTask, input.name)) {
                    errorsFound = true;
                    this.messages.push({
                        'text': 'The resource task \'' + resourceTask + '\' requires a DO of class \'' + input.name + '\' as input.',
                        'type': 'danger'
                    });
                }
            }.bind(this));
            optimizationDefinition.outputs.forEach(function (output) {
                if (!this.checkResourceTaskHasOutputDOWithName(resourceTask, output.name)) {
                    errorsFound = true;
                    this.messages.push({
                        'text': 'The resource task \'' + resourceTask + '\' requires a DO of class \'' + output.name + '\' as output.',
                        'type': 'danger'
                    });
                }
            }.bind(this));
        }

        if (errorsFound) {
            this.messages.push({
                'text': 'Resource Tasks configured correctly',
                'type': 'success'
            });
        }
    }

    /**
     * Checks if the task has a data object of the given class as input or output.
     * The class is matched by string (name of class).
     * 
     * @param {string} doType must be either 'dataInput' or 'dataOutput'
     * @param {string} resourceTaskId the name of the task that should be checked
     * @param {string} nameOfRequiredInput the name of the data object that the task should have as input or output (depends on doType)
     * @returns {boolean}
     */
    checkResourceTaskHasDOWithName(doType, resourceTaskId, nameOfRequiredInput) {
        if (!(doType in this.graph.resourceTasks[resourceTaskId])) {
            return false;
        }
        console.log('has ' + doType);
        for (const dataObject of this.graph.resourceTasks[resourceTaskId][doType]) {
            console.log(this.graph.dataObjects[dataObject].name);
            console.log(nameOfRequiredInput);
            if (dataObject in this.graph.dataObjects && this.graph.dataObjects[dataObject].name.startsWith(nameOfRequiredInput + '[')) {
                console.log(resourceTaskId + " has DO " + doType + "\'" + nameOfRequiredInput + "\'");
                return true;
            }
        }
        return false;
    }

    /**
     * @see checkResourceTaskHasDOWithName
     */
    checkResourceTaskHasInputDOWithName(resourceTaskId, nameOfRequiredInput) {
        return this.checkResourceTaskHasDOWithName('dataInput', resourceTaskId, nameOfRequiredInput);
    }
    /**
     * @see checkResourceTaskHasDOWithName
     */
    checkResourceTaskHasOutputDOWithName(resourceTaskId, nameOfRequiredInput) {
        return this.checkResourceTaskHasDOWithName('dataOutput', resourceTaskId, nameOfRequiredInput);
    }
};

module.exports = ResourceValidator;
