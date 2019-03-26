'use strict';

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
   * 1. All message events need to have an event query
   * 2. Only message and timer catch events allowed
   * 3. Only intermediate message throw events allowed
   * 3.a) intermediate message throw events need data input
   * 3.b) only one input data node for message throw events
   * @method validateEvents
   */
  validateEvents() {
    if (this.bpmnObject['intermediateCatchEvent']) this.validateIntermediateCatchEvent();
    if (this.bpmnObject['intermediateThrowEvent']) this.validateIntermediateThrowEvent();
  }

  /**
   * Validates all event based gateways by the following rules:
   * 1. All events after an event based gateway need to have different event queries
   * @method validateEventBasedGateways
   */
  validateEventBasedGateways() {
    if (!this.bpmnObject['eventBasedGateway']) return;

    this.bpmnObject['eventBasedGateway'].forEach(gateway => {
      if (!gateway.outgoing) return;

      let foundReferences = [];
      gateway.outgoing.forEach(currentReference => {
        let event = this.getSequenceFlowTarget(currentReference);
        if (!EventValidator.isValidOutgoingReferenceEvent(event)) return;

        if (foundReferences.indexOf(event['griffin:eventquery']) >= 0) {
          this.addDangerMessage("You've used the query (\" + ev['griffin:eventquery'].substring(0, 30) + \"...) twice after an event based gateway. This is invalid because it causes unpredictable behavior.");
        } else {
          foundReferences.push(event['griffin:eventquery']);
        }
      });
    });
  }

  /**
   * Returns the target object of an sequence flow by the ID of the sequence flow.
   * @method getSequenceFlowTarget
   * @param seqflowid {int}
   * @returns {*}
   */
  getSequenceFlowTarget(sequenceFlowId) {
    let seqFlow = this.bpmnObject.sequenceFlow.find(sequence => sequence.id === sequenceFlowId);

    //  Return if no matching event was found
    let eventName = 'IntermediateCatchEvent';
    if (!seqFlow || !seqFlow.targetRef.startsWith(eventName)) return null;

    return this.bpmnObject['intermediateCatchEvent'].find(event => event.id === seqFlow.targetRef);
  }

  validateIntermediateCatchEvent() {
    this.bpmnObject['intermediateCatchEvent'].forEach(event => {
      let allowedEventTypes = ['messageEventDefinition', 'signalEventDefinition', 'timerEventDefinition'];

      if (!EventValidator.isEventTypeAllowed(event, allowedEventTypes)) {
        this.addDangerMessage("Only timer and message receive events are supported by Chimera. Remove other types of catching events to allow export.");
      }
      if (EventValidator.isEventQueryMissing(event)) {
        this.addDangerMessage("No event query specified for message receive event.");
      }
    });
  }

  validateIntermediateThrowEvent() {
    this.bpmnObject['intermediateThrowEvent'].forEach(event => {
      let allowedEventTypes = ['messageEventDefinition', 'signalEventDefinition'];

      if (!EventValidator.isEventTypeAllowed(event, allowedEventTypes)) {
        this.addDangerMessage("Only message send and signal events are supported by Chimera. Remove other types of throwing events to allow export.");
      }

      if (!event['dataInputAssociation']) {
        this.addDangerMessage("No data input for message send or signal event.");
      } else if (event['dataInputAssociation'] > 1) {
        this.addDangerMessage("Multiple data inputs for message send or signal event.");
      }
    })
  }

  addDangerMessage(text) {
    this.messages.push({ text, type: 'danger' });
  }

  static isValidOutgoingReferenceEvent(event) {
    return event && event.hasOwnProperty('messageEventDefinition') && event.hasOwnProperty('griffin:eventquery') && event['griffin:eventquery'] !== "";
  }

  static isEventTypeAllowed(event, allowedEventTypes) {
    return allowedEventTypes.some(eventType => event[eventType]);
  }

  static isEventQueryMissing(event) {
    return event.hasOwnProperty('messageEventDefinition') && (!event.hasOwnProperty('griffin:eventquery') || event['griffin:eventquery'] == "");
  }
};

module.exports = EventValidator;
