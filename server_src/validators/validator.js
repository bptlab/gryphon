'use strict';

var Scenario = require('./../models/scenario').model;
var parseToBPMNObject = require('./../helpers/json').parseToBPMNObject;
var parseOLCPaths = require('./../helpers/json').parseOLCPaths;

var BoundValidator = require('./boundvalidator');
var SoundnessValidator = require('./soundnessvalidator');
var OLCValidator = require('./olcvalidator');
var EventValidator = require('./eventvalidator');
var DataObjectReferenceValidator = require('./dataobjectreferencevalidator');
var ThrowEventValidator = require('./throweventvalidator');
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
            validators = [BoundValidator, EventValidator, SoundnessValidator, OLCValidator, DataObjectReferenceValidator, ThrowEventValidator];
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
            this.olc = parseOLCPaths(result.domainmodel);
	    this.dm = result.domainmodel;
            initDone();
        }.bind(this))
    }

    /**
     * Validates every feature of the fragment that was loaded.
     * @method validateEverything
     */
    validateEverything() {
        this.validators.forEach(function(validator){
            if (validator == BoundValidator) {
                validator = new validator(this.fragment)
            } else if (validator == OLCValidator) {
                validator = new validator(this.bpmnObject, this.olc)
            } else if (validator == DataObjectReferenceValidator) {
                validator = new validator(this.fragment.preconditions, this.olc);
            } else if (validator == ThrowEventValidator) {
      				validator = new validator(this.bpmnObject, this.dm)
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

};

module.exports = {
    'Validator': GeneralValidator
};
