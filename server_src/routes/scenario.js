var express = require('express');
var router = express.Router();
var Scenario = require('./../models/scenario').model;
var Fragment = require('./../models/fragment').model;
var DomainModel = require('./../models/domainmodel').model;
var _ = require('lodash');
var Config = require('./../../config');
var RestClient = require('node-rest-client').Client;
var Validator = require('./../helpers/validator').Validator;
var Export =  require('./../models/export').model;
var parseToOLC = require('./../helpers/json').parseToOLC;

/**
 * You can find further information about all information.
 * @module routes.scenario
 */

/**
 * Returns a list of all scenarios.
 * @class getScenarios
 */
router.get('/', function(req, res) {
    var name = req.query.query;
    var populate = req.query.populate;
    var query = Scenario.find({name: new RegExp(name, "i")});
    if (populate) {
        query = query.populate('fragments').populate('domainmodel');
    }
    query.exec(function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            if (populate) {
                result.forEach(function(scenario){
                    scenario.fragments.forEach(function(fragment){
                        fragment.content = "";
                    })
                })
            }
            res.json(result)
        } else {
            res.status(404).end();
        }
    });
});

/**
 * Creates a new scenario. Fills it with default values if there are no values in the body.
 * @class postNewScenario
 */
router.post('/', function(req, res) {
    var scenario = req.body;
    try {
        Scenario.find({name: scenario.name}).count(function (err, count) {
            try {
		// scenario with that name already exists -> append '_2'
                if (count > 0) {
                    scenario.name = scenario.name + "_2"
                }

                var db_scenario = new Scenario({
                    name: scenario.name,
					description: (scenario.description ? scenario.description : ""),
                    terminationconditions: (scenario.terminationconditions ? scenario.terminationconditions : []), //Config.DEFAULT_TERMINATION_CONDITION]),
                    revision: 1,
                    domainmodel: -1,
                    fragments: [],
                    startconditions: (scenario.startconditions ? scenario.startconditions : [])
                });

                if (scenario.domainmodel == null) {
                    var new_domainmodel = new DomainModel();
                    new_domainmodel.revision = 1;
                    new_domainmodel.name = scenario.name;
                    new_domainmodel.dataclasses = [];
                    new_domainmodel.save();
                    scenario.domainmodel = new_domainmodel._id;
                    db_scenario.domainmodel = new_domainmodel._id;
                } else {
                    if (typeof scenario.domainmodel == "string") {
                        db_scenario.domainmodel = scenario.domainmodel;
                    } else {
                        new_domainmodel = new DomainModel();
                        new_domainmodel.revision = scenario.domainmodel.revision;
                        new_domainmodel.dataclasses = scenario.domainmodel.dataclasses.map(function(dclass){
                            if (typeof dclass.olc !== 'string') {
                                dclass.olc = "";
                            }
                            return dclass;
                        });
                        new_domainmodel.name = scenario.domainmodel.name;
                        new_domainmodel.save();
                        db_scenario.domainmodel = new_domainmodel._id;
                        scenario.domainmodel = new_domainmodel._id;
                    }
                }

                if (scenario.fragments == null) {
                    var new_fragment = new Fragment();
                    new_fragment.name = "First Fragment";
                    new_fragment.content = Config.DEFAULT_FRAGMENT_XML;
					new_fragment.policy = Config.DEFAULT_FRAGMENT_POLICY;
					new_fragment.bound = {
						hasBound: false,
						limit: Config.DEFAULT_FRAGMENT_INSTANTIATION_AMOUNT
					},
                    new_fragment.revision = 1;
                    new_fragment.save();
                    scenario.fragments = [];
                    db_scenario.fragments.push(new_fragment._id);
                } else {
                    scenario.fragments.forEach(function (fragment) {
                        if (typeof fragment == "string") {
                            db_scenario.fragments.push(fragment);
                        } else {
                            var new_fragment = new Fragment();
                            new_fragment.name = fragment.name;
                            new_fragment.content = fragment.content;
                            new_fragment.revision = fragment.revision;
                            new_fragment.save();
                            scenario.fragments = [];
                            db_scenario.fragments.push(new_fragment._id);
                        }
                    })
                }

                db_scenario.save(function (err) {
                    if (err) {
                        res.status(500);
                        res.json(
                            [{
                                "type": "danger",
                                "text": "Scenario storage failed.",
                                "err_text": err.message,
                                "err_code": err.code
                            }]
                        );
                    } else {
                        res.json(db_scenario);
                    }
                })
            } catch (err) {
                var message = {
                    type: "danger",
                    text: ""
                };
                var status = 500;
                if (err.name == "CastError") {
                    status = 400;
                    message.text = "You've entered invalid ObjectIDs to reference to DomainModels or Fragments.";
                } else {
                    message.text = "An error occured. " + err.message;
                }
                res.status(status);
                res.json([message]);
            }
        });
    } catch(err) {
        var message = {
            type: "danger",
            text: "An error occured. " + err.message,
            err_code: err.code,
            err_text: err.message
        };
        res.status(status);
        res.json({
            "success": false,
            "messages": [message]
        });
    }
});

/**
 * Assigns the given fragment to the given scenario.
 * By using this endpoint it's possible to assign a fragment to two or more scenarios.
 * It's suggested that this is not done, because the validation might not work anymore.
 * @class postAssociateFragmentToScenario
 */
router.post('/associatefragment', function(req, res) {
    var fragment_id = req.query.fragment_id;
    var scenario_id = req.query.scenario_id;

    Fragment.where({_id:fragment_id}).count(function(err2, frag_count){
        Scenario.findOne({_id:scenario_id}, function(err, result){
            if (err || err2) {
                console.error(err);
                console.error(err2);
                res.status(500).end();
                return;
            }
            if ((result !== null) && (frag_count === 1)) {
                if (result.fragments.indexOf(fragment_id) === -1) {
                    result.fragments.push(fragment_id);
                    result.revision++;
                    result.save(function(save_err){
                        if(save_err) {
                            console.error(save_err);
                            res.status(500).end();
                        }
                    });
                    res.json(result);
                }
            } else {
                res.status(404).end();
            }
        });
    });

});

/**
 * Assigns the given domainmodel to the given scenario.
 * @class postAssociateDomainmodelToScenario
 */
router.post('/associatedomainmodel', function(req, res) {
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

/**
 * Validates the given scenario.
 * @class getValidateScenario
 */
router.get('/:scenID/validate', function(req, res){
    var scenID = req.params.scenID;
    Scenario.findOne({_id:scenID}).populate('fragments').populate('domainmodel').exec(function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            var messages = [];
            var result_count = 0;
            result.startconditions.forEach(function(startcondition){
                if (startcondition.query == "") {
                    messages.push({
                        'type':'warning',
                        'text':'Empty Querys in Startmessages are not allowed.'
                    })
                }
                startcondition.dataclasses.forEach(function(mapping){
                    mapping.mapping.forEach(function(tuple){
                        if (tuple.attr == "" || tuple.path == "") {
                            messages.push({
                                'type':'warning',
                                'text':'Every referenced DataClass in a startquery needs a specified classname, attribute and a JSON-Path'
                            });
                        }
                    });
                    if (mapping.classname == "" || mapping.state == "") {
                        messages.push({
                            'type':'warning',
                            'text':'Every referenced DataClass in a startquery needs a specified classname, attribute and a JSON-Path'
                        })
                    }
                })
            });
            result.terminationconditions.forEach(function(terminationcondition){
                if (terminationcondition == "") {
                    messages.push({
                        'type': 'warning',
                        'text': 'Empty terminationconditions are not allowed.'
                    })
                }
            });
            result.fragments.forEach(function(fragment) {
                var val = new Validator(fragment,function() {
                    val.validateEverything();
                    messages = messages.concat(val.messages);
                    result_count++;
                    if (result_count == result.fragments.length) {
                        var display = ["danger","warning"];
                        messages = messages.filter(function(message){
                            return (display.indexOf(message.type) >= 0);
                        });
                        res.json(messages);
                    }
                });
            });
        } else {
            res.status(404).end();
        }
    });
});

/**
 * Returns the scenario with the given ID.
 * @class getScenario
 */
router.get('/:scenID', function(req, res) {
    var id = req.params.scenID;
    var populate = req.query.populate;
    var query = Scenario.findOne({_id:id});
    if (populate) {
        query = query.populate('fragments').populate('domainmodel');
    }
    var dl = req.query.download;
    query.exec(function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            if (dl) {
                result = result.toObject();
                if (populate) {
                    result.domainmodel.dataclasses = result.domainmodel.dataclasses.map(function(dclass){
                        if (dclass.olc != undefined) dclass.olc = parseToOLC(dclass.olc);
                        return dclass;
                    });
                }
                res.append('Content-disposition','attachment');
                res.append('filename', result.name + '.json');
            }
            res.json(result)
        } else {
            res.status(404).end();
        }
    });
});

var validateFragmentList = function(list) {
    var found = true;
    list.forEach(function(fm_id){
        if (Fragment.find(fm_id).count() === 0) {
            found = false;
        }
    });
    return found;
};

/**
 * Exports the scenario with the given ID to the export-target with the given ID.
 * This means the scenario will be send via POST to the target with '/scenario' appended.
 * This also means that you can export scenarios to another gryphon-instance.
 * @class postScenarioExport
 */
router.post('/:scenID/export', function(req, res) {
    var target = req.body.exportID;
    var scenID = req.params.scenID;

    var query = Scenario.findOne({_id:scenID}).populate('domainmodel').populate('fragments');

    query.exec(function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            Export.findOne({_id:target},function(err, result2){
                if (err) {
                    console.error(err);
                    res.status(500).end();
                    return;
                }
                if (result2 !== null) {
                    var client = new RestClient();
                    result = result.toObject();
                    result.domainmodel.dataclasses = result.domainmodel.dataclasses.map(function(dclass){
                        if (dclass.olc != undefined) {
                            dclass.olc = parseToOLC(dclass.olc);
                        }
                        return dclass;
                    });
                    var args = {
                        data: result,
                        headers: {"Content-Type": "application/json"}
                    };
                    client.post(result2.url + '/scenario', args, function(data, response){
                        console.log(data);
                        var message = {};
                        if (response.statusCode >= 200 && response.statusCode < 300) {
                            message.type = 'success';
                            message.text = 'Export succesfull!'
                        } else {
                            message.type = 'danger';
                            message.text = 'Export not succesfull!'
                        }
                        if (data != null && data instanceof Array) {
                            data.unshift(message);
                        } else {
                            data = [message];
                        }
                        res.json(data);
                    }).on('error',function(){
                        res.status(200);
                        res.json([{
                            'type': 'danger',
                            'text': 'Export not succesfull, Error occured.'
                        }]);
                    });
                } else {
                    res.status(404).end();
                }
            });
        } else {
            res.status(404).end();
        }
    });
});

/**
 * Updates a given scenario.
 * @class postScenario
 */
router.post('/:scenID', function(req, res) {
    var scenID = req.params.scenID;
    var new_scen = req.body;
    Scenario.findOne({_id:scenID}, function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {

            var changed = false;

            if (new_scen.name != null && result.name !== new_scen.name) {
                result.name = new_scen.name;
                changed = true;
            }

			if (new_scen.description != null && result.description !== new_scen.description) {
                result.description = new_scen.description;
                changed = true;
            }
			
            if (new_scen.terminationconditions != null && !(_.isEqual(result.terminationconditions, new_scen.terminationconditions))) {
                result.terminationconditions = new_scen.terminationconditions;
                changed = true;
            }

            if (new_scen.fragments != null && !_.isEqual(result.fragments, new_scen.fragments) && validateFragmentList(new_scen.fragments)) {
                result.fragments = new_scen.fragments;
                changed = true;
            }

            if (new_scen.startconditions != null && !(_.isEqual(result.startconditions, new_scen.startconditions))) {
                result.startconditions = new_scen.startconditions;
                changed = true;
            }

            if (new_scen.domainmodel != null && result.domainmodel !== new_scen.domainmodel) {
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
                });
            }
            res.json(result);
        } else {
            res.status(404).end();
        }
    })
});

/**
 * Deletes the given scenario
 * @class deleteScenario
 */
router.delete('/:scenID', function(req, res) {
    var id = req.params.scenID;
    Scenario.findOne({_id:id},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            result.remove();
        } else {
            res.status(404).end();
        }
    });
});

module.exports = router;
