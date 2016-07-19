var express = require('express');
var router = express.Router();
var RestClient = require('node-rest-client').Client;
var ExportModel = require('./../models/export').model;

/**
 * You can find further information about all endpoints in the swagger.yaml file.
 * @module routes.export
 */

/**
 * Returns all available export-targets.
 * @class getExportTargets
 */
router.get('/', function(req, res) {
    ExportModel.find(function(err,models){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        res.json(models);
    });
});

/**
 * Allows it to create a new export-target.
 * @class postNewExportTarget
 */
router.post('/',function(req,res) {
    var newexport = new ExportModel({
        name: req.body.name,
        url: req.body.url
    });
    newexport.save();
    res.json(newexport);
});

/**
 * Updates the export with the given id.
 * @class postExportTarget
 */
router.post('/:id',function(req,res){
    ExportModel.findOne({_id: req.params.id},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result != null) {
            result.name = req.body.name;
            result.url = req.body.url;
            result.save();
            res.json(result);
        } else {
            res.status(404).end();
        }
    });
});

/**
 * Validates if the export-target with the given URL is an valid export-target.
 * An export is valid if there is an /version and an /scenario endpoint below it,
 * and the /version endpoint returns a valid version-number.
 * @class getValidateExportURL
 */
router.get('/validate',function(req,res){
    var url = req.query.url + '/version';

    var client = new RestClient();
    client.on('error',function(){
        res.json({
            'type': 'danger',
            'text': 'No valid response using ' + url + '/version'
        });
    });
    client.get(url, function(data, response){
        if (typeof data.version == 'undefined') {
            res.json({
                'type': 'danger',
                'text': 'No valid response using ' + url
            })
        } else {
            res.json({
                'type': 'success',
                'text': 'Valid response using ' + url
            })
        }
    }.bind(this)).on('error',function(){
        res.json({
            'type': 'danger',
            'text': 'No valid response using ' + url
        })
    }.bind(this));
});

/**
 * Deletes the export with the given id.
 * @class deleteExportTarget
 */
router.delete('/:id', function(req, res) {
    ExportModel.findOne({_id: req.params.id},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result != null) {
            result.remove();
            res.status(200).end();
        } else {
            res.status(404).end();
        }
    });
});
module.exports = router;