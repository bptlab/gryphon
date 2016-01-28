var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../editor');
var MessageHandler = require('./../messagehandler');
var API = require('./../api');
var Config = require('./../config');

var FragmentEditorComponent = React.createClass({
    getInitialState: function() {
        return {
            editor: null,
            fragment: null,
            interval: -1
        }
    },
    render: function() {
        return (
            <div className="fragmentEditor">
                <div className="lowerRightButtons" id="upperRightButtons">
                    <button type="button" className="btn btn-success" onClick={this.saveDiagram} >Save Fragment</button>
                </div>
                <div className="canvas" id="fragment-canvas" />
                <div className="properties-panel" id="fragment-properties" />
            </div>
        )
    },
    componentDidMount: function() {
        var editor = new Editor($('#fragment-canvas'),$('#fragment-properties'));
        this.setState({editor: editor});
        this.loadDiagram();
        var interval = setInterval(this.autoSave,Config.FRAGMENT_SAVE_INTERVAL);
        this.setState({interval: interval});
    },
    loadDiagram: function() {
        API.getFragment(this.props.params.id,function(data) {
            this.setState({fragment: data});
            this.state.editor.openDiagram(data.content, function(err){
                if (err) {
                    MessageHandler.handleMessage("danger", "Failed to load diagram.");
                    console.log(err);
                }
            });
        }.bind(this));
    },
    componentDidUpdate: function() {
        if (this.state.fragment != null && this.state.fragment._id != null && this.props.params.id != this.state.fragment._id) {
            this.saveDiagram(false);
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
                MessageHandler.handleMessage('success', 'Saved fragment!');
            }
            API.validateFragment(this.state.fragment._id,function(result){
                result.messages.forEach(function(message){
                    MessageHandler.handleMessage(message.type,message.text);
                })
            }.bind(this))
        }.bind(this);
        if (this.state.editor !== null && this.state.fragment !== null) {
            this.state.editor.exportFragment(this.state.fragment, function(data) {
                API.exportFragment(data, res_handler);
            });
        }
    },
    componentWillUnmount: function() {
        this.saveDiagram(false);
        clearInterval(this.state.interval);
    }
});

module.exports = FragmentEditorComponent;