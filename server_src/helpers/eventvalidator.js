'use strict';

var Scenario = require('./../models/scenario').model;
var parseToBPMNObject = require('./json').parseToBPMNObject;
var parseToOLC = require('./json').parseToOLC;

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

module.exports = EventValidator;
