var React = require('react');
var MessageHandler = require('./../../messagehandler');
var MessageComponent = require('./message');

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
    resetMessages: function() {
        this.setState({messages: []});
    },
    handleMessage: function(type, text) {
        var newmessages = this.state.messages.filter(function(message){
            return (message.text != text) || (message.type != type);
        });
        newmessages.push({
            'text':text,
            'type':type,
            'key':newmessages.length
        });
        this.setState({ messages: newmessages });
    },
    render: function() {
        var handleDelete = this.handleDelete;
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