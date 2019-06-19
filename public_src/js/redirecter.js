// This is currently just a mad hack to redirect the browser somewhere else.
// This should actually be done in a sane way through interacting with
// React-Router, but the interface of the old version that we are using
// is pretty bad :(

var Redirecter = function() {
};

Redirecter.prototype.redirectToIndex = function() {
    window.location.hash = "#";
};

Redirecter.prototype.redirectToScenario = function(scenarioId) {
    window.location.hash = "#/scenario/" + scenarioId;
};

Redirecter.prototype.redirectToFragment = function(scenarioId, fragmentId) {
    window.location.hash = "#/scenario/" + scenarioId + "/fragment/" + fragmentId;
};

Redirecter.prototype.redirectToDataclass = function(scenarioId, domainmodelId, dataclassId) {
    window.location.hash = "#/scenario/" + scenarioId + "/domainmodel/" + domainmodelId + "/dataclass/" + dataclassId;
};

module.exports = new Redirecter();