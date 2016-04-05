'use strict';

var $ = require('jquery'),
    BPMNModeller= require('bpmn-js/lib/Modeler'),
    Config = require('./config'),
    BPMNPropertyPanel = require('bpmn-js-properties-panel'),
    //BPMNPropertyPanelProvider = require('bpmn-js-properties-panel/lib/provider/bpmn');
    generateProvider = require('./bpmnext/provider');

var ModdleDescriptor = require('./bpmnext/bpmnextension');

var Editor = function(canvas, propertypanel) {
    this.canvas = canvas;
    this.propertypanel = propertypanel;
};

Editor.prototype.exportFragment = function(fragment,callback) {
    if (this.renderer) {
        this.renderer.saveXML({format: true},function(err, xml){
            if (!err) {
                fragment.content = xml;
                callback(fragment);
            }
        });
    }
};

Editor.prototype.importFragment = function(fragment, callback) {
    if (this.renderer) {
        $('#fragment-properties').empty();
        this.renderer.destroy();
    }
    this.renderer = new BPMNModeller({
        container: this.canvas,
        propertiesPanel: {
            parent: this.propertypanel
        },
        additionalModules: [
            BPMNPropertyPanel,
            generateProvider(fragment._id)
        ],
        moddleExtensions: {
            griffin: ModdleDescriptor
        }
    });
    this.renderer.importXML(fragment.content, callback);
};  

module.exports = Editor;