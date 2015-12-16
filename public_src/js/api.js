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

API.prototype.loadDomainModel = function(dmid, callback) {
    $.getJSON(this.createURL("domainmodel/" + dmid), callback);
};

API.prototype.exportDomainModel = function(dm, callback) {
    $.ajax({
        url: this.createURL("domainmodel/" + dm._id),
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(dm)
    });
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
};

API.prototype.exportFragment = function(fragment, callback) {
    $.post(this.createURL("fragment/" + fragment._id),fragment,callback);
};

API.prototype.exportScenario = function(scenario) {
    if(scenario.fragments) {
        scenario.fragments = scenario.fragments.map(function(fragment) {
            return fragment._id;
        });
    }
    if(scenario.domainmodel) {
        scenario.domainmodel = scenario.domainmodel._id;
    }
    $.ajax({
        url: this.createURL("scenario/" + scenario._id),
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(scenario)
    });
};

API.prototype.createScenario = function(name, callback) {
    var scenario = {
        name: name
    };
    $.post(this.createURL("scenario"),scenario,callback);
};

API.prototype.deleteFragment = function(id, callback) {
    $.ajax({
        url: this.createURL("fragment/" + id),
        type: 'DELETE',
        callback
    });
};

API.prototype.exportScenarioToChimera = function(scenid, targeturl, callback) {
    $.post(this.createURL("scenario/" + scenid + "/export"),{targeturl: targeturl},callback);
};

module.exports = new API(Config.API_HOST);
//module.exports = new API(Config.API_HOST);