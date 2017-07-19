'use strict';

var Scenario = require('./../models/scenario').model;
var parseToBPMNObject = require('./json').parseToBPMNObject;
var parseToOLC = require('./json').parseToOLC;

var SoundnessValidator = require('./soundnessvalidator');
var OLCValidator = require('./olcvalidator');
var EventValidator = require('./eventvalidator');
var DataObjectReferenceValidator = require('./dataobjectreferencevalidator');

/**
 * @module helpers.validator
 */

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
    constructor(fragment,initDone, validators) {
        if (validators == undefined) {
            validators = [EventValidator, SoundnessValidator, OLCValidator, DataObjectReferenceValidator];
        }
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
            } else if (validator == DataObjectReferenceValidator) {
                validator = new validator(this.fragment.preconditions, this.olc);
            } else {
                validator = new validator(this.bpmnObject);
            }
            this.validateWithSimpleValidator(validator);
        }.bind(this));
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
