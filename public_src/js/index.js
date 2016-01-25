var $ = jQuery = require('jquery');
window.$ = $;
var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var Bootstrap = require('bootstrap');
var API = require('./api');
var SideBarComponent = require('./react/sidebar');
var FragmentEditorComponent = require('./react/fragmenteditor');
var ScenarioEditorComponent = require('./react/scenarioeditor');
var DomainModelEditorComponent = require('./react/domainmodeleditor');
var IndexComponent = require('./react/index');
var ModalComponent = require('./react/modals');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;
var MessageBar = require('./react/messagebar');


var App = React.createClass({
    render: function() {
        return (
            <div className="app-container">
                <ModalComponent />
                <SideBarComponent />
                <div className="main-content">
                    <
                    {this.props.children}
                </div>
            </div>
        )
    }
});

$(function () {
    ReactDOM.render(
        <Router>
            <Route path="/" component={App}>
                <IndexRoute component={IndexComponent}/>
                <Route path="scenario/:id" component={ScenarioEditorComponent} />
                <Route path="fragment/:id" component={FragmentEditorComponent} />
                <Route path="domainmodel/:id" component={DomainModelEditorComponent} />
            </Route>
        </Router>,
        document.getElementById('app-container')
    );
});