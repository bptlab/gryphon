var Config = require('./config')

var API = function(host) {
    this.host = host;
};

API.prototype.createURL = function(endpoint) {
    return this.host.concat(endpoint);
};

API.prototype.getFragmentXML = function(id, callback) {
    $.ajax({
        url: this.createURL("fragment/" + id + "/xml"),
        success: callback,
        dataType: "text"
    });
};

API.prototype.getFragment = function(id, callback) {
    $.getJSON(this.createURL("fragment/" + id), callback);
};

API.prototype.postFragment = function(fragment, callback) {
    args = {
        data: fragment,
        path: {id: fragment.id}
    };
    this.client.methods.postFragment(args, callback);
};

API.prototype.getFullScenario = function(id, populate, callback) {
    if (typeof callback === 'undefined') {
        callback = populate;
        populate = '0';
    }
    $.getJSON(this.createURL("scenario/" + id + "?populate=" + populate), callback);
};

API.prototype.getAllScenarios = function(callback, populate) {
    $.getJSON(this.createURL("scenario"), callback);
    //this.client.methods.getAllScenarios(callback);
};

API.prototype.exportFragment = function(fragment, callback) {
    $.post(this.createURL("fragment/" + fragment._id),fragment,callback);
};

module.exports = new API(Config.API_HOST);
//module.exports = new API(Config.API_HOST);