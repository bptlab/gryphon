var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../../bpmn/editor');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var Config = require('./../../config');

var MessageComponent = React.createClass({
    getDefaultProps: function() {
        return {handleDelete: function(text) {},allow_dismiss: true}
    },
    handleDismiss: function() {
        this.props.handleDelete(this.props.text)
    },
    render: function() {
        var dismiss_button = "";
        if (this.props.allow_dismiss) {
            dismiss_button = <button type="button" className="close" aria-label="Close" onClick={this.handleDismiss} ><span aria-hidden="true">&times;</span></button>
        }
        return (
            <div className={"alert alert-" + this.props.type + (this.props.allow_dismiss ? " alert-dismissible" : "")} role="alert">
                {dismiss_button}
                {this.props.text}
            </div>
        )
    },
    componentDidMount: function() {
        setTimeout(this.handleDismiss, Config.MESSAGE_DISMISS_TIME);
    }
});

module.exports = MessageComponent;
