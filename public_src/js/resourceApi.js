var Config = require('./../../config');
var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;

var ResourceAPI = function(host) {
    this.host = host;
};

ResourceAPI.prototype.createResourceURL = function(endpoint) {
    return this.host.concat("organization/resource-types/" + endpoint);
};

ResourceAPI.prototype.createProblemURL = function(endpoint) {
    return this.host.concat("optimization/recipes/" + endpoint);
};

ResourceAPI.prototype.getAvailableResourceTypes = function(callback) {
    this.get(this.createResourceURL(""), callback);
}

ResourceAPI.prototype.getAvailableOptimizations = function(callback) {
    this.get(this.createProblemURL(""), callback);
}

ResourceAPI.prototype.get = function (url, callback) {
    $.ajax({
        method: 'GET',
        url: url,
        contentType: "application/vnd.api+json",
        success: function (json) {
            new JSONAPIDeserializer({ keyForAttribute: 'camelCase' }).deserialize(json, function (err, result) {
                callback(result);
            });
        }
    });
}


module.exports = new ResourceAPI(Config.RESOURCE_MANAGER_HOST);
