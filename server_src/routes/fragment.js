var express = require('express');
var router = express.Router();
var Config = require('./../../config');
var Fragment = require('./../models/fragment').model;
var Scenario = require('./../models/scenario').model;
var JSONHelper = require('./../helpers/json');
var Validator = require('./../helpers/validator').Validator;
var _ = require('lodash');

/**
 * You can find further information about all endpoints in the swagger.yaml
 * @module routes.fragment
 */

/**
 * Returns the fragment with the given ID
 * @class getFragment
 */
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

/**
 * Update the fragment with the given ID.
 * @class postFragment
 */
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

            if (new_frag.preconditions != null && ! (_.isEqual(result.preconditions, new_frag.preconditions))) {
                changed = true;
                result.preconditions = new_frag.preconditions;
            }

			if (new_frag.policy != null && result.policy !== new_frag.policy) {
				changed = true;
				result.policy = new_frag.policy;
			}

			if (new_frag.bound != null && ! (_.isEqual(result.bound, new_frag.bound))) {
				changed = true;
				result.bound = new_frag.bound;
			}

			if (new_frag.automaticActivation != null && result.automaticActivation !== new_frag.automaticActivation) {
			    changed = true;
			    result.automaticActivation = new_frag.automaticActivation;
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
 * Returns all fragments. This list can be filtered by the name of the fragments by using the query parameter.
 * @class getFragments
 */
router.get('/', function(req, res) {
    var name = req.query.query;

    Fragment.find({name: new RegExp(name, "i")},function(err, result){
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

/**
 * Creates a new fragment with the given name.
 * @class postNewFragment
 */
router.post('/', function(req, res) {
    var fragment = req.body;
    var db_fragment = new Fragment({
        name: fragment.name,
        content: (fragment.content ? fragment.content : Config.DEFAULT_FRAGMENT_XML),
        preconditions: (fragment.preconditions ? fragment.preconditions : [""]),
        policy: (fragment.policy ? fragment.policy : Config.DEFAULT_FRAGMENT_POLICY),
        bound: (fragment.bound ? fragment.bound : {hasBound: false, limit: Config.DEFAULT_FRAGMENT_INSTANTIATION_AMOUNT}),
        automaticActivation: (fragment.automaticActivation ? fragment.automaticActivation : false),
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

/**
 * Returns the structure of the fragment parsed into an JSON-object.
 * @class getFragmentStructure
 */
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

/**
 * Returns the xml of the given fragment.
 * @class getFragmentXML
 */
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

/**
 * Deletes the given fragment
 * @class deleteFragment
 */
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

/**
 * Validates the given fragment.
 * @class getValidateFragment
 */
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

/**
 * Returns the domainmodel this fragment is associated with.
 * @class getAssociatedDomainModelFragment
 */
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
