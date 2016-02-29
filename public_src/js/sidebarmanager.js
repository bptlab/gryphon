
var SideBarManager = function() {
    this.rootElement = null;
};

//Sets root element where all messages get applied.
SideBarManager.prototype.setRoot = function(element) {
    this.rootElement = element;
};

SideBarManager.prototype.reload = function() {
    if (this.rootElement) {
        this.rootElement.reloadAll();
    }
};

module.exports = new SideBarManager();