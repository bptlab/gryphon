'use strict';

/**
 * Validates the given fragment for mistakes in the bound definition.
 *
 * @class BoundValidator
 * @type {{new(*): {validateEventBasedGateways: (function()), getSequenceFlowTarget: (function(int): *), validateEvents: (function()), validateEverything: (function())}}}
 */
var BoundValidator = class {
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
    async validateEverything() {
        if (!this.fragment.bound.hasBound) {
            return [];
        }
        if (this.fragment.bound.limit == null) {
            this.messages.push({
                'text':'The bound limit must be a number',
                'type':'danger'
            });
            return this.messages;
        }
        if (this.fragment.bound.limit < 1) {
            this.messages.push({
                'text':'The bound limit must be greater than zero',
                'type':'danger'
            });
            return this.messages;
        }
        return [];
    }


};

module.exports = BoundValidator;
