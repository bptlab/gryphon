var $ = require('jquery'),
    OLCModeler = require('./modeler'),
    Config = require('./../config');

var Editor = function(canvas) {
    this.renderer = new OLCModeler({
        container: canvas
    });
    this.renderer.createDiagram(function(){});
};

Editor.prototype.loadDiagramStub = function() {
    return ""; //Config.DEFAULT_OLC_XML;
};

Editor.prototype.exportOLC = function(dataclass,callback) {
    this.renderer.saveXML({format: true},function(err, xml){
        if (!err) {
            dataclass.olc = xml;
            callback(dataclass);
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