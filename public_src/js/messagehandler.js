// A short registry to store a global reference (Wooah Antipattern)
// to the Message Bar. This makes it far easier to show uniform messages
// in the interface.
var MessageHandler = function() {
    this.rootElement = null;
};

//Sets root element where all messages get applied.
MessageHandler.prototype.setRoot = function(element) {
    this.rootElement = element;
};

MessageHandler.prototype.handleMessage = function(type, text) {
    if (this.rootElement) {
        this.rootElement.handleMessage(type, text);
    }
};

MessageHandler.prototype.resetMessages = function() {
    if (this.rootElement) {
        this.rootElement.resetMessages();
    }
};

module.exports = new MessageHandler();