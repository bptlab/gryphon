var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../editor');
var API = require('./../api');
var MessageHandler = require('./../messagehandler');
var Config = require('./../config');

var MessageComponent = React.createClass({
    handleDismiss: function() {
        this.props.handleDelete(this)
    },
    render: function() {
        return (
            <div className={"alert alert-" + this.props.type + " alert-dismissible"} role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={this.handleDismiss} ><span aria-hidden="true">&times;</span></button>
                {this.props.message}
            </div>
        )
    },
    componentDidMount: function() {
        setTimeout(this.handleDismiss, Config.MESSAGE_DISMISS_TIME);
    }
});

var MessageBarComponent = React.createClass({
    getInitialState: function() {
        return {
            messages: []
        }
    },
    handleDelete: function(message) {
        var index = array.indexOf(message);
        if (index > -1) {
            array.splice(index, 1);
        }
    },
    handleMessage: function(type, text) {
        this.messages.push(
            <MessageComponent handleDelete={this.handleDelete} type={type} text={text} />
        )
    },
    render: function() {
        return (
            <div className="messagebar">
                {this.state.messages}
            </div>
        )
    },
    componentDidMount: function() {
        MessageHandler.setRoot(this)
    },
    componentDidUnmount: function() {
        MessageHandler.setRoot(null)
    }
});

module.exports = MessageBarComponent;