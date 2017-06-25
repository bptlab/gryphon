'use strict';
var Scenario = require('./../models/scenario').model;
var parseToBPMNObject = require('./json').parseToBPMNObject;
var parseToOLC = require('./json').parseToOLC;

/**
 * An validator that checks a fragment for structural soundness.
 *
 * @class SoundnessValidator
 * @type {{new(*=): {parseSequenceFlowReverse: (function(Array): {}), validateEverything: (function(): boolean), validateStartEvents: (function(*): boolean), parseIntoGraph: (function(*): {startEvents: Array, endEvents: Array, adjacencyList: {}, reverseList: {}}), parseNodes: (function(Array): Function), validateEndEvents: (function(*): boolean), validateSoundness: (function(*): boolean), parseSequenceFlow: (function(Array): {})}}}
 */
var SoundnessValidator = class {
    /**
     * Initiates the soundness validator with the given fragment.
     * @method constructor
     * @param bpmnObject
     */
    constructor(bpmnObject) {
        this.bpmnObject = bpmnObject;
        this.messages = [];
        this.graph = this.parseIntoGraph(bpmnObject);
    }

    /**
     * Creates an graph out of the given fragment, including all start end end-nodes and adjecency lists in both directions.
     * @methode parseIntoGraph
     * @param bpmnObject
     * @returns {{startEvents: Array, endEvents: Array, adjacencyList: {}, reverseList: {}}}
     */
    parseIntoGraph(bpmnObject) {
        var nodes = {};
        var nodes_reverse = {};

        var startEvents = [];
        if (bpmnObject.startEvent != undefined) {
            bpmnObject.startEvent.forEach(this.parseNodes(startEvents));
        }

        var endEvents = [];
        if (bpmnObject.endEvent != undefined) {
            bpmnObject.endEvent.forEach(this.parseNodes(endEvents));
        }

        if (bpmnObject.sequenceFlow != undefined) {
            nodes = this.parseSequenceFlow(bpmnObject.sequenceFlow);
            nodes_reverse = this.parseSequenceFlowReverse(bpmnObject.sequenceFlow)
        }
        if (bpmnObject.boundaryEvent != undefined) {
            bpmnObject.boundaryEvent.forEach(function(boundaryEvent){
                if (nodes[boundaryEvent.attachedToRef] == undefined) {
                    nodes[boundaryEvent.attachedToRef] = []
                }
                nodes[boundaryEvent.attachedToRef].push(boundaryEvent.id);

                if (nodes_reverse[boundaryEvent.id] == undefined) {
                    nodes_reverse[boundaryEvent.id] = []
                }
                nodes_reverse[boundaryEvent.id].push(boundaryEvent.attachedToRef)
            })
        }

        return {
            startEvents: startEvents,
            endEvents: endEvents,
            adjacencyList: nodes,
            reverseList: nodes_reverse
        }
    }

    /**
     * Returns a function that appends the ID of the element given to the returned function to the array gien to this
     * method.
     * @method parseNodes
     * @param node_list {Array}
     * @returns {Function}
     */
    parseNodes(node_list) {
        return function(element) {
            node_list.push(element.id)
        }
    }

    /**
     * Creates an adjacency list for the given sequence-flows.
     *
     * @methode parseSequenceFlow
     * @param sequenceFlow {Array} A list of sequence flows.
     * @returns {{}}
     */
    parseSequenceFlow(sequenceFlow) {
        var nodes = {};
        sequenceFlow.forEach(function(flow){
            if (nodes[flow.sourceRef] == undefined) {
                nodes[flow.sourceRef] = []
            }
            nodes[flow.sourceRef].push(flow.targetRef);
        });
        return nodes;
    }

    /**
     * Creates an adjacency list for the given sequence-flows. The sequence flows are reversed before read,
     * this method creates an reversed adjacency list.
     * @method parseSequenceFlowReverse
     * @param sequenceFlow {Array} A list of sequence flows.
     * @returns {{}}
     */
    parseSequenceFlowReverse(sequenceFlow) {
        var nodes = {};
        sequenceFlow.forEach(function(flow){
            if (nodes[flow.targetRef] == undefined) {
                nodes[flow.targetRef] = []
            }
            nodes[flow.targetRef].push(flow.sourceRef);
        });
        return nodes;
    }

    /**
     * Validates all given features. This function does not check for soundness if the start and end-event requirements
     * are not fulfilled.
     * @method validateEverything
     * @returns {boolean}
     */
    validateEverything() {
        if(this.validateStartEvents(this.graph.startEvents)&&this.validateEndEvents(this.graph.endEvents))
            return this.validateSoundness(this.graph);
        return false;
    }

    /**
     * Checks the amount of start events (There has to be exactly one)
     * @method validateStartEvents
     * @param startEvents
     * @returns {boolean}
     */
    validateStartEvents(startEvents) {
        if (startEvents.length != 1) {
            this.messages.push({
                'text':'There must be only one start event',
                'type':'danger'
            });
            return false;
        }
        return true;
    };

    /**
     * Checks the amount of end events (There has to be at least one).
     * @method validateEndEvents
     * @param endEvents
     * @returns {boolean}
     */
    validateEndEvents(endEvents) {
        if (endEvents.length <= 0) {
            this.messages.push({
                'text':'There must be at least one end event',
                'type': 'danger'
            });
            return false;
        }
        return true;
    }

    /**
     * Validates the given graph for structural soundness.
     * @method validateSoundness
     * @param graph
     * @returns {boolean}
     */
    validateSoundness(graph) {
        var search = function(node, visited, adjacencyList) {
            if (visited.indexOf(node) >= 0) {
                return;
            }
            visited.push(node);
            if (node in adjacencyList) {
                adjacencyList[node].forEach(function(node){
                    search(node, visited, adjacencyList)
                });
            }
        };

        var res = [];
        graph.startEvents.forEach(function(event){
            var visited = [];
            search(event,visited,graph.adjacencyList);
            var err = false;
            for (var node in graph.adjacencyList) {
                if (graph.adjacencyList.hasOwnProperty(node)) {
                    err = err || (visited.indexOf(node) < 0)
                }
            }
            res.push(!err);
        });

        graph.endEvents.forEach(function(event){
            var visited = [];
            search(event,visited,graph.reverseList);
            var err = false;
            for (var node in graph.reverseList) {
                if (graph.reverseList.hasOwnProperty(node)) {
                    err = err || (visited.indexOf(node) < 0)
                }
            }
            res.push(!err)
        });

        var isReallyValid = true;
        res.forEach(function (el) {
            isReallyValid = isReallyValid && el;
        });
        if (isReallyValid) {
            this.messages.push({
                'text': 'Your graph is structural sound!',
                'type': 'success'
            });
            return true;
        } else {
            this.messages.push({
                'text': 'Your graph is not structural sound!',
                'type': 'danger'
            });
            return false;
        }
    }
};

module.exports = SoundnessValidator;
