var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../olc/editor');
var MessageHandler = require('./../messagehandler');
var API = require('./../api');
var Config = require('./../config');
var Validator = require('./../bpmnext/validator');
var Link = require('react-router').Link;

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
            <div className="fragmentEditor">
                <div className="lowerRightButtons" id="upperRightButtons">
                    <button type="button" className="btn btn-success" onClick={this.saveDiagram}>Save OLC</button>
                </div>
                <div className="canvas" id="fragment-canvas" />
            </div>
        )
    },
    componentDidMount: function() {
        var editor = new Editor($('#fragment-canvas'));
        this.setState({editor: editor});
        this.loadDiagram();
        MessageHandler.resetMessages();
        var interval = setInterval(this.autoSave,Config.FRAGMENT_SAVE_INTERVAL);
        this.setState({interval: interval});
    },
    loadDiagram: function() {
        API.loadDomainModel(this.props.params.dmid,function(data) {
            this.setState({dm: data, dclassid: this.props.params.dclassid});
            console.log(data);
            var dclass = data.dataclasses.filter(function(dclass){
                return (dclass._id == this.props.params.dclassid);
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
            });
        }.bind(this));
    },
    componentDidUpdate: function() {
        if (this.state.dm != null && this.state.dm._id != null && ((this.props.params.dmid != this.state.dm._id) || (this.props.params.dclassid != this.state.dclassid))) {
            this.saveDiagram(false);
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
        if (this.state.editor !== null && this.state.fragment !== null) {
            this.state.editor.exportOLC(this.state.dm, this.state.dclassid, function(data) {
                API.exportDomainModel(data, res_handler);
            });
        }
    },
    componentWillUnmount: function() {
        this.saveDiagram(false);
        clearInterval(this.state.interval);
    }
});

module.exports = OLCEditorComponent;