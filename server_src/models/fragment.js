var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @module models.fragment
 */

/**
 * The schema of an fragment stored in the fragment-document.
 * @class FragmentSchema
 */
var FragmentSchema = new Schema({
    name: String,
    content: String,
	policy: String,
	bound: {
		hasBound: Boolean,
		limit: Number
	},
    automaticActivation: Boolean,
    preconditions: [{type: String}],
    revision: Number
});

module.exports = {
    schema: FragmentSchema,
    model: mongoose.model('Fragment', FragmentSchema)
};
