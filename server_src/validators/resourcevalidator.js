'use strict';
const fetch = require('node-fetch');
const { arrayGetUniqueElements } = require('./../helpers/array');

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
    constructor(bpmnObject, dm) {
        this.bpmnObject = bpmnObject;
        this.messages = [];
        this.resourceDataModels = this.parseResourceDataModels(dm.dataclasses);
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
    * Returns an object containing the data models of resources defined in this scenario, data model names are the keys, value the data model configuration.
    * Example:
    * {
    *   Parcel: {
    *     name: 'Parcel',
    *     isEvent: false,
    *     isResource: true,
    *     resource_id: '5d14c4e61b0b6d2cd4b4c549'
    *   }
    * }
    *
    * @methode parseResourceDataModels
    * @param dataModel {Array}
    * @returns {}
    */
    parseResourceDataModels(dataModel) {
        const resourceDataModels = {};

        dataModel.filter(function (dataModel) {
            return dataModel.is_resource;
        }).forEach(function (dataModel) {
            dataModel.olc = undefined;
            dataModel.attributes = undefined;
            resourceDataModels[dataModel.name] = dataModel;
        });
        
        return resourceDataModels;
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
            ['name', 'host', 'method', 'problem'].forEach((attribute) => {
                if (attribute in resourceTask) {
                    newResourceTask[attribute] = resourceTask[attribute];
                }
            });
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
        await this.validateResourceTasksDataAssociations();
        return this.messages;
    }

    /**
     * Validates the given graph for structural soundness.
     * @method validateSoundness
     * @returns {boolean}
     */
    async validateResourceTasksDataAssociations() {
        const executedTaskValidation = [];
        for (const resourceTask in this.graph.resourceTasks) {
            executedTaskValidation.push(this.validateResourceTaskDataAssociations(resourceTask));
        }
        const resolvedTaskValidation = await Promise.all(executedTaskValidation);
        if (! resolvedTaskValidation.some(validationSucceeded => !validationSucceeded)) {
            this.messages.push({
                'text': 'Resource Tasks configured correctly',
                'type': 'success'
            });
        }
    }

    async validateResourceTaskDataAssociations(resourceTaskName) {
        let isValid = false;
        const resourceConfiguration = this.graph.resourceTasks[resourceTaskName];
        const resourceTaskIdentifier = ('name' in resourceConfiguration) ? resourceConfiguration.name : resourceTaskName;
        const resp = await fetch("http://localhost:3500/methods/" + resourceConfiguration.method);
        const optimizationDefinition = await resp.json();

        // Only resource data objects are considered!
        const optimizationTask = {
            inputs: [],
            outputs: []
        };

        const chosenOptimization = {
            inputs: [],
            outputs: [],
        };

        optimizationTask.inputs = this.getResourceDataObjectsConntectedWithResourceTask('dataInput', resourceTaskName);
        optimizationTask.outputs = this.getResourceDataObjectsConntectedWithResourceTask('dataOutput', resourceTaskName);

        optimizationDefinition.inputs.forEach(function (input) {
            chosenOptimization.inputs.push(input.id);
        }.bind(this));
        optimizationDefinition.outputs.forEach(function (output) {
            chosenOptimization.outputs.push(output.id);
        }.bind(this));

        const superfluousTaskInputs = arrayGetUniqueElements(optimizationTask.inputs, chosenOptimization.inputs);
        const missingTaskInputs = arrayGetUniqueElements(chosenOptimization.inputs, optimizationTask.inputs);
        const superfluousTaskOutputs = arrayGetUniqueElements(optimizationTask.outputs, chosenOptimization.outputs);
        const missingTaskOutputs = arrayGetUniqueElements(chosenOptimization.outputs, optimizationTask.outputs);

        // It is not an error if there are additional, unnecessary data inputs
        if ((missingTaskInputs.length + superfluousTaskOutputs.length + missingTaskOutputs.length) === 0) {
            isValid = true;
        }

        superfluousTaskInputs.forEach(function(element) {
            this.messages.push({
                'text': `Resource Task '${resourceTaskIdentifier}' does not need ${element} as input.`,
                'type': 'warning'
            });
        }.bind(this));
        missingTaskInputs.forEach(function(element) {
            this.messages.push({
                'text': `Resource Task '${resourceTaskIdentifier}' needs ${element} as input.`,
                'type': 'danger'
            });
        }.bind(this));
        superfluousTaskOutputs.forEach(function(element) {
            this.messages.push({
                'text': `Resource Task '${resourceTaskIdentifier}' does not produce ${element} as output.`,
                'type': 'danger'
            });
        }.bind(this));
        missingTaskOutputs.forEach(function(element) {
            this.messages.push({
                'text': `Resource Task '${resourceTaskIdentifier}' requires ${element} as output.`,
                'type': 'danger'
            });
        }.bind(this));

        return isValid;
    }


    /**
     * Iterates over all input or output data objects connected to the given resource task.
     * While iterating, if the current data object is an instance of a resource data model, the resource id is appended to a list.
     * This list is returned in the end.
     * The data objects and data models are matched by string (name of class, case insensitive).
     *
     * @param {string} doType must be either 'dataInput' or 'dataOutput'
     * @param {string} resourceTaskName the name of the task that should be checked
     * @returns {array} of resource ids which are connected as either input or output (depending on provided doType)
     */
    getResourceDataObjectsConntectedWithResourceTask(doType, resourceTaskName) {
        const resourceDataObjects = [];

        if (!(doType in this.graph.resourceTasks[resourceTaskName])) {
            return resourceDataObjects;
        }

        for (const dataObject of this.graph.resourceTasks[resourceTaskName][doType]) {
            if (!(dataObject in this.graph.dataObjects)) {
                continue;
            }
            const dataObjectClassNameInFragment = this.graph.dataObjects[dataObject]['griffin:dataclass'];
            if (!(dataObjectClassNameInFragment in this.resourceDataModels)) {
                continue;
            }
            resourceDataObjects.push(this.resourceDataModels[dataObjectClassNameInFragment].resource_id);
        }
        return resourceDataObjects;
    }
};

module.exports = ResourceValidator;
