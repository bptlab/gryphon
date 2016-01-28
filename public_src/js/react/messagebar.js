var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../editor');
var API = require('./../api');
var MessageHandler = require('./../messagehandler');
var Config = require('./../config');

var MessageComponent = React.createClass({
    handleDismiss: function() {
        this.props.handleDelete(this.props.text)
    },
    render: function() {
        return (
            <div className={"alert alert-" + this.props.type + " alert-dismissible"} role="alert">
                <button type="button" className="close" aria-label="Close" onClick={this.handleDismiss} ><span aria-hidden="true">&times;</span></button>
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
    handleDelete: function(message_text) {
        var newmessages = this.state.messages.filter(function(message){
            return (message.text != message_text)
        });
        this.setState({
            messages: newmessages
        })
    },
    handleMessage: function(type, text) {
        var newmessages = this.state.messages.filter(function(message){
            return (message.text != text) && (message.type != type);
        });
        newmessages.push({
            'text':text,
            'type':type,
            'key':newmessages.length
        });
        this.setState({ messages: newmessages })
    },
    render: function() {
        var handleDelete = this.handleDelete
        var messages = this.state.messages.map(function(message,index){
            return <MessageComponent handleDelete={handleDelete} type={message.type} text={message.text} key={index}/>
        });
        return (
            <div className="messagebar">
                {messages}
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