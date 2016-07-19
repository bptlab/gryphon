var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * The schema of the export-document. It stores all available export-targets.
 */
var ExportSchema = new Schema({
    name: String,
    url: String
});

module.exports = {
    schema: ExportSchema,
    model: mongoose.model('Export', ExportSchema)
};