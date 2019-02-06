var $ = jQuery = require('jquery');
window.$ = $;

var _ = require('lodash');
window._ = _;

var ReactDOM = require('react-dom');
var React = require('react');
var Bootstrap = require('bootstrap');
var ScenarioLoader = require('./react/scenarioloader');
var FragmentEditorComponent = require('./react/fragmenteditor/fragmenteditor');
var ScenarioEditorComponent = require('./react/scenarioeditor/scenarioeditor');
var DomainModelEditorComponent = require('./react/domainmodeleditor/DomainModelEditor');
var OLCEditorComponent = require('./react/olceditor');
var IndexComponent = require('./react/indexpage');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var ExportConfigComponent = require('./react/exportconfig/exportconfig');
var App = require('./react/index');

$(function () {
    ReactDOM.render(
        <Router>
            <Route path="/" component={App}>
                <IndexRoute component={IndexComponent}/>
                <Route path="scenario/" component={ScenarioLoader}>
                  <Route path=":scenarioId" component={ScenarioEditorComponent} />
                  <Route path=":scenarioId/fragment/:fragmentId" component={FragmentEditorComponent} />
                  <Route path=":scenarioId/domainmodel/:domainmodelId/dataclass/:dataclassId" component={DomainModelEditorComponent} />
                </Route>
                <Route path="exportconfig" component={ExportConfigComponent} />
            </Route>
        </Router>,
        document.getElementById('app-container')
    );
});
