var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * The schema of the domainmodel-documents, it includes the dataclasses and their attributes.
 * @class DomainModelSchema
 */
var DomainModelSchema = new Schema({
    name: String,
    revision: Number,
    dataclasses: [{
        name: String,
        is_root: Boolean,
        is_event: Boolean,
        attributes: [{
            name: String,
            datatype: String
        }],
        olc: String
    }]
});

module.exports = {
    schema: DomainModelSchema,
    model: mongoose.model('DomainModel', DomainModelSchema)
};