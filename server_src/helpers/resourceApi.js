var Config = require('./../../config');
const fetch = require('node-fetch');
var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;

var ResourceAPI = function (host) {
    this.host = host;
};

ResourceAPI.prototype.createResourceURL = function (endpoint) {
    return this.host.concat("organization/resource-types/" + endpoint);
};

ResourceAPI.prototype.createProblemURL = function (endpoint) {
    return this.host.concat("optimization/recipes/" + endpoint);
};

ResourceAPI.prototype.getResourceTypes = function (id = "") {
    return this.get(this.createResourceURL(id));
}

ResourceAPI.prototype.getOptimizations = function (id = "") {
    return this.get(this.createProblemURL(id));
}

ResourceAPI.prototype.get = async function (url) {
    let response;
    try {
        response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/vnd.api+json' } });
    } catch (error) {
        throw new Error(`Connection to server failed. ${error}`);
    }

    if (response.statusText === 'No Content') {
        return;
    }

    const responseJson = await response.json();

    if (response.status >= 300) {
        const error = responseJson.errors[0];
        throw new Error(`${error.status} - ${error.title}. ${error.detail}`);
    }

    const deserializer = new JSONAPIDeserializer({ keyForAttribute: 'camelCase' });
    return deserializer.deserialize(responseJson);
}

module.exports = new ResourceAPI(Config.RESOURCE_MANAGER_HOST);
