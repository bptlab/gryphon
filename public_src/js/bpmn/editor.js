'use strict';

var $ = require('jquery'),
    BPMNModeller= require('bpmn-js/lib/Modeler'),
    BPMNPropertyPanel = require('bpmn-js-properties-panel'),
    generateProvider = require('./provider');

var ModdleDescriptor = require('./bpmnextension');
var resourceDescriptor = require('./resource/resource.json')

var ResourceRenderer = require('./resource/resourceRenderer');
var ResourceElementFactory = require('./resource/resourceElementFactory');
var ResourceContextPad = require('./resource/resourceContextPad');

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
    /**
     * This renders an editor and loads the diagram.
     * It overrides the PropertyPanelProvider and loads the Panel itself.
     * It also loads (moddleExtensions) the additional bpmn-definitions.
     */
    this.renderer = new BPMNModeller({
        container: this.canvas,
        propertiesPanel: {
            parent: this.propertypanel
        },
        additionalModules: [
            {
                __init__: ['resourceRenderer', 'resourceContextPad', 'elementFactory'],
                resourceRenderer: [ 'type', ResourceRenderer ],
                resourceContextPad: [ 'type', ResourceContextPad ],
                elementFactory: ['type', ResourceElementFactory]
            },
            BPMNPropertyPanel,
            generateProvider(fragment._id)
        ],
        moddleExtensions: {
            griffin: ModdleDescriptor,
            resource: resourceDescriptor,
        }
    });
    this.renderer.importXML(fragment.content, function(){
        this.renderer.get('eventBus').on('element.changed', this.handleChange);
        callback()
    }.bind(this));
};

/**
 * This function handles changes of the edited diagram. In case there is a change on a
 * dataobjectreference it ensures that the propertys dataclass and state get updated correctly.
 */
Editor.prototype.handleChange = function(event, object) {
    if (object.element.businessObject != null) {
        var bo = object.element.businessObject;
        if (bo.$type == "bpmn:DataObjectReference") {
            if (bo.name != null) {
                var end = bo.name.indexOf("[");
                var realend = bo.name.indexOf("]");
                if (end >= 0 && realend >= 0 && realend > end) {
                    bo.dataclass = bo.name.substring(0,end).trim();
                    bo.state = bo.name.substring(end+1,realend).trim();
                }
                // Re-generate name (to discard trimmed whitespace)
                bo.name = bo.dataclass + "[" + bo.state + "]";
            }
        }
    }
};

Editor.prototype.downloadSVG = function(filename) {

    // Replace non-alphanumeric characters (except for '-' and '.') with '-'
    filename = filename.replace(/[^a-zA-Z0-9\-.]+/g, '-');
    
    this.renderer.saveSVG({}, function(err, svgStr) {

        var element = document.createElement('a');
        element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);

    });
}

module.exports = Editor;
