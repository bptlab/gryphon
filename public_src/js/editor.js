'use strict';

var $ = require('jquery'),
    BPMNModeller= require('bpmn-js/lib/Modeler'),
    Config = require('./config'),
    BPMNPropertyPanel = require('bpmn-js-properties-panel'),
    //BPMNPropertyPanelProvider = require('bpmn-js-properties-panel/lib/provider/bpmn');
    BPMNPropertyPanelProvider = require('./bpmnext/provider');

var ModdleDescriptor = require('./bpmnext/bpmnextension');

var Editor = function(canvas, propertypanel) {
    this.renderer = new BPMNModeller({
        container: canvas,
        propertiesPanel: {
            parent: propertypanel
        },
        additionalModules: [
            BPMNPropertyPanel,
            BPMNPropertyPanelProvider
        ],
        moddleExtensions: {
            griffin: ModdleDescriptor
        }
    });
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

Editor.prototype.openDiagram = function(xml, callback) {
    this.renderer.importXML(xml, callback);
};

Editor.prototype.importFragment = function(fragment, callback) {
    this.renderer.importXML(fragment.content, callback);
};  

module.exports = Editor;