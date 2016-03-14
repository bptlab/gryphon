var $ = require('jquery'),
    Modeler = require('bpmn-js/lib/Modeler'),
    Config = require('./../config'),
    CustomPalette = require('./palette'),
    CustomContext = require('./context');

var Editor = function(canvas) {
    this.renderer = new Modeler({
        container: canvas,
        additionalModules: [
            CustomPalette,
            CustomContext
        ]
    });
    this.renderer.createDiagram(function(){});
};

Editor.prototype.exportOLC = function(dm,dclassid,callback) {
    this.renderer.saveXML({format: true},function(err, xml){
        if (!err) {
            dm.dataclasses = dm.dataclasses.map(function(dclass){
                if (dclass._id == dclassid) {
                    dclass.olc = xml;
                }
                return dclass;
            });
            callback(dm);
        }
    });
};

Editor.prototype.openDiagram = function(xml, callback) {
    this.renderer.importXML(xml, callback);
};

Editor.prototype.importOLC = function(dataclass, callback) {
    this.renderer.importXML(dataclass.olc, callback);
};

module.exports = Editor;