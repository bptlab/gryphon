var express = require('express');
var router = express.Router();
var Config = require('./../../config');
var Fragment = require('./../models/fragment').model;
var Scenario = require('./../models/scenario').model;
var JSONHelper = require('./../helpers/json');
var Validator = require('./../helpers/validator').Validator;

/* GET fragment belonging to scenario and fragment. */
router.get('/:fragID', function(req, res) {
    var id = req.params.fragID;
    var deliver_xml = req.query.deliver_xml;
    Fragment.findOne({_id:id},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            if (!deliver_xml) {
                delete result.content;
            }
            res.json(result)
        } else {
            res.status(404).end();
        }
    });
});

/* Post new fragment to a given scenario. If fragment name already exists post new revision */
router.post('/:fragID', function(req, res) {
    var frag_id = req.params.fragID;
    var new_frag = req.body;

    Fragment.findOne({_id:frag_id}, function(err,result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {

            var changed = false;

            if (new_frag.name != null && result.name !== new_frag.name) {
                changed = true;
                result.name = new_frag.name;
            }

            if (new_frag.content != null && result.content !== new_frag.content) {
                changed = true;
                result.content = new_frag.content;
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

router.get('/', function(req, res) {
    var name = req.query.query;

    Fragment.model.find({name: new RegExp('^'+name+'$', "i")},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {

            var res_object = {
                content_length: result.length,
                fragments: result
            };

            res.json(res_object)
        } else {
            res.status(404).end();
        }
    });
});

router.post('/', function(req, res) {
    var fragment = req.body;
    var db_fragment = new Fragment({
        name: fragment.name,
        content: (fragment.content ? fragment.content : Config.DEFAULT_FRAGMENT_XML),
        revision: 1
    });

    db_fragment.save(function(err){
        if (err) {
            console.error(err);
            res.status(500).end();
        } else {
            res.json(db_fragment);
        }
    });
});

router.get('/:fragID/structure', function(req, res) {
    var id = req.params.fragID;
    Fragment.findOne({_id:id},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            var parsed = JSONHelper.parseToBPMNObject(result.content);
            res.json(parsed);
        } else {
            res.status(404).end();
        }
    });
});

router.get('/:fragID/xml', function(req, res){
    var id = req.params.fragID;
    Fragment.findOne({_id:id},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            res.set('Content-Type','text/xml');
            res.send(result.content);
        } else {
            res.status(404).end();
        }
    });
});

router.delete('/:fragID', function(req, res) {
    var id = req.params.fragID;
    Fragment.findOne({_id:id},function(err, result){
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

router.get('/:fragID/validate', function(req, res) {
   var id = req.params.fragID;
    Fragment.findOne({_id:id},function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            var validator = new Validator(result,function() {
                validator.validateEverything();
                res.json({
                    messages:validator.messages
                })
            });
        } else {
            res.status(404).end();
        }
    })
});

router.get('/:fragID/assocdomainmodel', function(req, res){
    Scenario.findOne({fragments:req.params.fragID}).populate('domainmodel').exec(function(err, result){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        if (result !== null) {
            res.json(result.domainmodel);
        } else {
            res.status(404).end();
        }
    });
});

module.exports = router;