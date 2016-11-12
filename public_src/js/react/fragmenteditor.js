var React = require('react');
var Editor = require('./../bpmn/editor');
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
                <div className="upperRightButtons" id="upperRightButtons">
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
        MessageHandler.resetMessages();
        var interval = setInterval(this.autoSave,Config.FRAGMENT_SAVE_INTERVAL);
        this.setState({interval: interval});
        this.props.setEditorInstance(this);
    },
    loadDiagram: function() {
        API.getFragment(this.props.params.fragmentId,function(data) {
            this.setState({fragment: data});
            this.state.editor.importFragment(data, function(err){
                if (err) {
                    MessageHandler.handleMessage("danger", "Failed to load diagram.");
                    console.log(err);
                }
            });
        }.bind(this));
    },
    componentDidUpdate: function() {
        if (this.state.fragment != null && this.state.fragment._id != null && this.props.params.fragmentId != this.state.fragment._id) {
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
          console.log("FragmentEditor saveDiagram res_handler data: ", data);
          if (show_success) {
            MessageHandler.handleMessage('success', 'Saved fragment!');
          }
          API.validateFragment(this.state.fragment._id,function(result){
            if (show_success) {
              result.messages.forEach(function(message){
                MessageHandler.handleMessage(message.type, message.text);
              })
            }
          }.bind(this))
        }.bind(this);
        if (this.state.editor !== null && this.state.fragment !== null) {
          this.state.editor.exportFragment(this.state.fragment, function(data) {
            // TODO FIXME: res_handler is never called...why? Maybe because the answer is not valid JSON?
            API.exportFragment(this.state.fragment, data, res_handler);
          }.bind(this));
        }
    },
    componentWillUnmount: function() {
        this.saveDiagram(false);
        clearInterval(this.state.interval);
    }
});

module.exports = FragmentEditorComponent;
