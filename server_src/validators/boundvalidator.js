'use strict';

/**
 * Validates the given fragment for mistakes in the bound definition.
 *
 * @class BoundValidator
 * @type {{new(*): {validateEventBasedGateways: (function()), getSequenceFlowTarget: (function(int): *), validateEvents: (function()), validateEverything: (function())}}}
 */
var EventValidator = class {
    /**
     * Initiates this validator with the given fragment
     * @method constructor
     * @param fragment
     */
    constructor(fragment) {
        this.fragment = fragment;
        this.messages = []
    }

    /**
     * Validates every event feature of the given fragment
     * @method validateEverything
     */
    validateEverything() {
        if (!this.fragment.bound.hasBound) {
            return true;
        }
        if (this.fragment.bound.limit == null) {
            this.messages.push({
                'text':'The bound limit must be a number',
                'type':'danger'
            });
            return false;
        }
        if (this.fragment.bound.limit < 1) {
            this.messages.push({
                'text':'The bound limit must be greater than zero',
                'type':'danger'
            });
            return false;
        }
        return true;
    }


};

module.exports = EventValidator;
