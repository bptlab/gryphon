'use strict';
var Scenario = require('./../models/scenario').model;
var parseToBPMNObject = require('./json').parseToBPMNObject;
var parseToOLC = require('./json').parseToOLC;

var SoundnessValidator = class {
    constructor(bpmnObject) {
        this.bpmnObject = bpmnObject;
        this.messages = [];
        this.graph = this.parseIntoGraph(bpmnObject);
    }
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
    parseNodes(node_list) {
        return function(element) {
            node_list.push(element.id)
        }
    }
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
    validateEverything() {
        if(this.validateStartEvents(this.graph.startEvents)&&this.validateEndEvents(this.graph.endEvents))
            return this.validateSoundness(this.graph);
        return false;
    }
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

var EventValidator = class {
    constructor(bpmnObject) {
        this.bpmnObject = bpmnObject;
        this.messages = []
    }
    validateEverything() {
        this.validateEvents();
        this.validateEventBasedGateways();
    }
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

// This validator does the olc validation by itself (cause of db-reasons)
// All other validation is done in specialised validators that consume the fragments structure and output messages
var Validator = class {
    constructor(fragment,initDone) {
        if (initDone == undefined) {
            initDone = function() {
                this.validateEverything();
            }
        }
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
     * This one creates adjacency lists for every dataclass according to it's olc.
     * If there is no valid olc model for the dataclass (including at least one state) it's invalid.
     * How do we handle the "init" state. Does it have to be modelled explicit?
     * @param domainmodel
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
    validateEverything() {
        this.validateDataObjectFlow();
        this.validateStructuralSoundness();
        this.validateEvents();
    }
    getDataObjectReference(dorefid) {
        return this.bpmnObject.dataObjectReference.find(function(doref){
            return doref.id == dorefid;
        })
    };
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
    validateStructuralSoundness() {
        this.validateWithSimpleValidator(new SoundnessValidator(this.bpmnObject));
    }
    validateWithSimpleValidator(validator) {
        validator.validateEverything();
        this.messages = this.messages.concat(validator.messages);
    }
    validateEvents() {
        this.validateWithSimpleValidator(new EventValidator(this.bpmnObject));
    }
};

module.exports = {
    'Validator': Validator
};