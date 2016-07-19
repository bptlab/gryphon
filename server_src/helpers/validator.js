'use strict';
var Scenario = require('./../models/scenario').model;
var parseToBPMNObject = require('./json').parseToBPMNObject;
var parseToOLC = require('./json').parseToOLC;

/**
 * @module helpers.validator
 */

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


/**
 * A validator that checks for olc-conformance.
 *
 * @class OLCValidator
 * @type {{new(*, *): {validateDataObjectReference: (function(*)), createMapping: (function(Array, Array): Array), validateEverything: (function()), getDataObjectReference: (function(*): *), validateOSetDuplicates: (function(*)), validateIOSet: (function(*=, *=)), validateDataObjectFlow: (function())}}}
 */
var OLCValidator = class {
    /**
     * Initiates the OLC validator with the given fragment and  the available OLC-diagrams in this scenario.
     * @method constructor
     * @param fragment
     * @param olc
     */
    constructor(fragment,olc) {
        this.fragment = fragment;
        this.bpmnObject = parseToBPMNObject(fragment.content);
        this.messages = [];
        this.olc = olc;
    }

    /**
     * Validates every feature of the given fragment.
     * @method validateEverything
     */
    validateEverything() {
        this.validateDataObjectFlow();
    }

    /**
     * Returns the dataobjectreference with the given ID
     * @method getDataObjectReference
     * @param dorefid
     * @returns {*}
     */
    getDataObjectReference(dorefid) {
        return this.bpmnObject.dataObjectReference.find(function(doref){
            return doref.id == dorefid;
        })
    };

    /**
     * Validates all tasks, message-receive-tasks and service tasks and their in and outputsets.
     * @method validateDataObjectFlow
     */
    validateDataObjectFlow() {
        if(this.bpmnObject.dataObjectReference != undefined) {
            this.bpmnObject.dataObjectReference.forEach(this.validateDataObjectReference.bind(this));
        }
        if(this.bpmnObject.dataObjectReference != undefined && this.bpmnObject.task != undefined) {
            this.bpmnObject.task.forEach(function(task){
                var iset = [];
                var oset = [];
                if (task.dataInputAssociation != undefined) {
                    task.dataInputAssociation.forEach(function(dia){
                        iset.push(this.getDataObjectReference(dia['sourceRef'][0]));
                    }.bind(this));
                }
                if (task.dataOutputAssociation != undefined) {
                    task.dataOutputAssociation.forEach(function(doa){
                        oset.push(this.getDataObjectReference(doa['targetRef'][0]));
                    }.bind(this));
                }
                this.validateIOSet(iset,oset);
            }.bind(this));
        }
        if(this.bpmnObject.dataObjectReference != undefined && this.bpmnObject.receiveTask != undefined) {
            this.bpmnObject.receiveTask.forEach(function(task){
                var iset = [];
                var oset = [];
                if (task.dataInputAssociation != undefined) {
                    task.dataInputAssociation.forEach(function(dia){
                        iset.push(this.getDataObjectReference(dia['sourceRef'][0]));
                    }.bind(this));
                }
                if (task.dataOutputAssociation != undefined) {
                    task.dataOutputAssociation.forEach(function(doa){
                        oset.push(this.getDataObjectReference(doa['targetRef'][0]));
                    }.bind(this));
                }
                this.validateOSetDuplicates(oset);
                this.validateIOSet(iset,oset);
            }.bind(this));
        }
        if(this.bpmnObject.dataObjectReference != undefined && this.bpmnObject.serviceTask != undefined) {
            this.bpmnObject.serviceTask.forEach(function(task){
                var iset = [];
                var oset = [];
                if (task.dataInputAssociation != undefined) {
                    task.dataInputAssociation.forEach(function(dia){
                        iset.push(this.getDataObjectReference(dia['sourceRef'][0]));
                    }.bind(this));
                }
                if (task.dataOutputAssociation != undefined) {
                    task.dataOutputAssociation.forEach(function(doa){
                        oset.push(this.getDataObjectReference(doa['targetRef'][0]));
                    }.bind(this));
                }
                this.validateOSetDuplicates(oset);
                this.validateIOSet(iset,oset);
            }.bind(this));
        }
    }

    /**
     * Checks an outputset by the following rules:
     * 1. On automated activitys, there is just one outputset
     * @method validateOSetDuplicates
     * @param oset
     */
    validateOSetDuplicates(oset) {
        var output = [];
        oset.forEach(function(outputobject) {
            var dclass = outputobject['griffin:dataclass'];
            if (output.indexOf(dclass) >= 0) {
                this.messages.push({
                    'text': 'Invalid outputset. Only one possible Outputset is allowed. ' + dclass + ' is duplicate.',
                    'type': 'warning'
                })
            }
            output.push(dclass);
        }.bind(this));
    }

    /**
     * Validates all dataobjectreferences in the given fragment by the following rules:
     * 1. No invalid (non-existing) dataclasses
     * 2. No invalid states according to the dataclasses olc.
     * @method validateDataObjectReference
     * @param doref
     */
    validateDataObjectReference(doref) {
        if (!(doref['griffin:dataclass'] in this.olc)) {
            this.messages.push({
                'text': 'You referenced an invalid dataclass. (' + doref['griffin:dataclass'] + ')',
                'type': 'danger'
            })
        } else {
            if (this.olc[doref['griffin:dataclass']] != null && !(doref['griffin:state'] in this.olc[doref['griffin:dataclass']])) {
                this.messages.push({
                    'text': 'You referenced an invalid state (' + doref['griffin:state'] + ') for data object ' + doref['griffin:dataclass'],
                    'type': 'danger'
                })
            }
        }
    }

    /**
     * Searches for classes that appear in the in- and the outputset and creates a list of the state transitions.
     * @method createMapping
     * @param iset {Array} The inputset
     * @param oset {Array} The outputset
     * @returns {Array}
     */
    createMapping(iset,oset) {
        var mapping = [];
        oset.forEach(function(outputo){
            var inputo = iset.find(function(inputo){
                return (outputo['griffin:dataclass'] == inputo['griffin:dataclass']);
            });
            if (inputo != null) {
                mapping.push({
                    dataclass: inputo['griffin:dataclass'],
                    instate: inputo['griffin:state'],
                    outstate: outputo['griffin:state']
                });
            }
        });
        iset.forEach(function(inputo){
            var outputo = oset.find(function(outputo){
                return (outputo['griffin:dataclass'] == inputo['griffin:dataclass']);
            });
            if (outputo != null) {
                mapping.push({
                    dataclass: inputo['griffin:dataclass'],
                    instate: inputo['griffin:state'],
                    outstate: outputo['griffin:state']
                });
            }
        });
        return mapping;
    }

    /**
     * Validates an in- and outputset of a given activity by the following rules:
     * 1. Check if all transitions are allowed in the assigned olc
     * @method validateIOSet
     * @param iset
     * @param oset
     */
    validateIOSet(iset, oset) {
        var mapping  = this.createMapping(iset,oset);
        mapping.forEach(function(iotuple){
            if (iotuple.dataclass in this.olc) {
                if (this.olc[iotuple.dataclass] != null) {
                    var olc = this.olc[iotuple.dataclass];
                    if (!(iotuple.instate in olc)) {
                        this.messages.push({
                            'text': iotuple.instate + ' -> ' + iotuple.outstate + ' is not a valid state change according to the olc of the dataclass ' + iotuple.dataclass,
                            'type': 'danger'
                        })
                    } else {
                        if (olc[iotuple.instate].indexOf(iotuple.outstate) < 0) {
                            this.messages.push({
                                'text': iotuple.instate + ' -> ' + iotuple.outstate + ' is not a valid state change according to the olc of the dataclass ' + iotuple.dataclass,
                                'type': 'danger'
                            })
                        }
                    }
                }
            }
        }.bind(this))
    }
};

/**
 * Validates the given fragment for mistakes in event-references.
 *
 * @class EventValidator
 * @type {{new(*): {validateEventBasedGateways: (function()), getSequenceFlowTarget: (function(int): *), validateEvents: (function()), validateEverything: (function())}}}
 */
var EventValidator = class {
    /**
     * Initiates this validator with the given fragment
     * @mthod constructor
     * @param bpmnObject
     */
    constructor(bpmnObject) {
        this.bpmnObject = bpmnObject;
        this.messages = []
    }

    /**
     * Validates every event feature of the given fragment
     * @method validateEverything
     */
    validateEverything() {
        this.validateEvents();
        this.validateEventBasedGateways();
    }

    /**
     * Validates all events in the given fragment by the following rules:
     * 1. All message events need to have an event query.
     * 2. No other events but message and timer events are allowed.
     * 3. No throw-events
     * @method validateEvents
     */
    validateEvents() {
        if (this.bpmnObject.intermediateCatchEvent) {
            this.bpmnObject.intermediateCatchEvent.forEach(function(ev){
                var allowed_ev_types = ['messageEventDefinition', 'timerEventDefinition'];
                var found = false;
                allowed_ev_types.forEach(function(evtype){
                    found = found || ev[evtype] != null;
                }.bind(this));
                if (!found) {
                    this.messages.push({
                        'text': 'Currently all catch events but Timer and Event are not supported in chimera! Remove them to allow export.',
                        'type': 'danger'
                    })
                }
                if (ev.hasOwnProperty('messageEventDefinition') && (!ev.hasOwnProperty('griffin:eventquery') || ev['griffin:eventquery'] == "")) {
                    this.messages.push({
                        'text': 'Message-Events need a query-definition.',
                        'type': 'danger'
                    });
                }
            }.bind(this));
        }
        if (this.bpmnObject.intermediateThrowEvent) {
            this.messages.push({
                'text': 'Currently all throw events are not supported in chimera! Remove them to allow export.',
                'type': 'danger'
            })
        }
    }

    /**
     * Validates all event based gateways by the following rules:
     * 1. All events after an event based gateway need to have different event queries
     * @method validateEventBasedGateways
     */
    validateEventBasedGateways() {
        if (this.bpmnObject.eventBasedGateway) {
            this.bpmnObject.eventBasedGateway.forEach(function(gateway){
                if (gateway.outgoing) {
                    var queries_found = [];
                    gateway.outgoing.forEach(function(outgoing_ref){
                        var ev = this.getSequenceFlowTarget(outgoing_ref);
                        if (ev && ev.hasOwnProperty('messageEventDefinition') &&
                            ev.hasOwnProperty('griffin:eventquery') && ev['griffin:eventquery'] !== "") {
                            if (queries_found.indexOf(ev['griffin:eventquery']) >= 0) {
                                this.messages.push({
                                    'text': "You've used the query (" + ev['griffin:eventquery'].substring(0,30) + "...) twice after an event based gateway. This is invalid because it causes unpredictable behavior.",
                                    'type': 'danger'
                                })
                            } else {
                                console.log("query:" + ev['griffin:eventquery']);
                                queries_found.push(ev['griffin:eventquery']);
                            }
                        }
                    }.bind(this))
                }
            }.bind(this));
        }
    }

    /**
     * Returns the target object of an sequence flow by the ID of the sequence flow.
     * @method getSequenceFlowTarget
     * @param seqflowid {int}
     * @returns {*}
     */
    getSequenceFlowTarget(seqflowid) {
        var seqs = this.bpmnObject.sequenceFlow.filter(function(seqflow){
            return (seqflow.id == seqflowid);
        });
        if (seqs.length == 0) {
            return null;
        } else {
            var seqflow = seqs[0];
            if (seqflow.targetRef.substring(0,22) == 'IntermediateCatchEvent') {
                var evs = this.bpmnObject.intermediateCatchEvent.filter(function(ev){
                    return (ev.id == seqflow.targetRef);
                });
                if (evs.length == 0) {
                    return null;
                } else {
                    return evs[0];
                }
            } else {
                return null;
            }
        }
    }
};

/**
 * A validator that is able to validate using multiple other validators.
 *
 * @class GeneralValidator
 * @type {{new(string, Function, array=): {validateWithSimpleValidator: (function(*)), parseOLCPaths: (function(Domainmodel)), validateEverything: (function())}}}
 */
var GeneralValidator = class {
    /**
     * Initiates a validator with the given fragment and the given validators.
     * @method constructor
     * @param fragment {string} The fragment that should be validated
     * @param initDone {function} A function that should get called when the DB-initiation is done.
     * @param validators {array} A list of Classes that should be used as validator (Event Soundness and OLC on Default)
     */
    constructor(fragment,initDone, validators=[EventValidator, SoundnessValidator, OLCValidator]) {
        if (initDone == undefined) {
            initDone = function() {
                this.validateEverything();
            }
        }
        this.validators = validators;
        this.fragment = fragment;
        this.bpmnObject = parseToBPMNObject(fragment.content);
        this.messages = [];
        Scenario.findOne({fragments:fragment._id}).populate('domainmodel').exec(function(err, result) {
            if (result == null) {
                throw "Can't find domainmodel for fragment";
            }
            this.scenario = result;
            this.parseOLCPaths(result.domainmodel);
            initDone();
        }.bind(this))
    }

    /**
     * Validates every feature of the fragment that was loaded.
     * @method validateEverything
     */
    validateEverything() {
        this.validators.forEach(function(validator){
            if (validator == OLCValidator) {
                validator = new validator(this.bpmnObject, this.olc)
            } else {
                validator = new validator(this.bpmnObject);
            }
            this.validateWithSimpleValidator(validator);
        })
    }

    /**
     * Uses a simple validator (that needs to have an validateEverything() method) to validate the loaded fragment.
     * @method validateWithSimpleValidator
     * @param validator
     */
    validateWithSimpleValidator(validator) {
        validator.validateEverything();
        this.messages = this.messages.concat(validator.messages);
    }

    /**
     * This method creates adjacency lists for every dataclass according to it's olc.
     * If there is no valid olc model for the dataclass (including at least one state) it's invalid.
     * @method parseOLCPaths
     * @param domainmodel {Domainmodel}
     */
    parseOLCPaths(domainmodel) {
        this.olc = {};
        domainmodel.dataclasses.forEach(function(dclass){
            if (dclass.olc != undefined) {
                var olc = parseToOLC(dclass.olc);
                var adjlist = {};
                var namemap  = {};
                if ('state' in olc) {

                    olc['state'].forEach(function(state){
                        if ('name' in state) {
                            namemap[state['id']] = state['name'];
                        } else {
                            namemap[state['id']] = state['id'];
                        }
                        adjlist[namemap[state['id']]] = [];
                    });

                    if ('sequenceFlow' in olc) {
                        olc['sequenceFlow'].forEach(function(seqFlow){
                            if ((seqFlow['sourceRef'] in namemap) && (seqFlow['targetRef'] in namemap)) {
                                adjlist[namemap[seqFlow['sourceRef']]].push(namemap[seqFlow['targetRef']]);
                            }
                        });
                        this.olc[dclass.name] = adjlist;
                    } else {
                        this.olc[dclass.name] = null;
                    }
                } else {
                    this.olc[dclass.name] = null;
                }
            } else {
                this.olc[dclass.name] = null;
            }
        }.bind(this))
    }
};

module.exports = {
    'Validator': GeneralValidator
};