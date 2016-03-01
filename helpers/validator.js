
var Scenario = require('./../models/scenario').model;
var parseToBPMNObject = require('./json').parseToBPMNObject;

var parseSequenceFlow = function(sequenceFlow) {
    var nodes = {};
    sequenceFlow.forEach(function(flow){
        if (nodes[flow.sourceRef] == undefined) {
            nodes[flow.sourceRef] = []
        }
        nodes[flow.sourceRef].push(flow.targetRef);
    });
    return nodes;
};

var parseSequenceFlowReverse = function(sequenceFlow) {
    var nodes = {};
    sequenceFlow.forEach(function(flow){
        if (nodes[flow.targetRef] == undefined) {
            nodes[flow.targetRef] = []
        }
        nodes[flow.targetRef].push(flow.sourceRef);
    });
    return nodes;
};

//Returns a function that can be used to fill the elements (they get parsed by their ID)
var parseNodes = function(node_list) {
    return function(element) {
        node_list.push(element.id)
    }
};

var parseIntoGraph = function(bpmnObject) {
    var nodes = {};
    var nodes_reverse = {};

    var startEvents = [];
    if (bpmnObject.startEvent != undefined) {
        bpmnObject.startEvent.forEach(parseNodes(startEvents));
    }

    var endEvents = [];
    if (bpmnObject.endEvent != undefined) {
        bpmnObject.endEvent.forEach(parseNodes(endEvents));
    }

    if (bpmnObject.sequenceFlow != undefined) {
        nodes = parseSequenceFlow(bpmnObject.sequenceFlow);
        nodes_reverse = parseSequenceFlowReverse(bpmnObject.sequenceFlow)
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
};

var validateStartEvents = function(startEvents) {
    if (startEvents.length != 1) {
        return [{
            'text':'There must be only one start event',
            'type':'danger'
        }];
    }
    return [];
};

var validateEndEvents = function(endEvents) {
    if (endEvents.length <= 0) {
        return [{
            'text':'There must be at least one end event',
            'type': 'danger'
        }]
    }
    return [];
};

var validateSoundness = function(graph) {

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
            err = err || (visited.indexOf(node) < 0)
        }
        res.push(!err);
    });

    graph.endEvents.forEach(function(event){
        var visited = [];
        search(event,visited,graph.reverseList);
        var err = false;
        for (var node in graph.reverseList) {
            err = err || (visited.indexOf(node) < 0)
        }
        res.push(!err)
    });

    var isReallyValid = true;
    res.forEach(function (el) {
        isReallyValid = isReallyValid && el;
    });
    if (isReallyValid) {
        return [{
            'text': 'Your graph is structural sound!',
            'type': 'success'
        }]
    } else {
        return [{
            'text': 'Your graph is not structural sound!',
            'type': 'danger'
        }]
    }
};

var validateDataObjectFlow = function(fragment, bpmnObject, callback) {
    var messages = [];
    if(bpmnObject.dataObjectReference != undefined) {
        Scenario.findOne({fragments:fragment._id}).populate('domainmodel').exec(function(err, result) {
            if (err) {
                callback(messages);
                console.error(err);
            }
            if (result !== null) {
                bpmnObject.dataObjectReference.forEach(function(dataobject){
                    var found = !result.domainmodel.dataclasses.some(function(dataclass){
                        return (dataobject['griffin:dataclass'] == dataclass.name)
                    });
                    if (found) {
                        messages.push({
                            type: "warning",
                            text: "You referenced invalid dataclasses! " + dataobject['griffin:dataclass'] + " is not a valid class"
                        });
                    }
                });
                callback(messages);
            } else {
                callback(messages);
            }
        })
    } else {
        callback(messages);
    }
};

var validateFragment = function(fragment,callback) {
    var bpmnObject = parseToBPMNObject(fragment.content);
    var graph = parseIntoGraph(bpmnObject);

    var messages = [];

    validateDataObjectFlow(fragment,bpmnObject,function(messages2){

        messages = messages.concat(validateStartEvents(graph.startEvents),validateEndEvents(graph.endEvents));

        if (messages.length > 0) {
            messages.push({
                'text':'Soundness validation is not possible. Start and/or end events are invalid.',
                'type':'danger'
            });
            messages = messages.concat(messages2);
            return messages;
        }

        messages = messages.concat(messages2);

        messages = messages.concat(validateSoundness(graph));

        messages = messages.map(function(message){
            message.text = fragment.name + ": " + message.text;
            return message;
        });
        callback(messages);
    });
};

module.exports = {
    'validateFragment': validateFragment
};