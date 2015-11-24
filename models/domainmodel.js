var mongoose = require('mongoose')
var Schema = mongoose.Schema

var DomainModelSchema = new Schema({
    name: String,
    revision: Number,
    attributes: [{name: String, datatype: String}]
});

module.exports = {
    schema: DomainModelSchema,
    model: mongoose.model('DomainModel', DomainModelSchema)
};