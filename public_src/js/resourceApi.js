var Config = require('./../../config');

var ResourceAPI = function(host) {
    this.host = host;
};

ResourceAPI.prototype.createResourceURL = function(endpoint) {
    return this.host.concat("resources/" + endpoint);
};

ResourceAPI.prototype.createProblemURL = function(endpoint) {
    return this.host.concat("problems/" + endpoint);
};

ResourceAPI.prototype.getAvailableResourceTypes = function(callback) {
    $.getJSON(this.createResourceURL(""), callback);
}

ResourceAPI.prototype.getAvailableOptimizationProblems = function(callback) {
    $.getJSON(this.createProblemURL(""), callback);
}

ResourceAPI.prototype.getAvailableOptimizationMethodsForProblem = function(problemId, callback) {
    $.getJSON(this.createProblemURL(problemId + "/methods"), callback);
}

module.exports = new ResourceAPI(Config.RESOURCE_MANAGER_HOST);
