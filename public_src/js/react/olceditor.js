var React = require('react');
var Editor = require('./../olc/editor');
var MessageHandler = require('./../messagehandler');
var API = require('./../api');
var Config = require('./../config');

var OLCEditorComponent = React.createClass({
    getInitialState: function() {
        return {
            editor: null,
            dm: null,
            dclassid: -1
        }
    },
    render: function() {
        return (
            <div className="olcEditor">
                <div className="canvas" id="fragment-canvas" />
                <div className="properties-panel" id="fragment-properties" />
            </div>
        )
    },
    componentDidMount: function() {
        var editor = new Editor($('#fragment-canvas'),$('#fragment-properties'));
        this.setState({editor: editor}, this.loadDiagram);
        // loadDiagram will be called once the editor is set as state
        // this.loadDiagram();
        MessageHandler.resetMessages();
        var interval = setInterval(this.autoSave,Config.FRAGMENT_SAVE_INTERVAL);
        this.setState({interval: interval});
    },
    loadDiagram: function() {
        API.loadDomainModel(this.props.domainmodelId,function(data) {
            this.setState({dm: data, dclassid: this.props.dataclassId});
            var dclass = data.dataclasses.filter(function(dclass){
                return (dclass._id == this.props.dataclassId);
            }.bind(this));
            if (dclass.length !== 1){
                console.log("Did something wrong.");
            }
            dclass = dclass[0];
            this.state.editor.openDiagram(dclass.olc, function(err){
                if (err) {
                    MessageHandler.handleMessage("danger", "Failed to load diagram.");
                    console.log(err);
                }
                if(this.props.diagramLoadedCallback) {
                  this.props.diagramLoadedCallback();
                }
            }.bind(this));
        }.bind(this));
    },
    componentDidUpdate: function() {
        if (this.state.dm != null && this.state.dm._id != null && ((this.props.domainmodelId != this.state.dm._id) || (this.props.dataclassId != this.state.dclassid))) {
            // Do not save automatically, this has to be done explicitly
            //this.saveDiagram(false);
            MessageHandler.resetMessages();
            this.loadDiagram();
        }
    },
    saveDiagram: function(show_success) {
        if (show_success == undefined) {
            show_success = true;
        }
        var res_handler = function(data) {
            console.log(data);
            if (show_success) {
                MessageHandler.handleMessage('success', 'Saved OLC-diagram!');
            }
        }.bind(this);
        if (this.state.editor !== null && this.state.dclassid !== null && this.state.dm !== null) {
            this.state.editor.exportOLC(this.state.dm, this.state.dclassid, function(data) {
                //API.exportDomainModel(data, res_handler);
                this.props.changeHandler(data);
                this.setState({dm: data});
            }.bind(this));
        }
    },
    componentWillUnmount: function() {
        this.saveDiagram(false);
        clearInterval(this.state.interval);
    }
});

module.exports = OLCEditorComponent;
