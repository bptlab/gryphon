'use strict';

/**
 * A validator that checks throw events
 *
 * @class OLCValidator
 * @type {{new(*, *): {validateThrowEvent: (function(*)), validateEverything: (function()), getDataObjectReference: (function(*): *)}}}
 */
var ThrowEventValidator = class {
    /**
     * Initiates the validator with the given fragment and domain model
     * @method constructor
     * @param bpmnObject
     * @param dm - the domain model
     */
    constructor(bpmnObject,dm) {
        this.bpmnObject = bpmnObject;
        this.messages = [];
        this.dm = dm;
    }

    /**
     * Validates every feature of the given fragment.
     * @method validateEverything
     */
    validateEverything() {
	if(this.bpmnObject.dataObjectReference != undefined && this.bpmnObject.intermediateThrowEvent != undefined) {
            this.bpmnObject.intermediateThrowEvent.forEach(this.validateThrowEvent());
        }
	
    }
    
    /**
     * Returns a function that validates throw events.
     * The input data node needs to be a event class.
     * @method validateThrowEvent
     */
    validateThrowEvent() {
	return function (ev) {
	    if (ev.dataInputAssociation !== undefined &&
		ev.dataInputAssociation.length == 1) {
		var dia = ev.dataInputAssociation[0];
		
		if (dia['sourceRef'] !== undefined) {
		    var refDo = this.getDataObjectReference(dia['sourceRef'][0]);
		    console.log(this.dm.dataclasses[0].name);
		    var foundDc = this.dm.dataclasses.find(function (dc) {
			return dc.name == refDo['griffin:dataclass'];
		    });
		    if (foundDc !== undefined &&
			!foundDc.is_event) {
			this.messages.push({
			    'text': 'Data input of message send event is not an event class.',
			    'type': 'danger'
			});
		    }
		}
	    }
	}.bind(this);
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

};

module.exports = ThrowEventValidator;

