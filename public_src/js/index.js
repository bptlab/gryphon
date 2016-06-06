var $ = jQuery = require('jquery');
window.$ = $;

var _ = require('lodash');
window._ = _;

var ReactDOM = require('react-dom');
var React = require('react');
var Bootstrap = require('bootstrap');
var FragmentEditorComponent = require('./react/fragmenteditor');
var ScenarioEditorComponent = require('./react/scenarioeditor/scenarioeditor');
var DomainModelEditorComponent = require('./react/domainmodeleditor/domainmodeleditor');
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
                <Route path="scenario/:id" component={ScenarioEditorComponent} />
                <Route path="fragment/:id" component={FragmentEditorComponent} />
                <Route path="domainmodel/:id" component={DomainModelEditorComponent} />
                <Route path="exportconfig" component={ExportConfigComponent} />
                <Route path="olc/:dmid/:dclassid" component={OLCEditorComponent} />
            </Route>
        </Router>,
        document.getElementById('app-container')
    );
});