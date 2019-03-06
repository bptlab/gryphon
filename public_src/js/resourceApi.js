var Config = require('./../../config');

var ResourceAPI = function(host) {
    this.host = host;
};

ResourceAPI.prototype.createResourceURL = function(endpoint) {
    return this.host.concat("resources/" + endpoint);
};

ResourceAPI.prototype.createMethodURL = function(endpoint) {
    return this.host.concat("methods/" + endpoint);
};

ResourceAPI.prototype.getAvailableResourceTypes = function(callback) {
    $.getJSON(this.createResourceURL(""), callback);
}

ResourceAPI.prototype.getAvailableOptimizationMethods = function(callback) {
    $.getJSON(this.createMethodURL(""), callback);
}

module.exports = new ResourceAPI(Config.RESOURCE_MANAGER_HOST);
