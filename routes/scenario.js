var express = require('express');
var router = express.Router();
var Scenario = require('./../models/scenario').model;
var Fragment = require('./../models/fragment').model;
var DomainModel = require('./../models/domainmodel').model;
var _ = require('lodash');

router.get('/', function(req, res, next) {
    var name = req.query.query;

    Scenario.find({name: new RegExp('^'+name+'$', "i")},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {

            var res_object = {
                content_length: result.length,
                scenarios: result
            };

            res.json(res_object)
        } else {
            res.status(404).end();
        }
    });
});

router.post('/', function(req, res, next) {
    var scenario = req.body;

    var db_scenario = new Scenario({
        name: scenario.name,
        termination_condition: scenario.termination_condition,
        revision: 1,
        domainmodel: -1,
        fragments: []
    });

    if (DomainModel.find({_id:scenario.domainmodel}).count() !== 1) {
        res.status(500).end();
        return;
    } else {
        db_scenario.domainmodel = scenario.domainmodel;
    }

    scenario.fragments.forEach(function(fm_id){
        if (Fragment.find(fm_id).count() === 1) {
            db_scenario.fragments.append(dm_id);
        }
    });

    db_scenario.save(function(err){
        if (err) {
            console.error(err);
            res.status(500).end();
        } else {
            res.json(db_scenario);
        }
    })
});

router.post('/associatefragment', function(req, res, next) {
    var fragment_id = req.query.fragment_id;
    var scenario_id = req.query.scenario_id;

    var frag_count = Fragment.find({_id:fragment_id}).count();

    Scenario.findOne({_id:scenario_id}, function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if ((result !== null) && (frag_count === 1)) {
            if (result.fragments.indexOf(fragment_id) === -1) {
                result.fragments.append(fragment_id);
                result.revision++;
                result.save()
            }
            res.json(result)
        } else {
            res.status(404).end();
        }
    })
});

router.post('/associatedomainmodel', function(req, res, next) {
    var domainmodel_id = req.query.domainmodel_id;
    var scenario_id = req.query.scenario_id;

    var dm_count = DomainModel.find({_id:domainmodel_id}).count();

    Scenario.findOne({_id:scenario_id}, function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if ((result !== null) && (dm_count === 1)) {
            if (result.domainmodel !== domainmodel_id) {
                result.domainmodel = domainmodel_id;
                result.revision++;
                result.save()
            }
            res.json(result)
        } else {
            res.status(404).end();
        }
    })
});

router.post('/validate', function(req, res, next){
    //TODO Get validation done here.
});

/* GET fragment belonging to scenario and fragment. */
router.get('/:scenID', function(req, res, next) {
    var id = req.params.scenID;
    Scenario.findOne({_id:id},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            res.json(result)
        } else {
            res.status(404).end();
        }
    });
});

var validateFragmentList = function(list) {
   list.forEach(function(fm_id){
        if (Fragment.find(fm_id).count() === 0) {
            return false;
        }
    });
    return true;
};

/* Post new fragment to a given scenario. If fragment name already exists post new revision */
router.post('/:scenID', function(req, res, next) {
    var scenID = req.params.scenID;
    var new_scen = req.body;

    Scenario.findOne({_id:scenID}, function(err, result){_id:id},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {

            var changed = false;

            if (result.name !== new_scen.name) {
                result.name = new_scen.name;
                changed = true;
            }

            if (result.termination_condition !== new_scen.termination_condition) {
                result.termination_condition = new_scen.termination_condition;
                changed = true;
            }

            if (_.isEqual(result.fragments, new_scen.fragments) && validateFragmentList(new_scen.fragments)) {
                result.fragments = new_scen.fragments;
                changed = true;
            }

            if (result.domainmodel !== new_scen.domainmodel) {
                result.domainmodel = new_scen.domainmodel;
                changed = true;
            }

            if (changed) {
                result.revision++;
                result.save(function(err){
                    if(err) {
                        console.error(err);
                        res.status(500).end();
                    }
                })
            }

        } else {
            res.status(404).end();
        };
    })
});

module.exports = router;
