var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ScenarioSchema = new Schema({
    name: {type: String, index: { unique: true }},
    terminationcondition: String,
    revision: Number,
    fragments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Fragment'}],
    domainmodel: {type: mongoose.Schema.Types.ObjectId, ref: 'DomainModel'}
});

module.exports = {
    schema: ScenarioSchema,
    model: mongoose.model('Scenario', ScenarioSchema)
};