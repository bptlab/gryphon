'use strict';

var $ = require('jquery'),
    BpmnModeler = require('bpmn-js/lib/Modeler'),
    //API = require('./api'),
    Config = require('./config');

var Editor = function(canvas) {
    this.renderer = new BpmnModeler({
        container: canvas
    });
    this.createNewDiagram();
};

Editor.prototype.loadDiagramStub = function() {
    return Config.DEFAULT_FRAGMENT_XML;
};

Editor.prototype.exportFragment = function(fragment,callback) {
    this.renderer.saveXML({format: true},function(err, xml){
        if (!err) {
            fragment.content = xml;
            callback(fragment);
        }
    });
};

Editor.prototype.createNewDiagram = function() {
    this.openDiagram(this.loadDiagramStub());
};

Editor.prototype.openDiagram = function(xml, callback) {
    this.renderer.importXML(xml, callback);
};

Editor.prototype.importFragment = function(fragment, callback) {
    this.renderer.importXML(fragment.content, callback);
};

module.exports = Editor;