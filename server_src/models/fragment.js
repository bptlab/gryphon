var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * The schema of an fragment stored in the fragment-document.
 */
var FragmentSchema = new Schema({
    name: String,
    content: String,
    revision: Number
});

module.exports = {
    schema: FragmentSchema,
    model: mongoose.model('Fragment', FragmentSchema)
};