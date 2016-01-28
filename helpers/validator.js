
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

    var startEvents = [];
    if (bpmnObject.startEvent != undefined) {
        bpmnObject.startEvent.forEach(parseNodes(startEvents));
    }

    var endEvents = [];
    if (bpmnObject.endEvent != undefined) {
        bpmnObject.endEvent.forEach(parseNodes(endEvents));
    }
    var nodes_reverse = {};
    if (bpmnObject.sequenceFlow != undefined) {
        nodes = parseSequenceFlow(bpmnObject.sequenceFlow);
        nodes_reverse = parseSequenceFlowReverse(bpmnObject.sequenceFlow)
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
    /** var isValid = function(node,visited) {
        if (visited.indexOf(node) >= 0) {
            return false;
        }
        if (graph.endEvents.indexOf(node) >= 0) {
            return true;
        }
        if (!(node in graph.adjacencyList)) {
            result.push(false);
            return false;
        }
        var valid = false;
        visited.push(node);
        console.log(visited);
        graph.adjacencyList[node].forEach(function(node) {
            valid = valid || isValid(node,visited);
        });
        result.push(valid);
        return valid;
    }; */

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
            'text': 'Your graph is sound!',
            'type': 'success'
        }]
    } else {
        return [{
            'text': 'Your graph is not sound!',
            'type': 'danger'
        }]
    }
};

var validateFragment = function(fragment) {
    var bpmnObject = parseToBPMNObject(fragment.content);
    var graph = parseIntoGraph(bpmnObject);

    var messages = [];

    messages = messages.concat(validateStartEvents(graph.startEvents),validateEndEvents(graph.endEvents));

    if (messages.length > 0) {
        messages.push({
            'text':'Soundness validation is not possible. Start and/or end events are invalid.',
            'type':'danger'
        });
        return messages;
    }

    messages = messages.concat(validateSoundness(graph));
    return messages;
};

module.exports = {
    'validateFragment': validateFragment
};