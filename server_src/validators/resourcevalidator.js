'use strict';
const { arrayGetUniqueElements } = require('./../helpers/array');
const ResourceApi = require('./../helpers/resourceApi');

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

        const optimizationDefinition = await ResourceApi.getOptimizations(resourceConfiguration.method);

        // Only resource data objects are considered!
        const optimizationTask = {
            inputs: [],
            outputs: []
        };

        optimizationTask.inputs = this.getResourceTypeIdConntectedWithResourceTask('dataInput', resourceTaskName);
        optimizationTask.outputs = this.getResourceTypeIdConntectedWithResourceTask('dataOutput', resourceTaskName);

        const superfluousTaskInputs = arrayGetUniqueElements(optimizationTask.inputs.resourceTypes, optimizationDefinition.inputs);
        const missingTaskInputs = arrayGetUniqueElements(optimizationDefinition.inputs, optimizationTask.inputs.resourceTypes);
        const superfluousTaskOutputs = arrayGetUniqueElements(optimizationTask.outputs.resourceTypes, optimizationDefinition.outputs);
        const missingTaskOutputs = arrayGetUniqueElements(optimizationDefinition.outputs, optimizationTask.outputs.resourceTypes);

        // It is not an error if there are additional, unnecessary data inputs
        if ((missingTaskInputs.length + superfluousTaskOutputs.length + missingTaskOutputs.length) === 0) {
            isValid = true;
        }

        superfluousTaskInputs.forEach(function(element) {
            this.messages.push({
                'text': `Resource Task '${resourceTaskIdentifier}' does not need resource data object '${this.tryToFindNameForResourceTypeId(element)}' as input.`,
                'type': 'warning'
            });
        }.bind(this));
        missingTaskInputs.forEach(function(element) {
            this.messages.push({
                'text': `Resource Task '${resourceTaskIdentifier}' needs resource data object '${this.tryToFindNameForResourceTypeId(element)}' as input.`,
                'type': 'danger'
            });
        }.bind(this));
        superfluousTaskOutputs.forEach(function(element) {
            this.messages.push({
                'text': `Resource Task '${resourceTaskIdentifier}' does not produce resource data object '${this.tryToFindNameForResourceTypeId(element)}' as output.`,
                'type': 'danger'
            });
        }.bind(this));
        missingTaskOutputs.forEach(function(element) {
            this.messages.push({
                'text': `Resource Task '${resourceTaskIdentifier}' requires resource data object '${this.tryToFindNameForResourceTypeId(element)}' as output.`,
                'type': 'danger'
            });
        }.bind(this));
        optimizationTask.inputs.otherDataObjects.forEach(function(element) {
            this.messages.push({
                'text': `Resource Task '${resourceTaskIdentifier}' does not need data object '${element}' as input.`,
                'type': 'warning'
            });
        }.bind(this));
        optimizationTask.outputs.otherDataObjects.forEach(function(element) {
            this.messages.push({
                'text': `Resource Task '${resourceTaskIdentifier}' does not produce data object '${element}' as output.`,
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
    getResourceTypeIdConntectedWithResourceTask(doType, resourceTaskName) {
        const resourceTypeIds = [];
        const otherDataObjectNames = [];

        if (!(doType in this.graph.resourceTasks[resourceTaskName])) {
            return {
                resourceTypes: [],
                otherDataObjects: []
            };
        }

        for (const dataObject of this.graph.resourceTasks[resourceTaskName][doType]) {
            if (!(dataObject in this.graph.dataObjects)) {
                continue;
            }
            const dataObjectClassNameInFragment = this.graph.dataObjects[dataObject]['griffin:dataclass'];
            if (!(dataObjectClassNameInFragment in this.resourceDataModels)) {
                otherDataObjectNames.push(dataObjectClassNameInFragment);
            } else {
                resourceTypeIds.push(this.resourceDataModels[dataObjectClassNameInFragment].resource_id);
            }
        }
        return {
            resourceTypes: resourceTypeIds,
            otherDataObjects: otherDataObjectNames,
        };
    }

    tryToFindNameForResourceTypeId(typeId) {
        // Search if there already is a defined data model in this scenario, based on the given resource type id
        let typeDefinition = Object.values(this.resourceDataModels).find(function (resourceDataModel) {
            return resourceDataModel.resource_id === typeId;
        });
        if (typeDefinition) {
            return typeDefinition.name;
        }

        return 'Resourcetype with id ' + typeId;
    }
};

module.exports = ResourceValidator;
