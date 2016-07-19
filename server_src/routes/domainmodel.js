var express = require('express');
var router = express.Router();
var changeDClassReferences = require('./../helpers/updaterefs').changeDClassReferences;

var DomainModel = require('./../models/domainmodel').model;
var _ = require('lodash');

/**
 * You can find further information about all endpoints in the swagger.yaml
 * @module routes.domainmodel
 */

/**
 * This endpoint returns an domainmodel by its ID.
 * @class getDomainModel
 */
router.get('/:dmID', function(req, res) {
    var dm_id = req.params.dmID;
    DomainModel.findOne({_id:dm_id},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            res.json(result);
        } else {
            res.status(404).end();
        }
    });
});

/**
 * Updates the domainmodel with the given ID.
 * @class postDomainModel
 */
router.post('/:dmID', function(req, res) {
    var dm_id = req.params.dmID;
    var new_dm = req.body;

    DomainModel.findOne({_id:dm_id},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            var done = function() {

                var changed = false;

                if (new_dm.name != null && result.name !== new_dm.name) {
                    result.name = new_dm.name;
                    changed = true;
                }

                if (new_dm.dataclasses != null && !_.isEqual(new_dm.dataclasses, result.dataclasses)) {
                    result.dataclasses = new_dm.dataclasses;
                    changed = true;
                }

                if (changed) {
                    result.revision++;
                    result.save(function (err) {
                        if (err) {
                            console.error(err);
                            res.status(500).end();
                        }
                    });
                }
                res.json(result);
            };
            if (new_dm.dataclasses != null && !_.isEqual(new_dm.dataclasses, result.dataclasses)) {
                changeDClassReferences(result._id, result.dataclasses, new_dm.dataclasses, done);
            } else {
                done();
            }
        } else {
            res.status(404).end();
        }
    });
});

/**
 * Returns a list of all available domain-models.
 * @class getDomainModels
 */
router.get('/', function(req, res) {
    var name = req.query.query;

    DomainModel.find({name: new RegExp('^'+name+'$', "i")},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {

            var res_object = {
                content_length: result.length,
                domainmodels: result
            };

            res.json(res_object);
        } else {
            res.status(404).end();
        }
    });
});

/**
 * Creates a new domainmodel.
 * @class postNewDomainModel
 */
router.post('/', function(req, res) {
    var domainmodel = req.body;

    var db_domainmodel = new DomainModel({
        name: domainmodel.name,
        attributes: domainmodel.dataclasses,
        revision: 1
    });

    db_domainmodel.save(function(err){
        if (err) {
            console.error(err);
            res.status(500).end();
        } else {
            res.json(db_domainmodel);
        }
    });
});

module.exports = router;
