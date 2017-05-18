var express = require('express');
var router = express.Router();
var Scenario = require('./../models/scenario').model;

var DomainModel = require('./../models/domainmodel').model;
var _ = require('lodash');

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

var changeDClassAttrReferences = function(newclass, oldclass, scenario) {
    oldclass.attributes.forEach(function(old_attr) {
        newclass.attributes.forEach(function(new_attr){
            if (old_attr._id.toString() == new_attr._id && old_attr.name != new_attr.name) {
                scenario.startconditions = scenario.startconditions.forEach(function(startcon){
                    startcon.dataclasses = startcon.dataclasses.map(function(mapping){
                        if (mapping.classname == newclass.name) {
                            mapping.mapping = mapping.mapping.map(function(attribute){
                                if (attribute.attr == old_attr.name) {
                                    mapping.attr = new_attr.name;
                                }
                                return mapping
                            })
                        }
                        return mapping;
                    });
                    return startcon;
                })
            }
        })
    });
};

var changeDClassReferences = function(dm_id, old_classes, new_classes, done) {
    Scenario.findOne({domainmodel:dm_id}).populate('fragments').exec(function(err, result){
        if (err) {
            console.error(err);
            return;
        }
        if (result !== null) {
            old_classes.forEach(function(oldclass){
                new_classes.forEach(function(newclass){
                    if ((newclass._id == oldclass._id.toString()) && (newclass.name != oldclass.name)) {
                        result.terminationconditions = result.terminationconditions.map(function(termcon) {
                            return termcon.split(oldclass.name + '[').join(newclass.name + '[');
                        });
                        result.startconditions = result.startconditions.map(function(startcon){
                            startcon.mapping = startcon.mapping.map(function(mapping) {
                                if (mapping.classname == oldclass.name) {
                                    mapping.classname = newclass.name;
                                }
                                return mapping;
                            });
                            return startcon;
                        });
                        result.save();

                        result.fragments.forEach(function(fragment){
                            fragment.content = fragment.content
                                .split('griffin:dataclass="' + oldclass.name + '"')
                                .join('griffin:dataclass="' + newclass.name + '"');
                            fragment.content = fragment.content
                                .split('name="' + oldclass.name + '[')
                                .join('name="' + newclass.name + '[');
                            fragment.save();
                        })
                    }
                    if ((newclass._id == oldclass._id.toString()) && !_.isEqual(newclass.attributes, oldclass.attributes)) {
                        changeDClassAttrReferences(newclass, oldclass, result);
                    }
                });
            });
            done()
        }
    })
};

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
