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
    this.renderer.importXML(fragment.content, function(){
        this.renderer.get('eventBus').on('element.changed', this.handleChange);
        callback()
    }.bind(this));
};

Editor.prototype.handleChange = function(event, object) {
    if (object.element.businessObject != null) {
        var bo = object.element.businessObject;
        if (bo.$type == "bpmn:DataObjectReference") {
            console.log(bo);
            if (bo.name != null) {
                var end = bo.name.indexOf("[");
                var realend = bo.name.indexOf("]");
                if (end >= 0 && realend >= 0 && realend > end) {
                    bo.dataclass = bo.name.substring(0,end);
                    bo.state = bo.name.substring(end+1,realend);
                }
            }
        }
    }
};

module.exports = Editor;