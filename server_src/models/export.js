var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @module models.export
 */

/**
 * The schema of the export-document. It stores all available export-targets.
 * @class ExportSchema
 */
var ExportSchema = new Schema({
    name: String,
    url: String
});

module.exports = {
    schema: ExportSchema,
    model: mongoose.model('Export', ExportSchema)
};