var Config = require('./../../config');

var ResourceAPI = function(host) {
    this.host = host;
};

ResourceAPI.prototype.createResourceURL = function(endpoint) {
    // return this.host.concat("resource-types/" + endpoint);
    return "http://localhost:7000/resource-types/" + endpoint;
};

ResourceAPI.prototype.createProblemURL = function(endpoint) {
    return this.host.concat("problems/" + endpoint);
};

ResourceAPI.prototype.getServerInformation = function(callback) {
    $.getJSON(this.host.concat("server"), callback);
}

ResourceAPI.prototype.getAvailableResourceTypes = function (callback) {
    // $.getJSON(this.createResourceURL(""), callback);
    $.ajax({
        method: 'GET',
        url: this.createResourceURL(""),
        contentType: "application/vnd.api+json",
        success: callback,
        accepts: {
            mycustomtype: 'application/vnd.api+json'
        },
        converters: {
            'text mycustomtype': function (result) {
                const jsonResult = JSON.parse(result);
                return jsonResult.data;
            }
        },

        // Expect a `mycustomtype` back from server
        dataType: 'mycustomtype'
    });
}

ResourceAPI.prototype.getAvailableOptimizationProblems = function(callback) {
    $.getJSON(this.createProblemURL(""), callback);
}

ResourceAPI.prototype.getAvailableOptimizationMethodsForProblem = function(problemId, callback) {
    $.getJSON(this.createProblemURL(problemId + "/methods"), callback);
}

module.exports = new ResourceAPI(Config.RESOURCE_MANAGER_HOST);
