var express = require('express');
var router = express.Router();
var Config = require('./../config');
var RestClient = require('node-rest-client').Client;
var ExportModel = require('./../models/export').model;

/* GET fragment belonging to scenario and fragment. */
router.get('/', function(req, res, next) {
    ExportModel.find(function(err,models){
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        res.json(models);
    });
});

router.post('/',function(req,res,next) {
    var newexport = new ExportModel({
        name: req.body.name,
        url: req.body.url
    });
    newexport.save();
    res.json(newexport);
});

router.post('/:id',function(req,res,next){
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

function validateURL(textval) {
    return true;
    //var urlregex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@|\d{1,3}(?:\.\d{1,3}){3}|(?:(?:[a-z\d\x{00a1}-\x{ffff}]+-?)*[a-z\d\x{00a1}-\x{ffff}]+)(?:\.(?:[a-z\d\x{00a1}-\x{ffff}]+-?)*[a-z\d\x{00a1}-\x{ffff}]+)*(?:\.[a-z\x{00a1}-\x{ffff}]{2,6}))(?::\d+)?(?:[^\s]*)?$/iu;
    //return urlregex.test(textval);
}

router.get('/validate',function(req,res,next){
    var url = req.query.url + '/version';

    if (!validateURL(url)) {
        res.json({
            'type': 'danger',
            'text': url + ' is not a valid URL.'
        })
    } else {
        var client = new RestClient();
        client.on('error',function(err){
            res.json({
                'type': 'danger',
                'text': 'No valid response using ' + url + '/version',
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
        }.bind(this)).on('error',function(err){
            console.log(err);
            res.json({
                'type': 'danger',
                'text': 'No valid response using ' + url
            })
        }.bind(this));
    }
});

router.delete('/:id', function(req, res, next) {
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