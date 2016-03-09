
var SideBarManager = function() {
    this.func = null;
};

//Sets root element where all messages get applied.
SideBarManager.prototype.setHandler = function(func) {
    this.func = func;
};

SideBarManager.prototype.reload = function() {
    console.log("Reloading. 0");
    if (this.func) {
        console.log("Reloading. 1");
        this.func();
    }
};

module.exports = new SideBarManager();