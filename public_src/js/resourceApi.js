var Config = require('./../../config');

var ResourceAPI = function(host) {
    this.host = host;
};

ResourceAPI.prototype.createResourceURL = function(endpoint) {
    return this.host.concat("resources/" + endpoint);
};

ResourceAPI.prototype.getAvailableResourceTypes = function(callback) {
    $.getJSON(this.createResourceURL(""), callback);
}

module.exports = new ResourceAPI(Config.RESOURCE_MANAGER_HOST);
