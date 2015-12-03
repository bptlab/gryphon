'use strict';

var $ = require('jquery'),
    BpmnModeler = require('bpmn-js/lib/Modeler'),
    API = require('./api');

var Editor = function(canvas) {
    this.renderer = new BpmnModeler({
        container: canvas
    });
};

Editor.prototype.storeAtServer = function(fragment) {
    this.renderer.saveXML({format: true},function(err, xml){
        if (!err) {
            fragment.content = xml;
            API.saveFragment(fragment);
        }
    });
};

Editor.prototype.createNewDiagram = function() {
    this.openDiagram(this.loadDiagramStub());
};

Editor.prototype.openDiagram = function(xml) {
    this.renderer.importXML(xml, function(err) {

    });
};

Editor.prototype.loadFromServer= function(id) {
    var fragment = API.getFragmentXML(id);
    this.renderer.importXML(fragment.content, function(err){

    });
};

module.exports = Editor;