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
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.handleDismiss} ><span aria-hidden="true">&times;</span></button>
                {this.props.text}
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
        var index = this.state.messages.indexOf(message);
        var newarr = this.state.messages;
        if (index > -1) {
            newarr.splice(index, 1);
        }
        this.setState({
            messages: newarr
        })
    },
    handleMessage: function(type, text) {
        var newmessages = this.state.messages;
        newmessages.push(
            <MessageComponent handleDelete={this.handleDelete} type={type} text={text} />
        );
        this.setState({ messages: newmessages })
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
    componentWillUnmount: function() {
        MessageHandler.setRoot(null)
    }
});

module.exports = MessageBarComponent;