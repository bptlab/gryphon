var RestClient = require('node-rest-client').Client;
var Config = require('./conf')

var API = function(host) {
    this.host = host;

    this.client = RestClient;


    //Fragment-Logic
    this.client.registerMethod("getFragment", this.createURL("fragment/${id}"), "GET");
    this.client.registerMethod("postFragment", this.createURL("fragment/${id}"), "POST");
    this.client.registerMethod("searchFragment", this.createURL("fragment"), "GET");
    this.client.registerMethod("createFragment", this.createURL("fragment"), "POST");
    this.client.registerMethod("getFragmentXML", this.createURL("fragment/${id}/xml"), "GET");
    this.client.registerMethod("getFragmentStructure", this.createURL("fragment/${id}/structure"), "GET");
};

API.prototype.createURL = function(endpoint) {
    return this.host.concat(endpoint);
};

API.prototype.getFragment = function(id, callback) {
    args = {
        path: {id: id}
    };
    this.client.methods.getFragment(args, callback);
};

API.prototype.postFragment = function(fragment, callback) {
    args = {
        data: fragment,
        path: {id: fragment.id}
    };
    this.client.methods.postFragment(args, callback);
};

module.exports = new API(Config.API_HOST);