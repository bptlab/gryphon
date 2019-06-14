'use strict';

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
     * @param bpmnObject
     * @param olc
     */
    constructor(bpmnObject,olc) {
        this.bpmnObject = bpmnObject;
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
     * Validates all tasks, message-receive-tasks and service tasks and their in and outputsets.
     * @method validateDataObjectFlow
     */
    validateDataObjectFlow() {
        if(this.bpmnObject.dataObjectReference != undefined) {
            this.bpmnObject.dataObjectReference.forEach(this.validateDataObjectReference.bind(this));
        }
        if(this.bpmnObject.dataObjectReference != undefined && this.bpmnObject.task != undefined) {
            this.bpmnObject.task.forEach(this.validateTask(false));
        }
        if(this.bpmnObject.dataObjectReference != undefined && this.bpmnObject.receiveTask != undefined) {
            this.bpmnObject.receiveTask.forEach(this.validateTask(true));
        }
        if(this.bpmnObject.dataObjectReference != undefined && this.bpmnObject.serviceTask != undefined) {
            this.bpmnObject.serviceTask.forEach(this.validateTask(true));
        }
    }

    /**
     * Returns a function that validates an task for several OLC-restrictions. The function can be used in iterators.
     * @method validateTask
     * @param validateDuplicates {Boolean} If set on true, the task will be checked for duplicates in the outputset.
     * @returns {function(this:T)}
     */
    validateTask(validateDuplicates) {
        return function(task) {
            var iset = [];
            var oset = [];
            if (task.dataInputAssociation != undefined) {
                task.dataInputAssociation.forEach(function(dia){
		    // Todo: sometimes there are empty bpmn:dataInputAssociation in the XML, see #32
		    if (dia['sourceRef'] !== undefined) {
			iset.push(this.getDataObjectReference(dia['sourceRef'][0]));
		    }
                }.bind(this));
            }
            if (task.dataOutputAssociation != undefined) {
                task.dataOutputAssociation.forEach(function(doa){
		    if (doa['targetRef'] !== undefined) {
			oset.push(this.getDataObjectReference(doa['targetRef'][0]));
		    }
                }.bind(this));
            }
            if (validateDuplicates) {
                this.validateOSetDuplicates(oset);
            }
            this.validateIOSet(iset,oset);
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
                    'type': 'danger'
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
        var referencedDataClass = undefined;
        var validDataClass = false;
        var referencedState = undefined;

        if ('griffin:dataclass' in doref) {
            referencedDataClass = doref['griffin:dataclass'].trim();
            validDataClass = referencedDataClass in this.olc;
            if (!validDataClass) {
                this.messages.push({
                    'text': 'You referenced an invalid dataclass. (' + doref['griffin:dataclass'] + ')',
                    'type': 'danger'
                });
            } 
        } else {
            this.messages.push({
                'text': 'You must specify a dataclass.',
                'type': 'danger'
            });
        }

        if ('griffin:state' in doref) {
            var referencedState = doref['griffin:state'].trim();
            if (validDataClass && !(referencedState in this.olc[referencedDataClass])) {
                this.messages.push({
                    'text': 'You referenced an invalid state (\'' + referencedState + '\') for data object \'' + referencedDataClass + '\'. Available states: \'' + Object.keys(this.olc[referencedDataClass]).join("\', \'") + '\'',
                    'type': 'danger'
                });
            }
        } else {
            this.messages.push({
                'text': 'You must specify a state.',
                'type': 'danger'
            });
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
     * 2. Hack: Allow Self-loops (instate == outstate) that cannot be modeled yet (See https://github.com/bpmn-io/bpmn-js/issues/178)
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
                            'text': iotuple.instate + ' -> ' + iotuple.outstate + ' is not a valid state change (' + iotuple.instate + ' does not exist) according to the olc of the dataclass ' + iotuple.dataclass,
                            'type': 'danger'
                        })
                    } else if (!(iotuple.outstate in olc)) {
                        this.messages.push({
                            'text': iotuple.instate + ' -> ' + iotuple.outstate + ' is not a valid state change (' + iotuple.outstate + ' does not exist) according to the olc of the dataclass ' + iotuple.dataclass,
                            'type': 'danger'
                        })
                    } else if (olc[iotuple.instate].indexOf(iotuple.outstate) < 0) {
                        this.messages.push({
                            'text': iotuple.instate + ' -> ' + iotuple.outstate + ' is not a valid state change (no direct connection) according to the olc of the dataclass ' + iotuple.dataclass,
                            'type': 'danger'
                        })
                    }
                }
            }
        }.bind(this))
    }
};

module.exports = OLCValidator;
