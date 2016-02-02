var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExportSchema = new Schema({
    name: String,
    url: String
});

module.exports = {
    schema: ExportSchema,
    model: mongoose.model('Export', ExportSchema)
};