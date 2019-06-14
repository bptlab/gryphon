'use strict';
var Scenario = require('./../models/scenario').model;
var Fragment = require('./../models/fragment').model;
var parseToOLC = require('./../helpers/json').parseToOLC;

/**
 * A validator that checks validity of data object references
 *
 * @class DataObjectReferenceValidator
 */
var DataObjectReferenceValidator = class {
    /**
     * Initiates the data object reference validator with the given fragment and the available OLC-diagrams in this scenario.
     * @method constructor
     * @param dataobjectreferences
     * @param olc
     */
    constructor(dataobjectreferences,olc) {
        this.dataobjectreferences = dataobjectreferences;
        this.messages = [];
        this.olc = olc;
    }

    /**
     * Validates every feature of the given fragment.
     * @method validateEverything
     */
    validateEverything() {
        this.validateReferences();
    }

    /**
     * Validates all data object references.
     * @method validateReferences
     */
    validateReferences() {
        this.dataobjectreferences.forEach(function(compoundReference) {
            // Split compound reference into individual references
            var individualReferences = compoundReference.split(',');
            individualReferences.forEach(function(reference) {
                this.validateReference(reference.trim());
            }.bind(this));
        }.bind(this));
    }

    /**
     * validate a single reference.
     * @method validateReference
     */
    validateReference(reference) {
        var end = reference.indexOf("[");
        var realend = reference.indexOf("]");

        // Is the format correct?
        if (end == reference.length - 1 || end == -1 || realend < reference.length - 1) {
            this.messages.push({
                "text": "You must specify a state for your data object reference '" + reference + "'",
                "type": "danger"
            });
            return false;
        }

        // Split reference in class and state
        var className = reference.substring(0,end);
        var stateName = reference.substring(end + 1, realend);

        // Does the class exist?
        if (!(className in this.olc)) {
          this.messages.push({
              "text": "You referenced an invalid dataclass '" + className + "'",
              "type": "danger"
          });
          return false;
        }

        // Does this class have the referenced state?
        if (!(stateName in this.olc[className])) {
          this.messages.push({
              "text": "You referenced an invalid state '" + stateName + "' for class '" + className + "'",
              "type": "danger"
          });
          return false;
        }
        return true;
    }
};

module.exports = DataObjectReferenceValidator;
