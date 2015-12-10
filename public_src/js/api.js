var Config = require('./config');

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
        populate = false;
    }
    if (populate) {
        populate = "?populate=1";
    } else {
        populate = "";
    }
    $.getJSON(this.createURL("scenario/" + id + populate), callback);
};

API.prototype.createFragment = function(name, callback) {
    var newfrag = {
        name: name
    };
    $.post(this.createURL("fragment"),newfrag,callback);
};

API.prototype.associateFragment = function(scen_id, frag_id, callback) {
    var url = "scenario/associatefragment?";
    url += "scenario_id=" + scen_id;
    url += "&fragment_id=" + frag_id;
    $.post(this.createURL(url),'',callback);
};

API.prototype.getAllScenarios = function(populate, callback) {
    if (typeof callback === 'undefined') {
        callback = populate;
        populate = true;
    }
    if (populate) {
        populate = "?populate=1";
    } else {
        populate = "";
    }
    $.getJSON(this.createURL("scenario" + populate), callback);
    //this.client.methods.getAllScenarios(callback);
};

API.prototype.exportFragment = function(fragment, callback) {
    console.log(fragment);
    $.post(this.createURL("fragment/" + fragment._id),fragment,callback);
};

API.prototype.exportScenario = function(scenario, depopulate, callback) {
    if (typeof callback === 'undefined') {
        callback = depopulate;
        depopulate = false;
    }
    if (depopulate) {
        scenario.fragments = scenario.fragments.map(function(fragment) {
            return fragment._id;
        });
        scenario.domainmodel = scenario.domainmodel._id;
    }
    $.post(this.createURL("scenario/" + scenario._id),scenario,callback);
};

API.prototype.createScenario = function(name, callback) {
    var scenario = {
        name: name
    };
    console.log(scenario);
    $.post(this.createURL("scenario"),scenario,callback);
};

API.prototype.deleteFragment = function(id, callback) {
    $.ajax({
        url: this.createURL("fragment/" + id),
        type: 'DELETE',
        callback
    });
};

module.exports = new API(Config.API_HOST);
//module.exports = new API(Config.API_HOST);